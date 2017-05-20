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
    Dimensions
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import * as FontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
const {width} = Dimensions.get('window');

const scan_img = require('../../images/scan.png');
const car_log = require('../../images/car_log.png');

export default class AddCarNumberScene extends BaseComponent{

    constructor(props){
        super(props);
    }

    _onFrameChange = ()=>{

    };

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <View style={styles.frameWrap}>
                        <TextInput
                            style={styles.frame_text}
                            ref={(input)=>{this.frameInput = input}}
                            underlineColorAndroid='transparent'
                            maxLength={17}
                            onChangeText={this._onFrameChange}
                            placeholder={'请输入车架号'}
                        />
                        <TouchableOpacity activeOpacity={0.6} onPress={()=>{}}>
                            <Image style={styles.frame_scan} source={scan_img}/>
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity style={styles.btn_wrap} activeOpacity={0.6} onPress={()=>{}}>
                        <Text style={styles.btn_text}>{'下一步'}</Text>
                    </TouchableOpacity>
                    <View style={{flex:1}}/>
                    <Image style={styles.bottom_img} source={car_log}/>
                </View>
                <AllNavigationView title={'添加车辆'} backIconClick={() => {
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
        backgroundColor: FontAndColor.all_background,
        alignItems:'center'
    },
    frameWrap:{
        marginTop:Pixel.getPixel(40),
        marginHorizontal:Pixel.getPixel(20),
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:FontAndColor.white,
        borderRadius:Pixel.getPixel(10)
    },
    frame_text:{
        flex:1,
        height:Pixel.getPixel(50),
        paddingLeft:Pixel.getPixel(20),
        fontSize:Pixel.getFontPixel(16)
    },
    frame_scan:{
        width:Pixel.getPixel(25),
        height:Pixel.getPixel(25),
        marginRight:Pixel.getPixel(15),
        padding:Pixel.getPixel(5)
    },
    btn_wrap:{
        marginTop:Pixel.getPixel(40),
        marginHorizontal:Pixel.getPixel(50),
        height:Pixel.getPixel(40),
        width:width-Pixel.getPixel(100),
        backgroundColor:FontAndColor.all_blue,
        borderRadius:Pixel.getPixel(5),
        justifyContent:'center',
        alignItems:'center',
        marginBottom:Pixel.getPixel(180)
    },
    btn_text:{
        fontSize:Pixel.getFontPixel(20),
        color:FontAndColor.white
    },
    bottom_img:{
        height:Pixel.getPixel(84),
        width:Pixel.getPixel(245),
        marginBottom:Pixel.getPixel(30),
    }
});