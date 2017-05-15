import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    NativeModules
} from 'react-native';

import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import * as fontAndColor from '../constant/fontAndColor';
import AllNavigationView from '../component/AllNavigationView';
import  PixelUtil from '../utils/PixelUtil'
const addIcon = require('../../images/add.png');
var Pixel = new PixelUtil();

export  default class ObdChangeBind extends BaseComponent {

    constructor() {
        super()
        this.state = {
            index: 0,
            labelText: '扫描标签',
            scanObdText: '扫描OBD',
            scanLabel:'扫描标签'
        }
        this.onSelect = this.onSelect.bind(this)
    }

    onSelect(index) {
        if(index==0){
            this.setState({
                index: index,
                labelText: '扫描标签'
            })
        }else{
            this.setState({
                index: index,
                labelText: '扫描OBD'
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.blueTooth}>
                    <Text style={{flex: 1, textAlign:'center'}}>设备未连接</Text>
                </View>

                <RadioGroup
                    size={18}
                    thickness={2}
                    color='red'
                    selectedIndex={0}
                    style={styles.radioGroup}
                    onSelect={(index) => this.onSelect(index)}
                >
                    <RadioButton>
                        <Text>扫描标签</Text>
                    </RadioButton>

                    <RadioButton>
                        <Text>扫描OBD</Text>
                    </RadioButton>

                </RadioGroup>

                <View style={styles.scanLabel}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <TouchableOpacity style={styles.scanButton} onPress={this.labelClick}>
                            <Text style={{color:'white',fontSize: Pixel.getPixel(13)}}>{this.state.labelText}</Text>
                        </TouchableOpacity>
                        <View style={{flex:1}}></View>
                        {
                            this.state.index==0 ?  <Text >{this.state.labelText}</Text> : <Text >{this.state.scanObdText}</Text>
                        }

                    </View>
                </View>
                <View style={[styles.scanLabel, this.state.index == 0 ? null: {display: 'none'}]}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <TouchableOpacity style={styles.photoButton} onPress={this.takePhoto}>
                            <Text style={{color:'white'}}>拍照</Text>
                        </TouchableOpacity>
                        <View style={{flex:1}}></View>
                        <Image style={styles.addIcon} source={addIcon}/>
                    </View>
                </View>

                <View style={{flex:1}}></View>
                <View style={{flexDirection:'row', margin:10}}>
                    <TouchableOpacity style={styles.cancelButton} onPress={this.cancel}>
                        <Text style={{color:'black',fontSize:16}}>取消</Text>
                    </TouchableOpacity>
                    <View style={{flex:1}}></View>
                    <TouchableOpacity style={styles.saveButton} onPress={this.save}>
                        <Text style={{color:'white',fontSize:16}}>保存</Text>
                    </TouchableOpacity>
                </View>
                <AllNavigationView title={'OBD异常报警说明'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>
        )
    }

    cancel = () => {
        this.backPage();
    }
    save = () => {
        if(this.state.index==1){
            this.saveObd();
        }
    }

    saveObd=()=>{

        if(this.state.scanObdText=='扫描OBD'){
            this.props.screenProps.showToast('请扫描OBD');
            return;
        }
        let maps = {
            obd_number: this.state.scanObdText,
            product_type_code: this.props.navigation.state.params.product_type_code,
            regulator_id: this.props.navigation.state.params.regulator_id,
        };
        request(Urls.REGRFIDTOOBD, 'Post', maps)

            .then((response) => {
                    this.props.screenProps.showModal(false);
                    this.props.screenProps.showToast('保存成功');
                    this.backPage();
                    this.props.navigation.state.params.freshDataClick();
                },
                (error) => {
                    this.props.screenProps.showToast(error.mjson.retmsg);
                    this.props.screenProps.showModal(false);
                });
    }

    takePhoto = () => {
        alert('拍照')
    }
    labelClick = () => {
        if(this.state.index==0){

            alert('扫描标签')
        }else{
                NativeModules.DmsCustom.qrScan((success)=>{
                    console.log('success',success)
                    this.setState({
                        scanObdText: success.scan_result
                    });

                },(error)=>{console.log('error',error)});
        }
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0'
    },
    text: {
        padding: 10,
        fontSize: 16,
    },
    blueTooth: {
        flexDirection: 'row',
        backgroundColor: '#F6F693',
        paddingVertical: 5,
        marginTop: Pixel.getPixel(48)
    },
    radioGroup: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 6,
        justifyContent: 'space-around'
    },
    cancelButton: {
        backgroundColor: 'white',
        borderRadius: 3,
        width: Pixel.getPixel(75),
        height: Pixel.getPixel(35),
        marginRight: Pixel.getPixel(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:'black',
        borderWidth:1
    },
    saveButton: {
        backgroundColor: '#08c5a7',
        borderRadius: 3,
        width: Pixel.getPixel(75),
        height: Pixel.getPixel(35),
        marginLeft: Pixel.getPixel(10),
        alignItems: 'center',
        justifyContent: 'center'
    },
    scanLabel: {
        backgroundColor: 'white',
        padding: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(10),
    },
    addIcon:{
        width: Pixel.getPixel(80),
        height: Pixel.getPixel(80),
    },
    photoButton: {
        backgroundColor: '#08c5a7',
        borderRadius: 3,
        width: Pixel.getPixel(65),
        height: Pixel.getPixel(30),
        marginRight: Pixel.getPixel(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanButton: {
        backgroundColor: '#08c5a7',
        borderRadius: 3,
        height: Pixel.getPixel(30),
        marginRight: Pixel.getPixel(10),
        alignItems: 'center',
        justifyContent: 'center',
        padding: Pixel.getPixel(3)
    },
})
