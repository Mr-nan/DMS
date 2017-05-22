/**
 * Created by Administrator on 2017/5/18.
 */
import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import * as FontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
const {width} = Dimensions.get('window');
import * as Net from '../utils/RequestUtil';
import * as appUrls from '../constant/appUrls';
import StorageUtil from '../utils/StorageUtil';
import * as StorageKeyNames from '../constant/storageKeyNames';

import ImageViewPage from 'react-native-viewpager';
import TagSelectView from './component/TagSelectView';
import AddCarPricePop from './component/AddCarPricePop';

export default class CarInfoScene extends BaseComponent {

    constructor(props) {
        super(props);

        const {from_name, auto_id, is_time_out, payment_id, merge_id} = this.props.navigation.state.params;
        let pgdqFlag = is_time_out === 1;
        let deleteFlag = from_name.trim() !== 'PurchaseCarScene';

        this.state = {
            from_name: from_name,
            auto_id: auto_id,
            is_time_out: is_time_out,
            payment_id: payment_id,
            merge_id: merge_id,
            pgdqFlag: pgdqFlag,
            deleteFlag: deleteFlag,
            assessFlag: false,
            loadFunction: false,
            accessText: '评估',
            renderItems: [],
            assessPop: false
        };

        this.tagViews = [];
    }

    initFinish = () => {
        StorageUtil.mGetItem(StorageKeyNames.TAG_VIEW, (data) => {
            if (data.code == 1) {
                let tags = JSON.parse(data.result);
                tags.map((tg) => {
                    this.tagViews.push({
                        name: tg.name,
                        syscodedata_id: tg.syscodedata_id,
                        check: false
                    })
                });

                this._getData();
            } else {
                Net.request(appUrls.AUTOGETVIEWINGPOSITION, 'post', {}).then(
                    (response) => {
                        let tags = response.mjson.retdata;
                        tags.map((tg) => {
                            this.tagViews.push({
                                name: tg.name,
                                syscodedata_id: tg.syscodedata_id,
                                check: false
                            })
                        });
                        this._getData();
                    },
                    (error) => {
                        this.backPage();
                    });
            }
        });
    };

    _showLoadingModal = () => {
        this.props.screenProps.showModal(true);
    };

    _closeLoadingModal = () => {
        this.props.screenProps.showModal(false);
    };

    _showHint = (hint) => {
        this.props.screenProps.showToast(hint);
    };

