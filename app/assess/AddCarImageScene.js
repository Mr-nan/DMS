/**
 * Created by Administrator on 2017/5/25.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    TouchableOpacity,
    Dimensions,
    Platform,
}   from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import * as fontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
import CarUpImageCell from './component/CarUpImageCell';
import SQLiteUtil from '../utils/SQLiteUtil';
const SQLite = new SQLiteUtil();

import * as Net from '../utils/RequestUtil';
import * as AppUrls from '../constant/appUrls';

const Pixel = new PixelUtil();
const sceneWidth = Dimensions.get('window').width;
const IS_ANDROID = Platform.OS === 'android';

export default class CarUpImageScene extends BaseComponent {

    // 构造
    constructor(props) {
        super(props);

        this.merge_id = this.props.navigation.state.params.merge_id;
        this.from = this.props.navigation.state.params.from;
        this.json = this.props.navigation.state.params.json;
        this.number = this.props.navigation.state.params.number;
        this.auto_id = this.props.navigation.state.params.auto_id;
        this.payment_id = this.props.navigation.state.params.payment_id;
        this.purchas_price = this.props.navigation.state.params.purchas_price;

        this.baseTitleData = [];
        this.results = [];

        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource,
        };
    }

    componentWillMount() {
        if (this.json !== '') {
            //后台有数据
            let carD = (JSON.parse(this.json)).retdata;
            if (carD.files !== '' && carD.files.length > 0) {
                carD.files.map((dt) => {

                    let sql = 'select * from carimage where ' +
                        'frame_number = ? and syscodedata_id = ? and file_id = ?';
                    SQLite.selectData(sql, [this.number, dt.syscodedata_id, dt.file_id],
                        (sqlDt) => {
                            if (sqlDt.code === 1) {
                                if (sqlDt.result.rows.length > 0) {
                                    SQLite.changeData('update carimage set file_url = ?,file_name = ? where '
                                        + 'frame_number = ? and syscodedata_id = ? and file_id = ?',
                                        [dt.fileurl, dt.name, this.number, dt.syscodedata_id, dt.file_id]);
                                } else {
                                    SQLite.changeData('insert into carimage (file_url,file_name,'
                                        + 'frame_number,syscodedata_id,file_id) values (?,?,?,?,?)',
                                        [dt.fileurl, dt.name, this.number, dt.syscodedata_id, dt.file_id])
                                }
                            }
                        });
                });
            }
        }
    }

    initFinish = () => {
        this._getData();
    };

    _getData = () => {
        Net.request(AppUrls.AUTOGETATTACHMENTLIST, 'post', {}).then(
            (response) => {
                let rb = response.mjson.retdata;
                this._setFirstRender(rb);
            },
            () => {

            });
    };

    _setFirstRender = (dt) => {

        dt.map((m) => {
            this.baseTitleData.push({
                syscodedata_id: m.syscodedata_id,
                name: m.name,
                subTitle: '至多4张',
                number: 4,
                imgArray: [],
                explain: '0',
            })
        });

        SQLite.selectData('select * from carimage where frame_number = ?', [this.number],
            (sqlDt) => {
                if (sqlDt.code === 1) {
                    let sD = sqlDt.result.rows;
                    if (sD.length > 0) {

                        for (let i = 0; i < sD.length; i++) {
                            console.log('item', sD.item(i));
                            this.baseTitleData.map((m) => {
                                if (sD.item(i).syscodedata_id === m.syscodedata_id) {
                                    m.imgArray.push({
                                        file_id: sD.item(i).file_id,
                                        file_url: sD.item(i).file_url,
                                        syscodedata_id: sD.item(i).syscodedata_id
                                    });
                                    this.results.push({
                                        file_id: sD.item(i).file_id,
                                        file_url: sD.item(i).file_url,
                                        syscodedata_id: sD.item(i).syscodedata_id
                                    });
                                }
                            });
                        }

                    }
                }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.baseTitleData)
                });
            });

    };

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.rootContainer}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    renderFooter={this.renderFooter}
                />
                <AllNavigationView title={'添加车辆'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>)
    }

    renderSeparator(sectionId, rowId) {
        return (
            <View style={styles.Separator} key={sectionId + rowId}>
            </View>
        )
    }

    renderFooter = () => {
        return (
            <View style={styles.footContainer}>
                <TouchableOpacity onPress={this.footBtnClick}>
                    <View style={styles.footView}>
                        <Text style={styles.footText}>下一步</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    renderRow = (data) => {
        return (
            <CarUpImageCell
                results={this.results}
                retureSaveAction={(action, fileId, fileUrl) => {
                    this._retureSaveAction(action, fileId, fileUrl, data.syscodedata_id)
                }}
                showModal={(value) => {
                    this.props.screenProps.showModal(value)
                }}
                showToast={(value) => {
                    this.props.screenProps.showToast(value)
                }}
                items={data}
                childList={data.imgArray}
            />
        )
    };

    _retureSaveAction = (action, fileID, fileUrl, syscode) => {
        if (action === '1') {
            SQLite.changeData('insert into carimage (file_url,file_name,'
                + 'frame_number,syscodedata_id,file_id) values (?,?,?,?,?)',
                [fileUrl, '', this.number, syscode, fileID]);
        } else if (action === '0') {
            SQLite.changeData('delete from carimage where ' +
                'frame_number = ? and syscodedata_id = ? and file_id = ?',
                [this.number, syscode, fileID]);
        }
    };

    footBtnClick = () => {
        if (this._isVinEmpty() === true) {
            this.showToast('请上传车架号照片');
            return;
        }
        this._requestData();
    };

    _requestData = () => {
        let maps = {
            merge_id: this.merge_id,
            payment_id: this.payment_id
        };
        SQLite.selectData('select * from newcar where frame_number = ?',
            [this.number],
            (sqlDt) => {
                if (sqlDt.code === 1) {
                    if (sqlDt.result.rows.length > 0) {
                        let carD = sqlDt.result.rows.item(0);
                        maps.accident = carD.accident;
                        maps.brand_id = carD.brand_id;
                        maps.car_color = carD.car_color;
                        maps.car_condition = carD.car_condition;

                        let certification = carD.certification;
                        if (this._isEmpty(certification) === true) {
                            certification = '0';
                        }
                        maps.certification = certification;

                        let che300_mny = carD.che300_mny;
                        if (this._isEmpty(che300_mny) === true) {
                            che300_mny = '0';
                        }
                        maps.che300_mny = che300_mny;

                        let chechong_mny = carD.chechong_mny;
                        if (this._isEmpty(chechong_mny) === true) {
                            chechong_mny = '0';
                        }
                        maps.che300_mny = chechong_mny;

                        maps.displacement = carD.displacement;
                        maps.engine_number = carD.engine_number;
                        maps.frame_number = carD.frame_number;

                        let init_reg = carD.init_reg;
                        if (this._isEmpty(init_reg) === true) {
                            init_reg = '0';
                        }
                        maps.init_reg = init_reg;

                        maps.is_new = carD.is_new;
                        maps.lend_mny = carD.lend_mny;
                        maps.manufacture = carD.manufacture;
                        maps.mileage = carD.mileage;
                        maps.model_id = carD.model_id;

                        let nature_use = carD.nature_use;
                        if (this._isEmpty(nature_use) === true) {
                            nature_use = '0';
                        }
                        maps.nature_use = nature_use;

                        let plate_number = carD.plate_number;
                        if (this._isEmpty(plate_number) === true) {
                            plate_number = '0';
                        }
                        maps.plate_number = plate_number;

                        maps.record_type = carD.record_type;
                        maps.region_assess_mny = carD.region_assess_mny;
                        maps.region_rebate = carD.region_rebate;
                        maps.remark = carD.remark;
                        maps.series_id = carD.series_id;

                        if (carD.storage_id === '0') {
                            maps.storage_id = '';
                        } else {
                            maps.storage_id = carD.storage_id;
                        }

                        let transfer_count = carD.transfer_count;
                        if (this._isEmpty(transfer_count) === true) {
                            transfer_count = '0';
                        }
                        maps.transfer_count = transfer_count;

                        let viewing_position = '';
                        if (this._isEmpty(carD.viewing_position) === false) {
                            let vp = JSON.parse(carD.viewing_position);
                            vp.map((m) => {
                                viewing_position += (m.syscodedata_id + ',');
                            });
                            if (viewing_position.length > 0) {
                                viewing_position = viewing_position.substring(0, viewing_position.length - 1);
                            }

                        }

                        maps.viewing_position = viewing_position;
                        maps.trim_color = carD.trim_color;
                        maps.wading = carD.wading;

                        if (this.results.length > 0) {
                            let files = [];
                            this.results.map((rm) => {
                                files.push({
                                    file_id: rm.file_id,
                                    syscodedata_id: rm.syscodedata_id
                                })
                            });
                            maps.files = JSON.stringify(files);
                        } else {
                            this.showToast("数据丢失，请重新录入");
                            return;
                        }

                        let requestUrl = '';
                        if (this.from === 'StockTopCarScene' && this._isEmpty(this.json) === false) {
                            requestUrl = AppUrls.INVENTORYFINANCINGADDWHOLESTOCKPILEAUTO;
                            maps.auto_base_id = this.auto_id;
                            this.backRoute = 'StockTopCarScene';
                        } else if (this.from === 'OneCarListScene' && this._isEmpty(this.json) === false) {
                            requestUrl = AppUrls.ONECARADDWHOLESTOCKPILEAUTO;
                            maps.auto_base_id = this.auto_id;
                            this.backRoute = 'StockTopCarScene';
                        } else if (this.from === 'StockBottomScene' && this._isEmpty(this.json) === false) {
                            requestUrl = AppUrls.INVENTORYFINANCINGADDWHOLESTOCKPILEAUTO;
                            maps.auto_base_id = this.auto_id;
                            this.backRoute = 'AssessmentSelectScene';
                        } else if (this.from === 'StockTopCarScene') {
                            requestUrl = AppUrls.INVENTORYFINANCINGADDAUTO;
                            this.backRoute = 'StockTopCarScene';
                        } else if (this.from === 'OneCarListScene') {
                            requestUrl = AppUrls.ONECARADDAUTO;
                            this.backRoute = 'OneCarListScene';
                        } else if (this.from === 'StockBottomScene') {
                            requestUrl = AppUrls.INVENTORYFINANCINGADDAUTO;
                            this.backRoute = 'AssessmentSelectScene';
                        } else if (this.from === ('CarInfoScene' + 'StockTopCarScene')) {
                            requestUrl = AppUrls.INVENTORYFINANCINGEDITAUTO;
                            maps.auto_id = this.auto_id;
                            this.backRoute = 'CarInfoScene';
                        } else if (this.from === ('CarInfoScene' + 'OneCarListScene')) {
                            requestUrl = AppUrls.ONECAREDITAUTO;
                            maps.auto_id = this.auto_id;
                            this.backRoute = 'CarInfoScene';
                        } else if (this.from === ('CarInfoScene' + 'StockBottomScene')) {
                            requestUrl = AppUrls.INVENTORYFINANCINGEDITAUTO;
                            maps.auto_id = this.auto_id;
                            this.backRoute = 'CarInfoScene';
                        } else if (this.from === 'PurchaseCarScene') {
                            requestUrl = AppUrls.PURCHA_AUTOASSESS;
                            maps.auto_id = this.auto_id;
                            maps.purchas_price = this.purchas_price;
                            this.backRoute = 'PurchaseCarScene';
                        }

                        Net.request(requestUrl, 'post', maps).then(
                            (response) => {
                                if (this.from === ('CarInfoScene' + 'StockTopCarScene')) {
                                    this._changeMoney(AppUrls.INVENTORYFINANCINGRESETPRICE);
                                } else if (this.from === ('CarInfoScene' + 'OneCarListScene')) {
                                    this._changeMoney(AppUrls.ONECARRESETPRICE);
                                } else if (this.from === ('CarInfoScene' + 'StockBottomScene')) {
                                    this._changeMoney(AppUrls.INVENTORYFINANCINGRESETPRICE);
                                } else {
                                    try {
                                        this._closeLoading();
                                        this.showToast('添加成功');
                                        SQLite.changeData('delete from carimage where ' + 'frame_number = ?',
                                            [this.number]);
                                        SQLite.changeData('delete from newcar where ' + 'frame_number = ?',
                                            [this.number]);
                                        //返回到初始页并刷新
                                        this.props.navigation.state.params.refreshMethod();
                                        this.backPage2(this.backRoute);

                                    } catch (error) {
                                        this._closeLoading();
                                        this.showToast('服务器请求失败，请重新请求！');
                                    }
                                }
                            },
                            (error) => {
                                this._closeLoading();
                                this.showToast('服务器请求失败，请重新请求！');
                            });

                    } else {
                        //本地无法取到数据
                        this.showToast('数据丢失，请重新录入');
                    }
                }
            });
    };

    _changeMoney = (url) => {
        let maps = {
            auto_id: auto_id,
        };
        SQLite.selectData('select * from newcar where frame_number = ?',
            [this.number],
            (sqlDt) => {
                if (sqlDt.code === 1) {
                    if (sqlDt.result.rows.length > 0) {

                        let carD = sqlDt.result.rows.item(0);

                        let certification = carD.certification;
                        if (this._isEmpty(certification) === true) {
                            certification = '0';
                        }
                        maps.certification = certification;
                        maps.is_new = carD.is_new;
                        maps.merge_id = carD.merge_id;
                        maps.model_id = carD.model_id;
                        maps.region_assess_mny = carD.region_assess_mny;
                        maps.payment_id = this.payment_id;
                    }
                }

                Net.request(url, 'post', maps).then(
                    (response) => {
                        try {
                            this._closeLoading();
                            this.showToast('编辑成功');
                            SQLite.changeData('delete from carimage where ' + 'frame_number = ?',
                                [this.number]);
                            SQLite.changeData('delete from newcar where ' + 'frame_number = ?',
                                [this.number]);
                            //返回到初始页并刷新
                            this.props.navigation.state.params.refreshMethod();
                            this.backPage2(this.backRoute);
                        } catch (error) {
                            this._closeLoading();
                            this.showToast('服务器请求失败，请重新请求！');
                        }
                    },
                    (error) => {
                        this._closeLoading();
                        this.showToast('评估价格修改失败');
                        // SQLite.changeData('delete from carimage where ' + 'frame_number = ?',
                        //     [this.number]);
                        // SQLite.changeData('delete from newcar where ' + 'frame_number = ?',
                        //     [this.number]);
                        //返回到初始页并刷新

                    });
            });
    };

    showToast = (errorMsg) => {
        if (IS_ANDROID === true) {
            this.props.screenProps.showToast(errorMsg);
        } else {
            this.timer = setTimeout(
                () => {
                    this.props.screenProps.showToast(errorMsg)
                },
                500
            );
        }
    };

    _showLoading = () => {
        this.props.screenProps.showModal(true);
    };

    _closeLoading = () => {
        this.props.screenProps.showModal(false);
    };

    _isVinEmpty = () => {
        let vinSysCode = '', isNull = true;
        this.baseTitleData.map((btd) => {
            if (btd.name === '车架号') {
                vinSysCode = btd.syscodedata_id;
            }
        });
        if (vinSysCode !== '') {
            this.results.map((rm) => {
                    if (rm.syscodedata_id === vinSysCode) {
                        isNull = false;
                    }
                }
            )
        }
        return isNull;
    };

    _isEmpty = (str) => {
        if (typeof(str) !== 'undefined' && str !== '') {
            return false;
        } else {
            return true;
        }
    };
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
        paddingTop: Pixel.getTitlePixel(64),
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),

    }, footContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Pixel.getPixel(20),
        marginBottom: Pixel.getPixel(20),

    },
    footView: {
        backgroundColor: fontAndColor.all_blue,
        height: Pixel.getPixel(44),
        justifyContent: 'center',
        alignItems: 'center',
        width: sceneWidth - Pixel.getPixel(30),
        borderRadius: Pixel.getPixel(3),
    },
    footText: {
        textAlign: 'center',
        color: 'white',
        fontSize: fontAndColor.BUTTONFONT30
    },
});