/**
 * Created by Administrator on 2017/5/20.
 */
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import * as FontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as Net from '../utils/RequestUtil';
import * as appUrls from '../constant/appUrls';
import SQLiteUtil from '../utils/SQLiteUtil';
const {width} = Dimensions.get('window');
const SQLite = new SQLiteUtil();
import StorageUtil from '../utils/StorageUtil';
import * as StorageKeyNames from '../constant/storageKeyNames';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import TagSelectView from './component/TagSelectView';
import AddCarPricePop from './component/AddCarPricePop';

export default class AddCarPriceScene extends BaseComponent {

    constructor(props) {
        super(props);

        this.merge_id = this.props.navigation.state.params.merge_id;
        this.from = this.props.navigation.state.params.from;
        this.json = this.props.navigation.state.params.json;
        this.number = this.props.navigation.state.params.number;
        this.payment_id = this.props.navigation.state.params.payment_id;
        this.auto_id = this.props.navigation.state.params.auto_id;
        this.purchas_price = '';

        this.che300_mny = '0';

        if (this.props.navigation.state.params.purchas_price !== undefined) {
            this.purchas_price = this.props.navigation.state.params.purchas_price;
        }

        this.itemList = [];
        this.tagViews = [];
        this. tLend_mny = '';
        this. tRegion_rebate = '';
        this. tRegion_assess_mny = '';
        this.state = {
            renderItems: [],
            assessPop: false
        }
    }

    _showLoadingModal = () => {
        this.props.screenProps.showModal(true);
    };

    _closeLoadingModal = () => {
        this.props.screenProps.showModal(false);
    };

    _showHint = (hint) => {
        this.props.screenProps.showToast(hint);
    };

    initFinish = () => {
        this._showLoadingModal();
        this._getData();
    };

    _getData = () => {
        let maps = {
            merge_id: this.merge_id,
        };
        SQLite.selectData('select * from newcar where frame_number = ?',
            [this.number],
            (sqlDt) => {
                if (sqlDt.code === 1) {
                    let carD = sqlDt.result.rows.item(0);
                    maps.model_id = carD.model_id;
                    if (carD.init_reg === null || carD.init_reg === '') {
                        maps.init_reg = '0';
                    } else {
                        maps.init_reg = carD.init_reg;
                    }
                    maps.mileage = carD.mileage;

                    Net.request(appUrls.AUTOGETESTIMATEPRICE, 'post', maps).then(
                        (response) => {
                            this.che300_mny = response.mjson.retdata.price;
                            this._firstRender();
                        },
                        (error) => {
                            this._closeLoadingModal();
                            this._firstRender();
                        }
                    );
                }
            });

    };