    _renderAllItem = (carInfo) => {

        let renderSource = [];
        renderSource.push({
            title: '基本信息',
            type: '1',
            value: ''
        });

        this.number = carInfo.frame_number;
        this.certification = carInfo.certification;
        this.is_new = carInfo.is_new;
        this.model_id = carInfo.model_id;


        if (carInfo.is_reg === 2) {
            this.setState({
                accessText: '编辑',
                assessFlag: true
            });
        } else if (carInfo.is_reg === 1 && this.state.from_name !== 'OneCarListScene') {
            this.setState({
                accessText: '评估',
                assessFlag: true
            });
        }

        if (carInfo.is_edit === 0 && this.state.from_name !== 'StockTopCarScene') {
            this.setState({
                assessFlag: false
            });
        }

        if (this.state.from_name === 'PurchaseCarScene') {
            this.setState({
                assessFlag: false
            });
        }

        let car_type = '';
        switch (carInfo.is_new) {
            case '1':
                car_type = "二手车";
                break;
            case '2':
                car_type = "新车";
                break;
            case '3':
                car_type = "平行进口车";
                break;

            default:
                car_type = '-';
                break;
        }
        renderSource.push({
            title: '车辆类型',
            type: '2',
            value: car_type
        });
        renderSource.push({
            title: '车架号',
            type: '2',
            value: carInfo.frame_number
        });
        renderSource.push({
            title: '车型',
            type: '2',
            value: carInfo.model_name
        });
        renderSource.push({
            title: '排量',
            type: '2',
            value: carInfo.displacement
        });
        renderSource.push({
            title: '发动机号',
            type: '2',
            value: carInfo.engine_number
        });
        renderSource.push({
            title: '车身颜色',
            type: '2',
            value: carInfo.car_color
        });
        renderSource.push({
            title: '内饰颜色',
            type: '2',
            value: carInfo.trim_color
        });
        renderSource.push({
            title: '车牌号',
            type: '2',
            value: carInfo.plate_number
        });

        if (car_type === "二手车") {
            renderSource.push({
                title: '初登日期',
                type: '2',
                value: carInfo.init_reg
            });
        } else {
            renderSource.push({
                title: '发证日期',
                type: '2',
                value: carInfo.certification
            });
        }

        renderSource.push({
            title: '出产日期',
            type: '2',
            value: carInfo.manufacture
        });
        renderSource.push({
            title: '行驶里程',
            type: '2',
            value: carInfo.mileagestr
        });
        renderSource.push({
            title: '过户次数',
            type: '2',
            value: carInfo.transfer_count + '次'
        });

        let nature_use = '';
        switch (carInfo.nature_use) {
            case "1":
                nature_use = "运营";
                break;
            case "2":
                nature_use = "非运营";
                break;
            case "3":
                nature_use = "租赁非运营";
                break;
            default:
                nature_use = "-";
                break;
        }
        renderSource.push({
            title: '使用性质',
            type: '2',
            value: nature_use
        });
        let record_type = carInfo.record_type === '1' ? "放款入库" : "置换入库";
        renderSource.push({
            title: '入库类型',
            type: '2',
            value: record_type
        });
        renderSource.push({
            title: '监管地点',
            type: '2',
            value: carInfo.place_name
        });
        renderSource.push({
            title: '备注',
            type: '2',
            value: carInfo.remark
        });
        renderSource.push({
            title: '评估信息',
            type: '1',
            value: ''
        });
        let accident = carInfo.accident === '1' ? '是' : '否';
        renderSource.push({
            title: '事故',
            type: '2',
            value: accident
        });
        let wading = carInfo.wading === '1' ? '是' : '否';
        renderSource.push({
            title: '涉水',
            type: '2',
            value: wading
        });

        let car_condition = "";
        if (carInfo.car_condition === '1') {
            car_condition = "良好";
        } else if (carInfo.car_condition === '2') {
            car_condition = "一般";
        } else if (carInfo.car_condition === '3') {
            car_condition = "较差";
        }

        renderSource.push({
            title: '车况',
            type: '2',
            value: car_condition
        });

        if (carInfo.viewing_position === '' || carInfo.viewing_position === {}) {

        } else {
            this.tagViews.map((tag) => {
                carInfo.viewing_position.map((inner) => {
                    if (tag.syscodedata_id === inner.syscodedata_id) {
                        tag.check = true;
                    }
                });
            });
        }
        renderSource.push({
            title: '',
            type: '3',
            value: this.tagViews
        });

        renderSource.push({
            title: '评定价格',
            type: '2',
            value: carInfo.region_assess_mny_str
        });
        renderSource.push({
            title: '折扣率',
            type: '2',
            value: carInfo.region_rebate_str
        });
        renderSource.push({
            title: '评估放款额',
            type: '2',
            value: carInfo.lend_mny_str
        });
        renderSource.push({
            title: '综合参考价',
            type: '2',
            value: carInfo.che300_mny_str + '万元'
        });
        if (carInfo.files !== null) {
            renderSource.push({
                title: '',
                type: '4',
                value: carInfo.files
            });
        }

        renderSource.push({
            title: '',
            type: '5',
            value: ''
        });

        let its = renderSource.map((dt, index) => {
            return this._renderItem(dt, index)
        });

        this.setState({
            renderItems: its
        });

    };

    _deleteData = () => {

        this._showLoadingModal();
        let url = '';
        let maps = {};
        if (this.state.from_name === 'StockBottomScene' || this.state.from_name === 'StockTopCarScene') {
            url = appUrls.INVENTORYFINANCINGDELAUTO;
            maps.auto_id = this.state.auto_id;
        } else if (this.state.from_name === 'OneCarListScene') {
            url = appUrls.ONECARDELAUTO;
            maps.auto_id = this.state.auto_id;
        }

        Net.request(url, 'post', maps).then(
            (response) => {
                this._closeLoadingModal();
                this._showHint('删除成功');
                this.backPage();
                this.props.refreshLastPage;
            },
            (error) => {
                this._closeLoadingModal();
            });
    };

