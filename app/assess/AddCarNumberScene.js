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
    NativeModules
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import CarBrandSelectPop from './component/CarBrandSelectPop';
import * as FontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as Net from '../utils/RequestUtil';
import * as appUrls from '../constant/appUrls';
import SQLiteUtil from '../utils/SQLiteUtil';
const {width} = Dimensions.get('window');
const SQLite = new SQLiteUtil();

const scan_img = require('../../images/scan.png');
const car_log = require('../../images/car_log.png');


export default class AddCarNumberScene extends BaseComponent {

    constructor(props) {
        super(props);
        this.merge_id = this.props.navigation.state.params.merge_id;
        this.from = this.props.navigation.state.params.from;
        this.payment_id = this.props.navigation.state.params.payment_id;
        this.vin_number = '';

        this.brand_id = '';
        this.series_id = '';
        this.model_id = '';
        this.model_name = '';

        this.vin_number = '';
        this.engine_number = '';
        this.init_reg = '';
        this.plate_number = '';

        this.state = {
          carBrand:false
        };
    }

    initFinish = () => {
        SQLite.createTable();
    };

    _onNextClick = () => {

        if (this.vin_number !== '' && this.vin_number.trim().length === 17) {
            this._getData();
            // this._getCarTypeData();
        } else {
            this._showHint('车架号不合法！');
        }
    };

    _getData = () => {
        this._showLoadingModal();
        let maps = {
            merge_id: this.merge_id,
            frame_number: this.vin_number
        };
        Net.request(appUrls.AUTOCHECKVIM, 'post', maps).then(
            (response) => {
                let rb = response.mjson;
                if (rb.retcode === 1) {
                    console.log('11111111111111111');
                    SQLite.selectData('select * from newcar where frame_number = ?',
                        [this.vin_number],
                        (sqlDt) => {
                            console.log('22222222222222222222');
                            if (sqlDt.code === 1) {
                                console.log('3333333333333333333');
                                if (sqlDt.result.rows.length === 0) {
                                    console.log('444444444444444444444');
                                    this._getCarTypeData();
                                } else {
                                    console.log('5555555555555555555');
                                    this._toNextScene('');
                                }
                            }
                        });
                } else if (rb.retcode === 2) {
                    this._toNextScene(JSON.stringify(response.mjson));
                }
            },
            (error) => {
                this._closeLoadingModal();
                this._showHint(error.mjson.retmsg);
            }
        );
    };

    _getCarTypeData = ()=> {
        this._showLoadingModal();
        let maps = {
            auto_vin: this.vin_number
        };
        Net.request(appUrls.GETCARMODELBYVIN,'post',maps).then(
            (response)=>{
                let rb = response.mjson;
                this._closeLoadingModal();
                if(rb.retcode === 1){
                    if(rb.retdata !== ''){
                        console.log('retdat',rb);
                        this.setState({
                            carBrand:true
                        },()=>{
                            this.brandPop.refresh(rb.retdata.data);
                        })
                    }
                }else{

                    this._showHint('未匹配出款型，请自行选择');
                    this._toNextScene('');
                }
            },
            (error)=>{
                this._closeLoadingModal();
                this._showHint('未匹配出款型，请自行选择');
                this._toNextScene('');
            }
        );
    };

    _toNextScene = (carJson) => {
        this._closeLoadingModal();
        let params = {
            merge_id:this.merge_id,
            from:this.from,
            number:this.vin_number,
            engine_number:this.engine_number,
            init_reg:this.init_reg,
            payment_id:this.payment_id,
            plate_number:this.plate_number,
            model_id:this.model_id,
            brand_id:this.brand_id,
            series_id:this.series_id,
            model_name:this.model_name,
            json:carJson
        };
    };

    _onFrameChange = (text) => {
        this.vin_number = text;
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

    _onScanClick = () => {
        NativeModules.DmsCustom.scanVL((rep) => {
            console.log('scan result', rep);
            this.vin_number = rep.carVl;
            this.engine_number = rep.carEngine;
            this.init_reg = rep.carReg;
            this.plate_number = rep.carPlate;
            this.frameInput.setNativeProps({
                text: this.vin_number
            });
        }, (error) => {
            this._showHint('扫描失败');
        })
    };

    _closeBrandModal = ()=>{
        this.setState({
            carBrand:false
        });
    };

    _onItemClick = (r,brandInfo)=>{

        this.brand_id = brandInfo.brand_id;
        this.series_id = brandInfo.series_id;
        this.model_id = brandInfo.model_id;
        this.model_name = brandInfo.model_name;

        this._closeBrandModal();
        this._toNextScene('');

    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <View style={styles.frameWrap}>
                        <TextInput
                            style={styles.frame_text}
                            ref={(input) => {
                                this.frameInput = input
                            }}
                            underlineColorAndroid='transparent'
                            maxLength={17}
                            onChangeText={this._onFrameChange}
                            placeholder={'请输入车架号'}
                        />
                        <TouchableOpacity activeOpacity={0.6} onPress={this._onScanClick}>
                            <Image style={styles.frame_scan} source={scan_img}/>
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity style={styles.btn_wrap} activeOpacity={0.6} onPress={this._onNextClick}>
                        <Text style={styles.btn_text}>{'下一步'}</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>
                    <Image style={styles.bottom_img} source={car_log}/>
                </View>
                <AllNavigationView title={'添加车辆'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
                {
                    this.state.carBrand &&
                    <CarBrandSelectPop ref={(ref)=>{this.brandPop = ref}}
                                       closeModal={this._closeBrandModal}
                                       onItemClick={this._onItemClick} />
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
    frameWrap: {
        marginTop: Pixel.getPixel(40),
        marginHorizontal: Pixel.getPixel(20),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: FontAndColor.white,
        borderRadius: Pixel.getPixel(10)
    },
    frame_text: {
        flex: 1,
        height: Pixel.getPixel(50),
        paddingLeft: Pixel.getPixel(20),
        fontSize: Pixel.getFontPixel(16)
    },
    frame_scan: {
        width: Pixel.getPixel(25),
        height: Pixel.getPixel(25),
        marginRight: Pixel.getPixel(15),
        padding: Pixel.getPixel(5)
    },
    btn_wrap: {
        marginTop: Pixel.getPixel(40),
        marginHorizontal: Pixel.getPixel(50),
        height: Pixel.getPixel(40),
        width: width - Pixel.getPixel(100),
        backgroundColor: FontAndColor.all_blue,
        borderRadius: Pixel.getPixel(5),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Pixel.getPixel(180)
    },
    btn_text: {
        fontSize: Pixel.getFontPixel(20),
        color: FontAndColor.white
    },
    bottom_img: {
        height: Pixel.getPixel(84),
        width: Pixel.getPixel(245),
        marginBottom: Pixel.getPixel(30),
    }
});