    _firstRender = () => {

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

                if (this.json !== '') {
                    //后台有数据
                    let carD = (JSON.parse(this.json)).retdata;
                    this.itemList.push({
                        title: '事故',
                        value: '' + carD.accident,
                        dbName: 'accident',
                        type: 1,
                        canNull: false,
                        tag: '',
                    });
                    this.itemList.push({
                        title: '涉水',
                        value: '' + carD.wading,
                        dbName: 'wading',
                        type: 1,
                        canNull: false,
                        tag: '',
                    });
                    this.itemList.push({
                        title: '车况',
                        value: '' + carD.car_condition,
                        dbName: 'car_condition',
                        type: 1,
                        canNull: false,
                        tag: '',
                    });
                    let tempPosition = '';
                    if (carD.viewing_position === ''
                        || carD.viewing_position === {}
                        || carD.viewing_position === null)  {

                    } else {
                        tempPosition = carD.viewing_position;

                        if (typeof(tempPosition) === 'string') {
                            tempPosition = JSON.parse(tempPosition);
                        }

                        this.tagViews.map((tag) => {
                            tempPosition.map((inner) => {
                                if (tag.syscodedata_id === inner.syscodedata_id) {
                                    tag.check = true;
                                }
                            });
                        });
                    }
                    this.itemList.push({
                        title: '查看部位',
                        value: '',
                        dbName: 'viewing_position',
                        type: 2,
                        canNull: false,
                        tag: '',
                    });
                    this.itemList.push({
                        title: '备注',
                        value: '',
                        dbName: 'remark',
                        type: 3,
                        canNull: false,
                        tag: '',
                    });
                    this.itemList.push({
                        title: '评估放款额',
                        value: '',
                        dbName: 'lend_mny',
                        type: 4,
                        canNull: false,
                        tag: '',
                    });
                    this.itemList.push({
                        title: '车300',
                        value: this.che300_mny,
                        dbName: 'che300_mny',
                        type: 5,
                        canNull: false,
                        tag: '',
                    });
                    // this.itemList.push({
                    //     title: '车虫',
                    //     value: '0',
                    //     dbName: 'chechong_mny',
                    //     type: 5,
                    //     canNull: false,
                    //     tag: '',
                    // });
                    this.itemList.push({
                        title: '',
                        value: '',
                        dbName: '',
                        type: 6,
                        canNull: false,
                        tag: '',
                    });

                    SQLite.changeData('update newcar set accident = ?,wading = ?,'
                        + 'viewing_position = ?,car_condition =?,che300_mny = ?,chechong_mny = ?'
                        + 'where frame_number = ?', [carD.accident + '', carD.wading + '', JSON.stringify(tempPosition),
                        carD.car_condition + '', this.che300_mny, '0', this.number], () => {
                        this._closeLoadingModal();
                        this._setCarRender();
                    });

                } else {
                    //后台无数据
                    SQLite.selectData('select * from newcar where frame_number = ?',
                        [this.number],
                        (sqlDt) => {
                            if (sqlDt.code === 1) {
                                if (sqlDt.result.rows.length > 0) {
                                    let carD = sqlDt.result.rows.item(0);
                                    this.itemList.push({
                                        title: '事故',
                                        value: '' + carD.accident,
                                        dbName: 'accident',
                                        type: 1,
                                        canNull: false,
                                        tag: '',
                                    });
                                    this.itemList.push({
                                        title: '涉水',
                                        value: '' + carD.wading,
                                        dbName: 'wading',
                                        type: 1,
                                        canNull: false,
                                        tag: '',
                                    });
                                    this.itemList.push({
                                        title: '车况',
                                        value: '' + carD.car_condition,
                                        dbName: 'car_condition',
                                        type: 1,
                                        canNull: false,
                                        tag: '',
                                    });
                                    if (carD.viewing_position === '' || carD.viewing_position === {}
                                    || typeof(carD.viewing_position) === 'undefined') {
                                        console.log('333333', carD.viewing_position);
                                    } else {

                                        console.log('11111111111111111111111');
                                        let checkeds = carD.viewing_position;
                                        if (typeof(checkeds) === 'string') {
                                            checkeds = JSON.parse(checkeds);
                                        }

                                        this.tagViews.map((tag) => {
                                            checkeds.map((inner) => {
                                                if (tag.syscodedata_id === inner.syscodedata_id) {
                                                    tag.check = true;
                                                }
                                            });
                                        });
                                    }
                                    this.itemList.push({
                                        title: '查看部位',
                                        value: '',
                                        dbName: 'viewing_position',
                                        type: 2,
                                        canNull: false,
                                        tag: '',
                                    });
                                    this.itemList.push({
                                        title: '备注',
                                        value: carD.remark,
                                        dbName: 'remark',
                                        type: 3,
                                        canNull: false,
                                        tag: '',
                                    });
                                    this.itemList.push({
                                        title: '评估放款额',
                                        value: '',
                                        dbName: 'lend_mny',
                                        type: 4,
                                        canNull: false,
                                        tag: '',
                                    });
                                    this.itemList.push({
                                        title: '车300',
                                        value: this.che300_mny,
                                        dbName: 'che300_mny',
                                        type: 5,
                                        canNull: false,
                                        tag: '',
                                    });
                                    // this.itemList.push({
                                    //     title: '车虫',
                                    //     value: '0',
                                    //     dbName: 'chechong_mny',
                                    //     type: 5,
                                    //     canNull: false,
                                    //     tag: '',
                                    // });
                                    this.itemList.push({
                                        title: '',
                                        value: '',
                                        dbName: '',
                                        type: 6,
                                        canNull: false,
                                        tag: '',
                                    });
                                }
                            } else {
                                //本地无缓存
                                this.itemList.push({
                                    title: '事故',
                                    value: '',
                                    dbName: 'accident',
                                    type: 1,
                                    canNull: false,
                                    tag: '',
                                });
                                this.itemList.push({
                                    title: '涉水',
                                    value: '',
                                    dbName: 'wading',
                                    type: 1,
                                    canNull: false,
                                    tag: '',
                                });
                                this.itemList.push({
                                    title: '车况',
                                    value: '',
                                    dbName: 'car_condition',
                                    type: 1,
                                    canNull: false,
                                    tag: '',
                                });
                                this.itemList.push({
                                    title: '查看部位',
                                    value: '',
                                    dbName: 'viewing_position',
                                    type: 2,
                                    canNull: false,
                                    tag: '',
                                });
                                this.itemList.push({
                                    title: '备注',
                                    value: '',
                                    dbName: 'remark',
                                    type: 3,
                                    canNull: false,
                                    tag: '',
                                });
                                this.itemList.push({
                                    title: '评估放款额',
                                    value: '',
                                    dbName: 'lend_mny',
                                    type: 4,
                                    canNull: false,
                                    tag: '',
                                });
                                this.itemList.push({
                                    title: '车300',
                                    value: this.che300_mny,
                                    dbName: 'che300_mny',
                                    type: 5,
                                    canNull: false,
                                    tag: '',
                                });
                                // this.itemList.push({
                                //     title: '车虫',
                                //     value: '0',
                                //     dbName: 'chechong_mny',
                                //     type: 5,
                                //     canNull: false,
                                //     tag: '',
                                // });
                                this.itemList.push({
                                    title: '',
                                    value: '',
                                    dbName: '',
                                    type: 6,
                                    canNull: false,
                                    tag: '',
                                });
                            }
                            this._closeLoadingModal();
                            this._setCarRender();
                        });
                }
            } else {
                //取不到部位处理
            }
        });


    };

    _setCarRender = () => {

        let its = this.itemList.map((dt, index) => {
            return this._renderItem(dt, index)
        });

        console.log('its', its);
        this.setState({
            renderItems: its
        });
    };

    _renderItem = (data, index) => {

        if (data.type === 1) {
            let rdType = true;
            if (data.title === '车况') rdType = false;

            let sV = null;
            if (data.value !== '') {
                sV = Number.parseInt(data.value) - 1;
            }
            //带数据过来
            return (
                <View key={index} style={styles.type_one_wrap}>
                    <Text style={styles.type_one_star_mark}>*</Text>
                    <Text style={styles.type_one_left_title}>{data.title}</Text>
                    <View style={styles.fillSpace}/>
                    {
                        rdType ?
                            <RadioGroup
                                size={18}
                                thickness={2}
                                color={FontAndColor.txt_gray}
                                activeColor={'#FF0000'}
                                selectedIndex={sV}
                                style={styles.type_one_right_wrap}
                                onSelect={(index, value) => {
                                    this._onRadioClick(index, value, data.title)
                                }}>
                                <RadioButton value='1'>
                                    <Text>是</Text>
                                </RadioButton>

                                <RadioButton value='2'>
                                    <Text>否</Text>
                                </RadioButton>
                            </RadioGroup>
                            :
                            <RadioGroup
                                size={18}
                                thickness={2}
                                selectedIndex={sV}
                                color={FontAndColor.txt_gray}
                                activeColor={'#FF0000'}
                                style={styles.type_one_right_wrap}
                                onSelect={(index, value) => {
                                    this._onRadioClick(index, value, data.title)
                                }}>
                                <RadioButton value='1'>
                                    <Text>良好</Text>
                                </RadioButton>
                                <RadioButton value='2'>
                                    <Text>一般</Text>
                                </RadioButton>
                                <RadioButton value='3'>
                                    <Text>良好</Text>
                                </RadioButton>
                            </RadioGroup>
                    }
                </View>
            )
        } else if (data.type === 2) {
            console.log('tagViews', this.tagViews);
            return (
                <View key={index} style={styles.type_two_wrap}>
                    <Text style={styles.type_two_title}>{'查看部位'}</Text>
                    <TagSelectView ref={(ref) => {
                        this.tagRef = ref;
                    }}
                                   onTagClick={this._onTagClick} cellData={this.tagViews}/>
                </View>
            )
        } else if (data.type === 3) {

            let tP = '请输入' + data.title;
            return (
                <View key={index} style={styles.type_three_wrap}>
                    <Text style={styles.type_three_star_mark}>*</Text>
                    <Text style={styles.type_three_left_title}>{data.title}</Text>
                    <View style={styles.fillSpace}/>
                    <TextInput style={styles.type_three_right_input}
                               defaultValue={data.value}
                               underlineColorAndroid='transparent'
                               placeholder={tP}
                               onChangeText={this._onRemarkChange}
                    />
                </View>
            )
        } else if (data.type === 4) {
            return (
                <View key={index} style={styles.fillSpace}>
                    <TouchableOpacity style={styles.type_four_wrap} activeOpacity={0.6} onPress={this._openPop}>
                        <Text style={styles.type_four_star_mark}>*</Text>
                        <Text style={styles.type_four_left_title}>评估定价</Text>
                        <View style={styles.fillSpace}/>
                        <Text style={styles.type_four_right_value}>{this.tRegion_assess_mny + '万元'}</Text>
                    </TouchableOpacity>
                    <View style={styles.type_four_wrap}>
                        <Text style={styles.type_four_star_mark}>*</Text>
                        <Text style={styles.type_four_left_title}>折扣率</Text>
                        <View style={styles.fillSpace}/>
                        <Text style={styles.type_four_right_value}>{this.tRegion_rebate + '%'}</Text>
                    </View>
                    <View style={styles.type_four_wrap}>
                        <Text style={styles.type_four_star_mark}>*</Text>
                        <Text style={styles.type_four_left_title}>评估放款额</Text>
                        <View style={styles.fillSpace}/>
                        <Text style={styles.type_four_right_value}>{this.tLend_mny + '万元'}</Text>
                    </View>
                </View>

            )
        } else if (data.type === 5) {
            return (
                <View key={index} style={styles.type_five_wrap}>
                    <View style={styles.type_five_title_wrap}>
                        <Text style={styles.type_five_title_text}>参考价格</Text>
                    </View>
                    <View style={styles.type_five_content_wrap}>
                        <Text style={styles.type_five_content_left_title}>综合参考价</Text>
                        <View style={styles.fillSpace}/>
                        <Text style={styles.type_five_content_right_value}>{data.value + '万元'}</Text>
                    </View>
                </View>
            )
        } else if (data.type === 6) {
            return (
                <View key={index} style={styles.bottom_btn_wrap}>
                    <TouchableOpacity
                        style={styles.bottom_btn_border}
                        activeOpacity={0.6}
                        onPress={this._onNextSceneClick}
                    >
                        <Text style={styles.bottom_btn_text}>下一步</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    };

    //下一步
    _onNextSceneClick = ()=>{
        if(this.tLend_mny === ''){
            this._showHint('评估放款额不为空');
            return;
        }else{
            this.toNextPage('AddCarImageScene',{
                merge_id:this.merge_id,
                from:this.from,
                json:this.json,
                number:this.number,
                auto_id:this.auto_id,
                payment_id:this.payment_id,
                purchas_price:this.purchas_price
            });
        }
    };

    //Radio Button点击
    _onRadioClick = (index, value, title) => {
        if (title === '事故') {
            this.itemList[0].value = value;
            SQLite.changeData('update newcar set accident = ? where frame_number = ?',
                [value, this.number],
                () => {
                })
        } else if (title === '涉水') {
            this.itemList[1].value = value;
            SQLite.changeData('update newcar set wading = ? where frame_number = ?',
                [value, this.number],
                () => {
                })
        } else if (title === '车况') {
            this.itemList[2].value = value;
            SQLite.changeData('update newcar set car_condition = ? where frame_number = ?',
                [value, this.number],
                () => {
                })
        }
    };

    //tag选择
    _onTagClick = (dt, index) => {
        this.tagViews[index].check = !this.tagViews[index].check;
        this.tagRef.refreshData(this.tagViews);

        let checked = [];
        this.tagViews.map((m) => {
            if (m.check) {
                checked.push(m);
            }
        });
        SQLite.changeData('update newcar set viewing_position = ? where frame_number = ?',
            [JSON.stringify(checked), this.number], () => {
            });

    };

    //输入备注
    _onRemarkChange = (text) => {
        this.itemList[4].value = text;
        SQLite.changeData('update newcar set remark = ? where frame_number = ?',
            [text, this.number], () => {
            });
    };

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
            merge_id: this.merge_id,
            region_assess_mny: price
        };

        SQLite.selectData('select * from newcar where frame_number = ?',
            [this.number],
            (sqlDt) => {
                let carD = sqlDt.result.rows.item(0);
                console.log('bendisql', carD);

                if (carD.init_reg === null || carD.init_reg === '') {
                    maps.init_reg = '0';
                } else {
                    maps.init_reg = carD.init_reg;
                }

                if (carD.certification === null || carD.certification === '') {
                    maps.certification = '0';
                } else {
                    maps.certification = carD.certification;
                }
                maps.model_id = carD.model_id;
                maps.is_new = carD.is_new;
                maps.manufacture = carD.manufacture;


                Net.request(appUrls.AUTOGETREBATEMNY, 'post', maps).then(
                    (response) => {
                        this._closePop();
                        let rb = response.mjson;
                        SQLite.changeData('update newcar set lend_mny = ?,region_rebate = ?,region_assess_mny = ? where frame_number = ?'
                            , [rb.retdata.lend_mny+ '', rb.retdata.region_rebate+ '', price, this.number], () => {
                                this.tLend_mny = rb.retdata.lend_mny + '';
                                this.tRegion_rebate = rb.retdata.region_rebate+'';
                                this.tRegion_assess_mny = price;
                                this._setCarRender();
                            });
                    },
                    (error) => {
                        this._showHint('服务器请求失败，请重新请求');
                    });
            });

    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <ScrollView style={[styles.fillSpace, {width: width}]} showsVerticalScrollIndicator={false}>
                        {
                            this.state.renderItems
                        }
                    </ScrollView>
                </View>
                <AllNavigationView title={'添加车辆'} backIconClick={() => {
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
        backgroundColor: FontAndColor.all_background,
        alignItems: 'center'
    },
    fillSpace: {
        flex: 1
    },
    type_one_wrap: {
        height: Pixel.getPixel(46),
        backgroundColor: FontAndColor.white,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: FontAndColor.line_gray
    },
    type_one_star_mark: {
        marginLeft: Pixel.getPixel(15),
        color: 'rgba(0,0,0,0)',
        fontSize: Pixel.getFontPixel(17)
    },
    type_one_left_title: {
        marginLeft: Pixel.getPixel(2),
        color: FontAndColor.black,
        fontSize: Pixel.getFontPixel(14)
    },
    type_one_right_wrap: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    type_two_wrap: {
        backgroundColor: FontAndColor.white,
        padding: Pixel.getPixel(15),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: FontAndColor.line_gray
    },
    type_two_title: {
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.txt_gray,
        marginBottom: Pixel.getPixel(10)
    },
    type_three_wrap: {
        height: Pixel.getPixel(46),
        backgroundColor: FontAndColor.white,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: FontAndColor.line_gray
    },
    type_three_star_mark: {
        marginLeft: Pixel.getPixel(15),
        color: 'rgba(0,0,0,0)',
        fontSize: Pixel.getFontPixel(17)
    },
    type_three_left_title: {
        marginLeft: Pixel.getPixel(2),
        color: FontAndColor.black,
        fontSize: Pixel.getFontPixel(14)
    },
    type_three_right_input: {
        width: Pixel.getPixel(240),
        marginRight: Pixel.getPixel(15),
        textAlign: 'right',
        color: FontAndColor.black,
        fontSize: Pixel.getFontPixel(14)
    },
    type_four_wrap: {
        height: Pixel.getPixel(46),
        backgroundColor: FontAndColor.white,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: FontAndColor.line_gray
    },
    type_four_star_mark: {
        marginLeft: Pixel.getPixel(15),
        color: 'red',
        fontSize: Pixel.getFontPixel(17)
    },
    type_four_left_title: {
        marginLeft: Pixel.getPixel(2),
        color: FontAndColor.black,
        fontSize: Pixel.getFontPixel(14)
    },
    type_four_right_value: {
        width: Pixel.getPixel(240),
        textAlign: 'right',
        marginRight: Pixel.getPixel(15),
        color: FontAndColor.txt_gray,
        fontSize: Pixel.getFontPixel(14),
    },
    type_five_wrap: {
        height: Pixel.getPixel(76),
        backgroundColor: FontAndColor.white
    },
    type_five_title_wrap: {
        height: Pixel.getPixel(30),
        backgroundColor: FontAndColor.all_background,
        justifyContent: 'center'
    },
    type_five_title_text: {
        marginLeft: Pixel.getPixel(15),
        color: FontAndColor.txt_gray
    },
    type_five_content_wrap: {
        height: Pixel.getPixel(46),
        backgroundColor: FontAndColor.white,
        flexDirection: 'row',
        alignItems: 'center'
    },
    type_five_content_left_title: {
        marginLeft: Pixel.getPixel(15),
        color: FontAndColor.black,
        fontSize: Pixel.getFontPixel(14)
    },
    type_five_content_right_value: {
        width: Pixel.getPixel(240),
        textAlign: 'right',
        marginRight: Pixel.getPixel(15),
        color: FontAndColor.txt_gray,
        fontSize: Pixel.getFontPixel(14)
    },

    bottom_btn_wrap: {
        height: Pixel.getPixel(60),
        width: width,
        backgroundColor: FontAndColor.all_background
    },
    bottom_btn_border: {
        flex: 1,
        marginHorizontal: Pixel.getPixel(15),
        marginVertical: Pixel.getPixel(8),
        backgroundColor: FontAndColor.all_blue,
        borderRadius: Pixel.getPixel(5),
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottom_btn_text: {
        color: FontAndColor.white,
        fontSize: Pixel.getFontPixel(17)
    }
});