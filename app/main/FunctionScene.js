/**
 * Created by Administrator on 2017/5/9.
 */
import React from 'react';
import{
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    FlatList,
    Platform,
    NativeModules,
    NativeAppEventEmitter
} from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../constant/fontAndColor';
import StorageUtil from '../utils/StorageUtil';
import * as StorageKeyNames from '../constant/storageKeyNames';
const {width} = Dimensions.get('window');

import * as Net from '../utils/RequestUtil';
import * as appUrls from '../constant/appUrls';
import SQLiteUtil from '../utils/SQLiteUtil';
const SQLite = new SQLiteUtil();

const clpg = require('../../images/clpg.png');
const clrk = require('../../images/clrk.png');
const pk = require('../../images/pk.png');
const sc = require('../../images/sc.png');
const xcbg = require('../../images/xcbg.png');
const obd_jg = require('../../images/obd_jg.png');

const IS_ANDROID = Platform.OS === 'android';

export default class FunctionScene extends BaseComponent {

    constructor(props) {
        super(props);
        this.funcs = [];
        this.state = {
            funcs: []
        };
    }

    initFinish = () => {
        SQLite.createTable();
        StorageUtil.mGetItem(StorageKeyNames.USER_FUNCTION, (data) => {
            if (data.code == 1) {
                let func = JSON.parse(data.result);
                if (func.auto_assess == '1') {
                    this.funcs.push('车辆评估');
                }
                if (func.close_the_car == '1') {
                    this.funcs.push('收车');
                }
                if (func.check_car == '1') {
                    this.funcs.push('盘库');
                }
                // if (func.vehicle_storage == '1') {
                //     this.funcs.push('车辆建档');
                // }
                if (func.patrol_report == '1') {
                    this.funcs.push('巡查报告');
                }
                if (func.close_the_car == '1') {
                    this.funcs.push('OBD监管');
                }
                this.setState({
                    funcs: this.funcs
                })
            }
        });

        Net.request(appUrls.AUTOGETVIEWINGPOSITION, 'post', {}).then(
            (response) => {
                StorageUtil.mSetItem(StorageKeyNames.TAG_VIEW, JSON.stringify(response.mjson.retdata));
            },
            (error) => {
            });
    };

    _itemClick = (type) => {
        switch (type) {
            case 1:
                this.toNextPage('AssessCustomerScene', {});
                break;
            case 2:
                this.toNextPage('CustomerList', {});
                break;
            case 3:
                this.toNextPage('CarCheckCustomer', {});
                break;
            case 4:
                break;
            case 5:
                this.toNextPage('ReportCustomerList', {})
                break;
            case 6:
                this.toNextPage('ObdCustom', {});
                break;
        }
    };

    _renderItem = (data) => {
        let type, img;
        if (data.item == '车辆评估') {
            img = clpg;
            type = 1;
        } else if (data.item == '收车') {
            img = sc;
            type = 2;
        } else if (data.item == '盘库') {
            img = pk;
            type = 3;
        } else if (data.item == '车辆建档') {
            img = clrk;
            type = 4;
        } else if (data.item == '巡查报告') {
            img = xcbg;
            type = 5;
        } else if (data.item == 'OBD监管') {
            img = obd_jg;
            type = 6;
        }
        return (
            <View
                style={{height: Pixel.getPixel(150), width: width / 3, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => {
                        this._itemClick(type)
                    }}
                >
                    <Image style={styles.imgContainer} source={img}/>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.fontLabel}>{data.item}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    _keyExtractor = (item, index) => index;

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <FlatList
                        data={this.state.funcs}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        numColumns={3}
                        horizontal={false}
                    />
                </View>
                {
                    IS_ANDROID
                        ?
                        <AllNavigationView title={'第1车贷'} backIconClick={() => {
                        this.backPage();
                    }} parentNavigation={this}/>
                        :
                        <AllNavigationView title={'第1车贷'} parentNavigation={this}/>
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
        backgroundColor: fontAndColor.all_background,
        alignItems: 'center',
        width: width
    },

    itemContainer2: {
        height: Pixel.getPixel(150),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
    },
    imgContainer: {
        width: Pixel.getPixel(70),
        height: Pixel.getPixel(70),
        marginTop: Pixel.getPixel(30),
    },
    fontLabel: {
        fontSize: Pixel.getFontPixel(14),
        color: fontAndColor.black,
        marginTop: Pixel.getPixel(8)
    }

});
