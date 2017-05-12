import React, {Component} from 'react';
import {AppRegistry, Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import * as fontAndColor from '../constant/fontAndColor';
import  PixelUtil from '../utils/PixelUtil'
import AllNavigationView from '../component/AllNavigationView';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
var Pixel = new PixelUtil();
const noselect_wifi_open = require('../../images/noselect_wifi_open.png');
const select_wifi_open = require('../../images/select_wifi_open.png');
const noselect_wifi_close = require('../../images/noselect_wifi_close.png');
const select_wifi_close = require('../../images/select_wifi_close.png');
const wifiText = '有网环境盘库，系统自动随盘随提交，准确率高，操作便捷，推荐使用。';
const wifiText2 = '若同一商户同一次盘库先进行了无网盘库但未提交，再重新改为有网盘库时，之前的无网盘库记录将被清空';
const noWifiText = '无网环境盘库，需手动批量提交，易出现数据丢失，建议在确实无网时再慎重使用。'

export  default class CarCheckWifiSelect extends BaseComponent {
    // 初始化模拟数据
    constructor() {
        super()
        this.state = {
            index: 0,
            wifiStyle: {},
            noWifiStyle: {display:'none'}

        }
        this.onSelect = this.onSelect.bind(this)
    }

    onSelect(index) {
        if (index == 0) {
            this.setState({
                index: index,
                noWifiStyle: {display: 'none'},
                wifiStyle: {display: 'flex'}
            })
        } else {
            this.setState({
                index: index,
                wifiStyle: {display: 'none'},
                noWifiStyle: {display: 'flex'},
            })
        }
    }

    initFinish() {
    }

    getData = () => {
        let maps = {};
        request(Urls.OBD_CUSTOMER_LIST, 'Post', maps)

            .then((response) => {
                    this.props.screenProps.showModal(false);
                },
                (error) => {
                    this.props.screenProps.showModal(false);
                });
    }

    render() {

        return (
            <View style={styles.container}>

                <RadioGroup
                    size={0}
                    thickness={0}
                    color='red'
                    selectedIndex={0}
                    style={styles.radioGroup}
                    onSelect={(index) => this.onSelect(index)}
                >
                    <RadioButton style={styles.radioButton}>
                        <Image style={styles.radioButtonImage}
                               source={this.state.index==1 ? noselect_wifi_open : select_wifi_open}/>
                        <Text style={styles.radioButtonText}>有网盘库</Text>
                    </RadioButton>

                    <RadioButton style={styles.radioButton}>
                        <Image style={styles.radioButtonImage}
                               source={this.state.index==0 ? noselect_wifi_close : select_wifi_close}/>
                        <Text style={styles.radioButtonText}>无网盘库</Text>
                    </RadioButton>

                </RadioGroup>

                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex: 1,}}>
                        <View style={[styles.leftStyle, this.state.wifiStyle]}>
                            <Text style={{fontSize: Pixel.getPixel(12)}}>{wifiText}</Text>
                            <Text
                                style={{marginTop:Pixel.getPixel(10), color:'red',fontSize: Pixel.getPixel(12)}}>{wifiText2}</Text>
                        </View>
                    </View>
                    <View style={{flex: 1,}}>
                        <Text style={[styles.rightStyle,this.state.noWifiStyle]}>
                            {noWifiText}
                        </Text>
                    </View>

                </View>

                <View style={{flex:1}}></View>
                <TouchableOpacity style={styles.bottomButton}activeOpacity={0.8} onPress={()=>{}}>
                    <Text style={styles.buttonText}>确定</Text>
                </TouchableOpacity>
                <AllNavigationView title={'网络选择'} backIconClick={() => {
                    this.backPage();
                }} rightFootClick={()=>{}}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: fontAndColor.all_background,
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Pixel.getPixel(98)
    },
    radioButton: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioButtonText: {
        color: 'black',
        fontSize: Pixel.getPixel(15),
        marginVertical: Pixel.getPixel(10),
    },
    radioButtonImage: {
        width: Pixel.getPixel(100),
        height: Pixel.getPixel(80),
    },
    leftStyle: {
        flexDirection: 'column',
        marginLeft: Pixel.getPixel(20)
    },
    rightStyle: {
        marginHorizontal: Pixel.getPixel(20),
        fontSize: Pixel.getPixel(12),
    },
    bottomButton:{
        flexDirection:'row',
        margin: Pixel.getPixel(15),
        borderRadius:4,
        backgroundColor:fontAndColor.all_blue
    },
    buttonText:{
        fontSize:Pixel.getPixel(16),
        color:'white',
        flex:1,
        textAlign:'center',
        paddingVertical:Pixel.getPixel(7)
    }

});