    _renderItem = (data, index) => {
        if (data.type === '1') {
            //内容的Title
            return (
                <View key={index} style={styles.content_title_wrap}>
                    <View style={styles.content_title_text_wrap}>
                        <Text style={styles.content_title_text}>{data.title}</Text>
                    </View>
                    <View style={styles.content_line_split}/>
                </View>
            )
        } else if (data.type === '2') {
            return (
                <View key={index} style={styles.content_base_wrap}>
                    <View style={styles.content_base_text_wrap}>
                        <Text style={styles.content_base_left}>{data.title}</Text>
                        <Text style={styles.content_base_Right}>{data.value}</Text>
                    </View>
                    <View style={styles.content_line_split}/>
                </View>
            )
        } else if (data.type === '3') {
            return (
                <View key={index}>
                    <View style={styles.content_tag_wrap}>
                        <Text style={styles.content_tag_title}>{'查看部位'}</Text>
                        <TagSelectView cellData={this.tagViews}/>
                    </View>
                    <View style={styles.content_line_split}/>
                </View>

            )
        } else if (data.type === '4') {
            return (
                <View key={index} style={styles.content_image_wrap}>
                    <ImageViewPage
                        dataSource={new ImageViewPage.DataSource({pageHasChanged: (r1, r2) => r1 !== r2}).cloneWithPages(data.value)}
                        renderPage={this._renderImagePage}
                        isLoop={false}                        //是否可以循环
                        autoPlay={false}                      //是否自动
                        initialPage={0}       //指定初始页面的index
                        locked={false}
                    />
                </View>
            )
        } else if (data.type === '5') {
            return (
                <View key={index} style={styles.content_blank_bottom}/>
            )
        }
    };

    _renderImagePage = (data) => {
        return (
            <View style={styles.content_image_btn}>
                <Image style={styles.content_image_btn} source={{uri: data.fileurl}}/>
            </View>
        )
    };

    _getData = () => {
        let url = '';
        let maps = {};
        if (this.state.from_name === 'StockBottomScene') {
            url = appUrls.INVENTORYFINANCINGGETAUTOINFO;
            maps.auto_id = this.state.auto_id
        } else if (this.state.from_name === 'OneCarListScene') {
            url = appUrls.ONECARGETAUTOINFO;
            maps.auto_id = this.state.auto_id
        } else if (this.state.from_name === 'StockTopCarScene') {
            url = appUrls.INVENTORYFINANCINGGETAUTOINFO;
            maps.auto_id = this.state.auto_id
        } else if (this.state.from_name === 'PurchaseCarScene') {
            url = appUrls.WHOLESTOCKPILEGETAUTOINFO;
            maps.auto_base_id = this.state.auto_id
        }
        this._showLoadingModal();
        Net.request(url, 'post', maps).then(
            (response) => {
                let carInfo = response.mjson.retdata;
                this._getPrice(carInfo);
            },
            (error) => {
                this.backPage();
            });

    };

    _getPrice = (carInfo) => {

        let maps = {
            merge_id: this.state.merge_id,
            init_reg: carInfo.init_reg,
            mileage: carInfo.mileage,
            model_id: carInfo.model_id,
        };

        Net.request(appUrls.AUTOGETESTIMATEPRICE, 'post', maps).then(
            (response) => {
                this._closeLoadingModal();
                let price = response.mjson.retdata.price;
                carInfo.che300_mny_str = price;
                this._renderAllItem(carInfo);
            },
            (error) => {
                this._closeLoadingModal();
                this._showHint('服务器请求失败，请重新请求');
            });

    };

    //二次评估弹框
    _openPop = () => {
        this.setState({
            assessPop: true
        });
    };

    _closePop = () => {
        this.setState({
            assessPop: false
        });
    };

