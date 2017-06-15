/**
 * Created by Administrator on 2017/5/20.
 */
import React from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    NativeModules,
    Platform
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
import CarTypeSelectPop from './component/CarTypeSelectPop';
import DateTimePicker from 'react-native-modal-datetime-picker';
const IS_ANDROID = Platform.OS === 'android';
const scan = require('../../images/scan.png');
const arrow = require('../../images/list_select.png');
const newTypes = ['二手车', '新车', '平行进口车'];
const natureTypes = ['营运', '非营运', '租赁非营运'];
const recordTypes = ['放款入库', '置换入库'];

export default class AddCarInfoScene extends BaseComponent {

    constructor(props) {
        super(props);

        this.merge_id = this.props.navigation.state.params.merge_id;
        this.from = this.props.navigation.state.params.from;
        this.json = this.props.navigation.state.params.json;
        this.number = this.props.navigation.state.params.number;
        this.engine_number = this.props.navigation.state.params.engine_number;
        this.init_reg = this.props.navigation.state.params.init_reg;
        this.auto_id = this.props.navigation.state.params.auto_id;
        this.payment_id = this.props.navigation.state.params.payment_id;
        this.plate_number = this.props.navigation.state.params.plate_number;

        this.model_id = this.props.navigation.state.params.model_id;
        this.brand_id = this.props.navigation.state.params.brand_id;
        this.series_id = this.props.navigation.state.params.series_id;
        this.model_name = this.props.navigation.state.params.model_name;

        this.itemList = [];
        this.state = {
            renderItems: [],
            carTypePop: false,
            isDateTimePickerVisible: false
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

    _dateReversal = (time) => {
        const date = new Date();
        date.setTime(time + '000');
        let year = date.getFullYear();
        let month = (date.getMonth() + 1) + '';
        let day = date.getDay() + '';
        if (month.length == 1) month = '0' + month;
        if (day.length == 1) day = '0' + day;
        return (year + "-" + month + "-" + day);
    };

    initFinish = () => {

        this._showLoadingModal();
        this._getData();

    };

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _insertSData = (carD) => {

        if (typeof(carD.auto_base_id) !== 'undefined' && carD.auto_base_id !== '') {
            this.auto_id = carD.auto_base_id;
        }
        this.itemList.push({
            title: '车架号',
            value: this.number,
            dbName: 'frame_number',
            type: 1,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '车型',
            value: carD.model_name,
            dbName: 'group_id',
            tag: carD.brand_id + ',' + carD.series_id + ',' + carD.model_id,
            type: 1,
            canNull: false
        });
        this.itemList.push({
            title: '排量',
            value: carD.displacement,
            dbName: 'displacement',
            type: 2,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '发动机号',
            value: carD.engine_number,
            dbName: 'engine_number',
            type: 3,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '车身颜色',
            value: carD.car_color,
            dbName: 'car_color',
            type: 2,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '内饰颜色',
            value: carD.trim_color,
            dbName: 'trim_color',
            type: 2,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '车牌号',
            value: carD.plate_number,
            dbName: 'plate_number',
            type: 2,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '行驶里程',
            value: carD.mileage,
            dbName: 'mileage',
            type: 2,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '过户次数',
            value: carD.transfer_count,
            dbName: 'transfer_count',
            type: 2,
            canNull: false,
            tag: '',
        });
        let tReg = carD.init_reg;
        // if (tReg !== '') {
        //     tReg = this._dateReversal(tReg);
        // }
        this.itemList.push({
            title: '初登日期',
            value: tReg,
            dbName: 'init_reg',
            type: 4,
            canNull: false,
            tag: '',
        });

        let tManu = carD.manufacture;
        // if (tManu !== '') {
        //     tManu = this._dateReversal(tManu);
        // }
        this.itemList.push({
            title: '出厂日期',
            value: tManu,
            dbName: 'manufacture',
            type: 4,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '车辆类型',
            value: carD.is_new,
            dbName: 'is_new',
            type: 4,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '使用性质',
            value: carD.nature_use,
            dbName: 'nature_use',
            type: 4,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '入库类型',
            value: carD.record_type,
            dbName: 'record_type',
            type: 4,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '监管地点',
            value: carD.storage_id,
            dbName: 'storage_id',
            type: 4,
            canNull: false,
            tag: '',
        });
        this.itemList.push({
            title: '',
            value: '',
            dbName: '',
            type: 5,
            canNull: false,
            tag: '',
        });
        let upSql = 'update newcar set group_id = ?,'
            + 'brand_id = ?,'
            + 'series_id = ?,'
            + 'model_id = ?,'
            + 'displacement = ?,'
            + 'engine_number = ?,'
            + 'car_color = ?,'
            + 'trim_color = ?,'
            + 'plate_number = ?,'
            + 'mileage = ?,'
            + 'transfer_count = ?,'
            + 'init_reg = ?,'
            + 'manufacture = ?,'
            + 'is_new = ?,'
            + 'nature_use = ?,'
            + 'record_type = ?,'
            + 'storage_id = ?';

        console.log('carD', carD);

        SQLite.changeData(upSql + ' where frame_number=?', [
            carD.model_name, carD.brand_id, carD.series_id,
            carD.model_id, carD.displacement, carD.engine_number,
            carD.car_color, carD.trim_color, carD.plate_number,
            carD.mileage, carD.transfer_count, tReg, tManu,
            carD.is_new, carD.nature_use, carD.record_type,
            carD.storage_id, this.itemList[0].value
        ], () => {
            // this._setCarRender(true);
            this._setFirstCarRender();
        })

    };

    _setFirstCarRender = () => {
        if (this.itemList[11].value == '2' || this.itemList[11].value == '3') {
            this.itemList[9].title = '发证日期';
            this.itemList[9].dbName = 'certification';
            this.itemList[9].value = '';
            this.itemList[9].canNull = true;
            this.itemList[6].value = '';
            this.itemList[6].canNull = true;
            this.itemList[8].value = '';
            this.itemList[8].canNull = true;
            this.itemList[12].value = '';
            this.itemList[12].canNull = true;
        }
        let its = this.itemList.map((dt, index) => {
            return this._renderItem(dt, index)
        });

        console.log('its', its);
        this.setState({
            renderItems: its
        });
    };

    _setCarRender = (carType) => {

        if (carType === true) {
            if (this.itemList[11].value == '2' || this.itemList[11].value == '3') {
                this.itemList[9].title = '发证日期';
                this.itemList[9].dbName = 'certification';
                this.itemList[9].value = '';
                this.itemList[9].canNull = true;
                this.itemList[6].value = '';
                this.itemList[6].canNull = true;
                this.itemList[8].value = '';
                this.itemList[8].canNull = true;
                this.itemList[12].value = '';
                this.itemList[12].canNull = true;
            } else {
                this.itemList[9].title = '初登日期';
                this.itemList[9].dbName = 'init_reg';
                this.itemList[9].value = '';
                this.itemList[9].canNull = false;
                this.itemList[6].value = '';
                this.itemList[6].canNull = false;
                this.itemList[8].value = '';
                this.itemList[8].canNull = false;
                this.itemList[12].value = '';
                this.itemList[12].canNull = false;
            }
        }

        let its = this.itemList.map((dt, index) => {
            return this._renderItem(dt, index)
        });

        console.log('its', its);
        this.setState({
            renderItems: its
        });

    };

    //先请求监管地点数据
    _getData = () => {
        let maps = {
            merge_id: this.merge_id
        };
        Net.request(appUrls.AUTOGETRUNPLACE, 'post', maps).then(
            (response) => {
                this._closeLoadingModal();
                if (response.mycode === 1) {
                    this.runPlaces = response.mjson.retdata;
                    if (this.runPlaces.length === 0) {
                        if(IS_ANDROID === true){
                            this._showHint('监管地点为空');
                            this.timer = setTimeout(() => {
                                    this.backPage();
                                },
                                500);
                        }else{
                            this.timer = setTimeout(() => {
                                    this._showHint('监管地点为空');
                                    this.timer = setTimeout(() => {
                                            this.backPage();
                                        },
                                        500);
                                },
                                500);
                        }
                    } else {
                        if (this.json !== '') {
                            //后台有数据
                            let carD = (JSON.parse(this.json)).retdata;
                            SQLite.selectData('select * from newcar where frame_number = ?',
                                [this.number],
                                (sqlDt) => {
                                    if (sqlDt.code === 1) {
                                        if (sqlDt.result.rows.length === 0) {
                                            SQLite.changeData('insert into newcar (frame_number) values (?)', [this.number], () => {
                                                this._insertSData(carD);
                                            });
                                        } else {
                                            this._insertSData(carD);
                                        }
                                    }
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
                                                title: '车架号',
                                                value: this.number,
                                                dbName: 'frame_number',
                                                type: 1,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '车型',
                                                value: carD.group_id,
                                                dbName: 'group_id',
                                                type: 1,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '排量',
                                                value: carD.displacement,
                                                dbName: 'displacement',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '发动机号',
                                                value: carD.engine_number,
                                                dbName: 'engine_number',
                                                type: 3,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '车身颜色',
                                                value: carD.car_color,
                                                dbName: 'car_color',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '内饰颜色',
                                                value: carD.trim_color,
                                                dbName: 'trim_color',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '车牌号',
                                                value: carD.plate_number,
                                                dbName: 'plate_number',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '行驶里程',
                                                value: carD.mileage,
                                                dbName: 'mileage',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '过户次数',
                                                value: carD.transfer_count,
                                                dbName: 'transfer_count',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '初登日期',
                                                value: carD.init_reg,
                                                dbName: 'init_reg',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '出厂日期',
                                                value: carD.manufacture,
                                                dbName: 'manufacture',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '车辆类型',
                                                value: carD.is_new,
                                                dbName: 'is_new',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '使用性质',
                                                value: carD.nature_use,
                                                dbName: 'nature_use',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '入库类型',
                                                value: carD.record_type,
                                                dbName: 'record_type',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '监管地点',
                                                value: carD.storage_id,
                                                dbName: 'storage_id',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '',
                                                value: '',
                                                dbName: '',
                                                type: 5,
                                                canNull: false,
                                                tag: '',
                                            });

                                        } else {
                                            let iSql = 'insert into newcar (frame_number,'
                                                + 'engine_number,plate_number,init_reg,model_id,'
                                                + 'brand_id,series_id,group_id,is_new'
                                                + ') values (?,?,?,?,?,?,?,?,?)';
                                            SQLite.changeData(iSql, [this.number, this.engine_number
                                                , this.plate_number, this.init_reg, this.model_id,
                                                this.brand_id, this.series_id, this.model_name, '1']);

                                            this.itemList.push({
                                                title: '车架号',
                                                value: this.number,
                                                dbName: 'frame_number',
                                                type: 1,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '车型',
                                                value: this.model_name,
                                                dbName: 'group_id',
                                                type: 1,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '排量',
                                                value: '',
                                                dbName: 'displacement',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '发动机号',
                                                value: this.engine_number,
                                                dbName: 'engine_number',
                                                type: 3,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '车身颜色',
                                                value: '',
                                                dbName: 'car_color',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '内饰颜色',
                                                value: '',
                                                dbName: 'trim_color',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '车牌号',
                                                value: this.plate_number,
                                                dbName: 'plate_number',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '行驶里程',
                                                value: '',
                                                dbName: 'mileage',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '过户次数',
                                                value: '',
                                                dbName: 'transfer_count',
                                                type: 2,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '初登日期',
                                                value: this.init_reg,
                                                dbName: 'init_reg',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '出厂日期',
                                                value: '',
                                                dbName: 'manufacture',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '车辆类型',
                                                value: 1,
                                                dbName: 'is_new',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '使用性质',
                                                value: '',
                                                dbName: 'nature_use',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '入库类型',
                                                value: '',
                                                dbName: 'record_type',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '监管地点',
                                                value: '',
                                                dbName: 'storage_id',
                                                type: 4,
                                                canNull: false,
                                                tag: '',
                                            });
                                            this.itemList.push({
                                                title: '',
                                                value: '',
                                                dbName: '',
                                                type: 5,
                                                canNull: false,
                                                tag: '',
                                            });
                                        }
                                        this._setFirstCarRender();
                                    }
                                });
                        }
                    }
                }


            },
            (error) => {
                this._closeLoadingModal();
                if(IS_ANDROID === true){
                    this._showHint('无法获取监管地点');
                    this.timer = setTimeout(() => {
                            this.backPage();
                        },
                        500);
                }else{
                    this.timer = setTimeout(() => {
                            this._showHint('无法获取监管地点');
                            this.timer = setTimeout(() => {
                                    this.backPage();
                                },
                                500);
                        },
                        500);
                }
            });
    };

    _renderItem = (data, index) => {

        if (data.type === 1) {
            let rtv = data.value;
            if (data.title === '车型') {
                if (data.value === '') {
                    rtv = '请选择车型'
                }
            }
            return (
                <TouchableOpacity key={index} style={styles.type_one_wrap}
                                  activeOpacity={0.6}
                                  onPress={() => {
                                      this._onTypeOneClick(data.title)
                                  }}
                >
                    <Text style={styles.type_one_star_mark}>*</Text>
                    <Text style={styles.type_one_left_title}>{data.title}</Text>
                    <View style={styles.fillSpace}/>
                    <Text style={styles.type_one_right_value}>{rtv}</Text>
                </TouchableOpacity>
            )
        } else if (data.type === 2) {
            let tP = '请输入' + data.title;
            let keyboardType = 'default';

            if (data.title === '行驶里程') {
                tP += '(万公里)';
                keyboardType = 'numeric';
            } else if (data.title === '排量'
                || data.title === '过户次数') {
                keyboardType = 'numeric';
            }
            return (
                <View key={index} style={styles.type_two_wrap}>
                    <Text style={styles.type_two_star_mark}>*</Text>
                    <Text style={styles.type_two_left_title}>{data.title}</Text>
                    <View style={styles.fillSpace}/>
                    <TextInput style={styles.type_two_right_input}
                               defaultValue={data.value}
                               underlineColorAndroid='transparent'
                               placeholder={tP}
                               keyboardType={keyboardType}
                               onChangeText={(text) => {
                                   this._onTypeTwoChange(text, index)
                               }}
                    />
                </View>
            )
        } else if (data.type === 3) {

            return (
                <View key={index} style={styles.type_three_wrap}>
                    <Text style={styles.type_three_star_mark}>*</Text>
                    <Text style={styles.type_three_left_title}>{data.title}</Text>
                    <View style={styles.fillSpace}/>
                    <View style={styles.type_three_right_wrap}>
                        <TextInput
                            style={styles.type_three_right_input}
                            defaultValue={data.value}
                            underlineColorAndroid='transparent'
                            placeholder={'请输入' + data.title}
                            onChangeText={(text) => {
                                this._onTypeThreeChange(text)
                            }}
                        />
                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={this._onScanClick}
                        >
                            <Image style={styles.type_three_right_img} source={scan}/>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else if (data.type === 4) {
            let xz = null;
            if (data.value !== '' && data.value !== '0') {
                xz = data.value;
            }
            if (data.title === '车辆类型') {
                xz = newTypes[Number.parseInt(data.value) - 1];
            } else if (data.title === '使用性质') {
                if (data.value > 0) {
                    xz = natureTypes[Number.parseInt(data.value) - 1];
                } else {
                    xz = null;
                }
            } else if (data.title === '入库类型') {
                if (data.value == '1') {
                    xz = '放款入库';
                } else if (data.value == '3') {
                    xz = '置换入库';
                } else {
                    xz = null;
                }
            } else if (data.title === '监管地点') {
                this.runPlaces.map((rp) => {
                    if (rp.storage_id === data.value) {
                        xz = rp.name;
                    }
                });
            }

            return (
                <View key={index} style={styles.type_four_wrap}>
                    <Text style={styles.type_four_star_mark}>*</Text>
                    <Text style={styles.type_four_left_title}>{data.title}</Text>
                    <View style={styles.fillSpace}/>
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                      activeOpacity={0.6} onPress={() => {
                        this._onTypeFourClick(data.title)
                    }}>
                        <TextInput style={styles.type_four_right_value}
                                   ref={(ref) => {
                                       data.tag = ref
                                   }}
                                   defaultValue={xz}
                                   editable={false}
                                   placeholder={'请选择'}
                                   underlineColorAndroid='transparent'/>
                        <Image style={styles.type_four_right_img} source={arrow}/>
                    </TouchableOpacity>
                </View>
            )
        } else if (data.type === 5) {
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

    _onTypeOneClick = (title) => {
        if (title === '车型') {
            this.toNextPage('CarBrandSelectScene', {checkedCarClick: this._checkedCarClick})
        }
    };

    _onTypeFourClick = (title) => {
        if (title === '车辆类型') {
            this.setState({
                carTypePop: true
            }, () => {
                this.carPop.refresh(newTypes, '0');
            });

        } else if (title === '使用性质') {
            this.setState({
                carTypePop: true
            }, () => {
                this.carPop.refresh(natureTypes, '1');
            });
        } else if (title === '入库类型') {
            this.setState({
                carTypePop: true
            }, () => {
                this.carPop.refresh(recordTypes, '2');
            });
        } else if (title === '监管地点') {
            this.setState({
                carTypePop: true
            }, () => {
                this.carPop.refresh(this.runPlaces.map((d) => {
                    return d.name
                }), '3');
            });
        } else if (title === '出厂日期') {
            this.carDateType = 'factory';
            this.setState({
                isDateTimePickerVisible: true
            });
        } else if (title === '初登日期' || title === '发证日期') {
            this.carDateType = 'cer_reg';
            this.setState({
                isDateTimePickerVisible: true
            });
        }
    };

    //扫描
    _onScanClick = () => {
        NativeModules.DmsCustom.scanVL((rep) => {
            if(typeof(rep.suc) === 'undefined' || rep.suc === null){
                this._showHint('扫描失败');
            }else{
                SQLite.changeData('update newcar set engine_number = ? where frame_number = ?',
                    [rep.suc.carEngine, this.number], () => {
                        this.itemList[3].value = rep.suc.carEngine;
                        this._setCarRender(false);
                    });
            }
        })
    };

    //下一步
    _onNextSceneClick = () => {
        let canNext = true;
        for (let it in this.itemList) {
            if (it.value === '') {
                if (this.itemList[11].value == 2 || this.itemList[11].value == 3) {

                } else {
                    canNext = false;
                    this._showHint(it.title + '数据为空');
                    break;
                }
            }
        }

        if (canNext === true) {
            this.toNextPage('AddCarPriceScene', {
                merge_id: this.merge_id,
                from: this.from,
                json: this.json,
                number: this.number,
                payment_id: this.payment_id,
                auto_id: this.auto_id,
                refreshMethod: this.props.navigation.state.params.refreshMethod
            });
        }
    };

    //选择车型
    _checkedCarClick = (carObject) => {

        let iSql = 'update newcar set '
            + 'model_id = ?,brand_id = ?,series_id = ?,group_id = ? '
            + ' where frame_number = ?';
        SQLite.changeData(iSql, [carObject.model_id,
            carObject.brand_id, carObject.series_id, carObject.model_name, this.number], () => {
            this.itemList[1].value = carObject.model_name;
            let its = this.itemList.map((dt, index) => {
                return this._renderItem(dt, index)
            });
            this.setState({
                renderItems: its
            });

        });
    };

    _closeCarModal = () => {
        this.setState({
            carTypePop: false
        });
    };

    //选择列表返回
    _onCarTypeClick = (rowID, rowData, dtType) => {
        if (dtType === '0') {
            SQLite.changeData('update newcar set is_new = ? where frame_number = ?', [(Number.parseInt(rowID) + 1) + '', this.number], () => {
                this.itemList[11].value = (Number.parseInt(rowID) + 1) + '';
                this._setCarRender(true);
            });
        } else if (dtType === '1') {
            SQLite.changeData('update newcar set nature_use = ? where frame_number = ?', [(Number.parseInt(rowID) + 1) + '', this.number], () => {
                this.itemList[12].value = (Number.parseInt(rowID) + 1) + '';
                this.itemList[12].tag.setNativeProps({
                    text: rowData
                });
                //this._setCarRender(false);
            });
        } else if (dtType === '2') {
            let v = '1';
            if (rowData === '放款入库') {
                v = '1';
            } else if (rowData === '置换入库') {
                v = '3';
            }
            SQLite.changeData('update newcar set record_type = ? where frame_number = ?', [v, this.number], () => {
                this.itemList[13].value = v;
                this.itemList[13].tag.setNativeProps({
                    text: rowData
                });
                // this._setCarRender(false);
            });
        } else if (dtType === '3') {
            let r = this.runPlaces[rowID].storage_id;
            SQLite.changeData('update newcar set storage_id = ? where frame_number = ?', [r, this.number], () => {
                this.itemList[14].value = r;
                this.itemList[14].tag.setNativeProps({
                    text: rowData
                });
                //this._setCarRender(false);
            });
        }
    };

    //输入
    _onTypeTwoChange = (text, index) => {
        this.itemList[index].value = text;
        let iSql = 'update newcar set '
            + this.itemList[index].dbName + ' = ?'
            + ' where frame_number = ?';
        SQLite.changeData(iSql, [text, this.number])
    };

    _onTypeThreeChange = (text) => {
        this.itemList[3].value = text;
        let iSql = 'update newcar set engine_number = ? where frame_number = ?';
        SQLite.changeData(iSql, [text, this.number])
    };

    //时间选择关闭
    _hideDateTimePicker = () => {
        this.setState({isDateTimePickerVisible: false});
    };

    _handleDatePicked = (date) => {
        let d = this._dateFormat(date, 'yyyy-MM-dd');
        if (this.carDateType === 'factory') {
            SQLite.changeData('update newcar set manufacture = ? where frame_number = ?',
                [d, this.number], () => {
                    // this.itemList[10].value = d;
                    // this._setCarRender(false);
                    this.itemList[10].value = d;
                    this.itemList[10].tag.setNativeProps({
                        text: d
                    });
                });
        } else {
            SQLite.changeData('update newcar set ' + this.itemList[9].dbName + ' = ? where frame_number = ?',
                [d, this.number], () => {
                    // this.itemList[9].value = d;
                    // this._setCarRender(false);
                    this.itemList[9].value = d;
                    this.itemList[9].tag.setNativeProps({
                        text: d
                    });
                });
        }

        this._hideDateTimePicker();
    };

    //格式化时间
    _dateFormat = (date, fmt) => {
        let o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
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
                    this.state.carTypePop &&
                    <CarTypeSelectPop ref={(ref) => {
                        this.carPop = ref
                    }}
                                      closeModal={this._closeCarModal}
                                      onItemClick={this._onCarTypeClick}/>

                }
                <DateTimePicker
                    titleIOS="请选择日期"
                    confirmTextIOS='确定'
                    cancelTextIOS='取消'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
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
    type_one_right_value: {
        width: Pixel.getPixel(240),
        textAlign: 'right',
        marginRight: Pixel.getPixel(15),
        color: FontAndColor.txt_gray,
        fontSize: Pixel.getFontPixel(14),
    },
    type_two_wrap: {
        height: Pixel.getPixel(46),
        backgroundColor: FontAndColor.white,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: FontAndColor.line_gray
    },
    type_two_star_mark: {
        marginLeft: Pixel.getPixel(15),
        color: 'rgba(0,0,0,0)',
        fontSize: Pixel.getFontPixel(17)
    },
    type_two_left_title: {
        marginLeft: Pixel.getPixel(2),
        color: FontAndColor.black,
        fontSize: Pixel.getFontPixel(14)
    },
    type_two_right_input: {
        width: Pixel.getPixel(240),
        marginRight: Pixel.getPixel(15),
        textAlign: 'right',
        color: FontAndColor.black,
        fontSize: Pixel.getFontPixel(14)
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
    type_three_right_wrap: {
        width: Pixel.getPixel(240),
        marginRight: Pixel.getPixel(15),
        backgroundColor: FontAndColor.white,
        flexDirection: 'row',
        alignItems: 'center'
    },
    type_three_right_input: {
        width: Pixel.getPixel(210),
        textAlign: 'right',
        color: FontAndColor.black,
        fontSize: Pixel.getFontPixel(14)
    },
    type_three_right_img: {
        height: Pixel.getPixel(30),
        width: Pixel.getPixel(30),
        backgroundColor:'red'
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
        color: 'rgba(0,0,0,0)',
        fontSize: Pixel.getFontPixel(17)
    },
    type_four_left_title: {
        marginLeft: Pixel.getPixel(2),
        color: FontAndColor.black,
        fontSize: Pixel.getFontPixel(14)
    },
    type_four_right_value: {
        width: Pixel.getPixel(240),
        color: FontAndColor.black,
        fontSize: Pixel.getFontPixel(14),
        textAlign: 'right'
    },
    type_four_right_img: {
        width: Pixel.getPixel(35),
        height: Pixel.getPixel(35),
        marginRight: Pixel.getPixel(5)
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

