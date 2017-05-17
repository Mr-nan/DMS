/**
 * Created by Administrator on 2017/5/16.
 */
import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ListView,
    Dimensions,
    NativeModules,
    NativeAppEventEmitter
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as FontAndColor from '../constant/fontAndColor';
import AllNavigationView from '../component/AllNavigationView';
const {width} = Dimensions.get('window');

export default class BluetoothScene extends BaseComponent{

    constructor(props){
        super(props);
        this.allSource = [];
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state= {
            deviceName:'',
            dataSource: this.ds.cloneWithRows(this.allSource),
            scan:'搜索设备'
        };
    }

    componentDidMount(){
        NativeAppEventEmitter
            .addListener('findBluetooth', this._findBluetooth);

        NativeAppEventEmitter
            .addListener('onBleConnection', this._onBleConnection);

        NativeAppEventEmitter
            .addListener('onReadData', this.props.navigation.state.params.onReadData);
    }

    _findBluetooth = (data)=>{
        if(this._hasContain(data) === false){
            if(data.name !== null && data.name.length > 3 &&
            data.name.substring(0,3) === 'CJJ'){
                this.allSource.push(data);
                this.setState({
                    dataSource:this.ds.cloneWithRows(this.allSource),
                });
            }
        }
    };

    _hasContain =(data)=>{
        let ctn = false;
        this.allSource.map((dt)=>{
            if(data.name !== null && data.address !== null
                && data.name === dt.name && data.address === dt.address){
                ctn = true;
            }
        });
        return ctn;
    };

    _showHint=(hint)=>{
        this.props.screenProps.showToast(hint);
    };

    _onBleConnection = (data)=>{
        if(data.can == '1'){
            NativeModules.DmsCustom.scanSound(1);
            NativeModules.DmsCustom.stopFind();
            this.setState({
                deviceName:this.deviceN,
                scan:'搜索设备'
            });
            this.props.navigation.state.params.onBlueConnection();
        }else{
            NativeModules.DmsCustom.scanSound(0);
            console.log('连接失败');
        }
    };

    _startConnection = (item)=>{
        this.deviceN = item.name;
        NativeModules.DmsCustom.startConnection(item.name,item.address);
    };

    _renderItem=(item)=>{
        return(
            <TouchableOpacity style={styles.bleItemWrap}
            onPress={()=>{this._startConnection(item)}}>
                <Text style={styles.bleItemName}>{item.name}</Text>
                <Text style={styles.bleItemAddress}>{item.address}</Text>
            </TouchableOpacity>
        );
    };


    _openBlueTooth = ()=>{
        NativeModules.DmsCustom.startBluetooth();
    };

    _scanBlueTooth = ()=>{
        NativeModules.DmsCustom.startFind((success)=>{this.setState({
                scan:'正在搜索'
            })},
            (error)=>{
                this._showHint(error);
            });
    };

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <View style={styles.titleWrap}>
                        <Text style={styles.titleLeftFont}>{'当前连接设备：'}</Text>
                        <Text style={styles.titleRightFont}>{this.state.deviceName}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <ListView
                            enableEmptySections={true}
                            dataSource={this.state.dataSource}
                            renderRow={this._renderItem}
                        />
                    </View>
                    <View style={styles.bottomWrap}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.leftBtnWrap}
                            onPress={this._openBlueTooth}
                        >
                            <Text style={styles.BtnTxt}>开启蓝牙</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.rightBtnWrap}
                            onPress={this._scanBlueTooth}
                        >
                            <Text style={styles.BtnTxt}>{this.state.scan}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <AllNavigationView title={'蓝牙连接'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>
        );
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
    titleWrap:{
        flexDirection:'row',
        height:Pixel.getPixel(40),
        alignItems:'center',
        width:width
    },
    titleLeftFont:{
        marginLeft:Pixel.getPixel(5),
        fontSize:Pixel.getFontPixel(20),
        color:FontAndColor.txt_gray
    },
    titleRightFont:{
        marginLeft:Pixel.getPixel(5),
        fontSize:Pixel.getFontPixel(20),
        color:FontAndColor.black
    },
    bottomWrap:{
        height:Pixel.getPixel(50),
        paddingBottom:Pixel.getPixel(10),
        flexDirection:'row'
    },
    leftBtnWrap:{
        flex:1,
        marginHorizontal:Pixel.getPixel(30),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#76C8C2',
        borderRadius:Pixel.getPixel(5)
    },
    BtnTxt:{
        color:FontAndColor.white,
        fontSize:Pixel.getFontPixel(20),
        fontWeight: 'bold'
    },
    rightBtnWrap:{
        flex:1,
        marginRight:Pixel.getPixel(30),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#76C8C2',
        borderRadius:Pixel.getPixel(5)
    },
    bleItemWrap:{
        width:width,
        backgroundColor:FontAndColor.all_background
    },
    bleItemName:{
        height:Pixel.getPixel(40),
        marginLeft:Pixel.getPixel(20),
        color:FontAndColor.all_blue,
        fontSize:Pixel.getFontPixel(18)
    },
    bleItemAddress:{
        height:Pixel.getPixel(40),
        marginLeft:Pixel.getPixel(20),
        color:FontAndColor.all_blue,
        fontSize:Pixel.getFontPixel(14)
    }

});