    _onOkClick = (price) => {
        let maps = {
            auto_id: this.state.auto_id,
            certification: this.certification,
            is_new: this.state.is_new,
            merge_id: this.state.merge_id,
            model_id: this.state.model_id,
            region_assess_mny: price
        };
        Net.request(appUrls.INVENTORYFINANCINGRESETPRICE, 'post', maps).then(
            (response) => {
                this._closePop();
                this._getData();
            },
            (error) => {
                this._showHint('服务器请求失败，请重新请求');
            });
    };


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <ScrollView style={styles.fillSpace} showsVerticalScrollIndicator={false}>
                        {
                            this.state.renderItems
                        }
                    </ScrollView>
                    {
                        this.state.pgdqFlag &&
                        <View style={styles.pgdqWrap}>
                            <Text style={styles.pgdqFont}>{'评估即将到期！请尽快评估'}</Text>
                        </View>
                    }

                    <View style={styles.btnWrap}>
                        {
                            this.state.assessFlag &&
                            <TouchableOpacity style={styles.pgBtn} onPress={() => {
                                this._openPop();
                            }}>
                                <Text style={styles.btnFont}>{this.state.accessText}</Text>
                            </TouchableOpacity>
                        }
                        {
                            this.state.deleteFlag &&
                            <TouchableOpacity activeOpacity={0.6}
                                              style={styles.deleteBtn}
                                              onPress={this._deleteData}>
                                <Text style={styles.btnFont}>{'删除'}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <AllNavigationView title={'车辆信息'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
                {
                    this.state.assessPop && <AddCarPricePop
                        closePop={this._closePop}
                        onOkClick={this._onOkClick}
                    />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapContainer: {
        flex: 1,
        marginTop: Pixel.getTitlePixel(68),
        backgroundColor: FontAndColor.all_background
    },
    pgdqWrap: {
        height: Pixel.getPixel(30),
        width: width,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 0
    },
    pgdqFont: {
        fontSize: Pixel.getFontPixel(15),
        color: 'rgba(255,0,0,0.4)'
    },
    btnWrap: {
        height: Pixel.getPixel(45),
        width: width,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: Pixel.getPixel(5),
        left: 0
    },
    pgBtn: {
        flex: 1,
        marginHorizontal: Pixel.getPixel(15),
        backgroundColor: '#76C8C2',
        borderRadius: Pixel.getPixel(8),
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteBtn: {
        flex: 1,
        marginHorizontal: Pixel.getPixel(15),
        backgroundColor: '#f79578',
        borderRadius: Pixel.getPixel(8),
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnFont: {
        fontSize: Pixel.getFontPixel(18),
        color: FontAndColor.white
    },
    fillSpace: {
        flex: 1
    },
    content_title_wrap: {
        height: Pixel.getPixel(31),
        minHeight: Pixel.getPixel(31),
        backgroundColor: FontAndColor.all_background,
    },
    content_title_text_wrap: {
        flex: 1,
        justifyContent: 'center'
    },
    content_title_text: {
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(12),
        color: FontAndColor.txt_gray,
    },
    content_line_split: {
        height: 1,
        backgroundColor: FontAndColor.line_gray
    },
    content_base_wrap: {
        height: Pixel.getPixel(46),
        minHeight: Pixel.getPixel(46),
        backgroundColor: FontAndColor.white
    },
    content_base_text_wrap: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },
    content_base_left: {
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.txt_gray
    },
    content_base_Right: {
        flex: 1,
        marginRight: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.black,
        textAlign: 'right'
    },
    content_tag_wrap: {
        backgroundColor: FontAndColor.white,
        padding: Pixel.getPixel(15),
    },
    content_tag_title: {
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.txt_gray,
        marginBottom: Pixel.getPixel(10)
    },
    content_image_wrap: {
        padding: Pixel.getPixel(15),
        backgroundColor: FontAndColor.white,
    },
    content_image_btn: {
        height: Pixel.getPixel(220),
        width: width - Pixel.getPixel(30)
    },
    content_blank_bottom: {
        backgroundColor: FontAndColor.white,
        height: Pixel.getPixel(45)
    }

});