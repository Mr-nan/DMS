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
    NativeModules
} from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../constant/fontAndColor';
import StorageUtil from '../utils/StorageUtil';
import * as StorageKeyNames from '../constant/storageKeyNames';
const {width} = Dimensions.get('window');

import * as appUrls from '../constant/appUrls';


const clpg = require('../../images/clpg.png');
const clrk = require('../../images/clrk.png');
const pk = require('../../images/pk.png');
const sc = require('../../images/sc.png');
const xcbg = require('../../images/xcbg.png');
const obd_jg = require('../../images/obd_jg.png');

import ImagePicker from "react-native-image-picker";
const options = {
    //弹出框选项
    title: '请选择',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照',
    chooseFromLibraryButtonTitle: '选择相册',
    allowsEditing: true,
    noData: true,
    quality: 1.0,
    maxWidth: 480,
    maxHeight: 800,
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
};

export default class FunctionScene extends BaseComponent {

    constructor(props) {
        super(props);
        this.funcs = [];
    }

    initFinish = () => {
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
                if (func.vehicle_storage == '1') {
                    this.funcs.push('车辆建档');
                }
                if (func.patrol_report == '1') {
                    this.funcs.push('巡查报告');
                }
                if (func.auto_assess == '1') {
                    this.funcs.push('OBD监管');
                }
            }
        });

    };

    _itemClick = (type) => {
        switch (type) {
            case 1:
                ImagePicker.launchCamera(options, (response) => {
                    if (response.didCancel) {
                    }
                    else if (response.error) {
                    }
                    else if (response.customButton) {
                    }
                    else {
                        console.log('take camera', response);
                        StorageUtil.mGetItem(StorageKeyNames.TOKEN, (data) => {
                            if (data.code == 1) {
                                let token = data.result;

                                NativeModules.DmsCustom.uploadFile(appUrls.FILEUPLOAD,token,response.path,
                                    (rep)=>{console.log('success',rep)},(error)=>{console.log(error)});
                            }
                        });


                    }
                });
                //NativeModules.DmsCustom.scanSound(1);
                // NativeModules.DmsCustom.qrScan((success)=>{console.log('success',success)},(error)=>{console.log('error',error)});
                // this.toNextPage('AssessCustomerScene', {});
                break;
            case 2:
                break;
            case 3:
                this.toNextPage('CarCheckCustomer', {});
                break;
            case 4:
                break;
            case 5:
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
                        data={this.funcs}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        numColumns={3}
                        horizontal={false}
                        onEndReached={() => {
                            console.log("=================111")
                        }}
                    />
                </View>
                <AllNavigationView title={'第1车贷'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
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
