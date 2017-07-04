import React, {Component} from 'react';
import {AppRegistry, Text, View, Image, TextInput, StyleSheet, TouchableOpacity,NativeModules,NativeAppEventEmitter,Platform} from 'react-native';
const login_logs = require('../../images/login_logs.png');
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import * as fontAndColor from '../constant/fontAndColor';
import  PixelUtil from '../utils/PixelUtil'
var Pixel = new PixelUtil();
import AllNavigationView from '../component/AllNavigationView';
import SelectMaskComponent from '../makingInventory/SelectMaskComponent';
import ImagePicker from "react-native-image-picker";
import StorageUtil from '../utils/StorageUtil';
import * as StorageKeyNames from '../constant/storageKeyNames';
import * as Net from '../utils/UpLoadFileUtil';
const IS_ANDROID = Platform.OS === 'android';
let allSouce = [];
let file_id='';
let files;
let vin, chkno, model, brand, address, status;
let valueText='标签损坏';
let excecode='';
let maps={};

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
        blueToothText:'设备未连接'
    }
};

let that = null;
export  default class CarCheckWarning extends BaseComponent {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            text: '标签损坏',
            warningExplain: '标签损坏',
            dataSource: {},
            photoStyle:{},
            scanLabelText:'请扫描标签',//E28068102000000447C0B022
            scanObdText:'',
            labelText:'扫描标签',
            imageSource: login_logs,
            labelStyle: {},
            blueToothText:'设备未连接'
        };
        that = this;
    }

    initFinish() {
        NativeModules.DmsCustom.isConnection((data)=>{
            if(data==1){
                that.setState({
                    blueToothText: '设备已连接'
                });
            }
        })
        NativeAppEventEmitter
            .addListener('onReadData', this.onReadData);
        vin=this.props.navigation.state.params.vin;
        chkno=this.props.navigation.state.params.chkno;
        model=this.props.navigation.state.params.model;
        brand=this.props.navigation.state.params.brand;
        address=this.props.navigation.state.params.address;
        status=this.props.navigation.state.params.status;
        this.getData();

    }

    onBlueConnection(){
        that.setState({
            blueToothText: '设备已连接'
        });
    }

    onReadData(data){
        that.setState({
            scanLabelText: data.result
        });
    }

    getData = () => {
        allSouce = [];
        this.props.screenProps.showModal(true);
        let maps = {};
        request(Urls.AUTOGETEXCEPTIONDICTLIST, 'Post', maps)

            .then((response) => {
                    allSouce.push(...response.mjson.retdata);
                    excecode=response.mjson.retdata[0].code;
                    console.log(excecode);
                    this.props.screenProps.showModal(false);
                },
                (error) => {
                    this.props.screenProps.showToast(error.mjson.retmsg);
                    this.props.screenProps.showModal(false);
                });
    }
    saveData = () => {
        this.props.screenProps.showModal(true);
        // map.put("excecode", "" + list.get(position).getCode());
        // map.put("execinfo", "" + ycsm);
        // map.put("vin", "" + vin);
        // map.put("reqtoken", "" + token);
        // map.put("chkno", "" + chkno);
        // if (type == 2) {
        //     map.put("newrfid", "" + bq);
        //     map.put("rfid_img_id", "" + fileid);
        // }
        if(valueText=='标签损坏'){
            if(file_id==''){
                this.props.screenProps.showToast('请拍照！');
                return;
            }
            maps = {
                vin: vin,
                chkno: chkno,
                excecode: excecode,
                newrfid: this.state.scanObdText,
                rfid_img_id: file_id,
                execinfo: this.state.warningExplain,
            };
        }else{
            maps = {
                vin: vin,
                chkno: chkno,
                excecode: excecode,
                execinfo: this.state.warningExplain,
            };
        }

        request(Urls.CARCHECKSUBMITCHKDATA, 'Post', maps)

            .then((response) => {
                    this.props.screenProps.showModal(false);
                    this.props.screenProps.showToast('盘库成功');
                    setTimeout(()=>{
                        this.backPage();
                        this.props.navigation.state.params.freshDataClick();
                    },500);
                },
                (error) => {
                    this.props.screenProps.showModal(false);
                    this.props.screenProps.showToast(error.mjson.retmsg);
                });
    }

    saveObd = () => {
        if (this.state.scanObdText == '') {
            this.props.screenProps.showToast('请扫描OBD');
            return;
        }
        let maps = {
            obd_number: this.state.scanObdText,
            chkno: chkno,
        };
        request(Urls.CARREVREGRFIDTOOBD, 'Post', maps)

            .then((response) => {
                    this.props.screenProps.showModal(false);
                    this.props.screenProps.showToast('监管改为OBD监管成功');
                    setTimeout(()=>{
                        this.backPage();
                        this.props.navigation.state.params.freshDataClick();
                    },500);
                },
                (error) => {
                    console.log(error.mjson);
                    this.props.screenProps.showModal(false);
                    this.props.screenProps.showToast(error.mjson.retmsg);
                });
    }

    onContentSizeChange(event) {
        this.setState({height: event.nativeEvent.contentSize.height});
    }

    render() {
        return (
            <View style={styles.contain}>
                <View style={styles.blueTooth}>
                    <Text style={{flex: 1, textAlign:'center'}}>{this.state.blueToothText}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={this.labelClick}>
                    <View style={[styles.wainingExplain,{paddingVertical: Pixel.getPixel(18)}]}>
                        <Text style={{marginRight: 3, marginLeft:10, color:'black',flex:1}}>异常类型：</Text>
                        <Text style={{marginRight:10, color:'black'}}>{this.state.warningExplain}</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.wainingExplain}>
                    <Text style={{marginRight: 3, marginLeft:10, color:'black'}}>异常说明：</Text>
                    <TextInput
                        multiline={true}
                        style={{flex:1, flexWrap: 'wrap', height:this.state.height,textAlign: 'right',marginRight:10}}
                        onContentSizeChange={this.onContentSizeChange.bind(this)}
                        underlineColorAndroid={"#00000000"}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text}
                    />
                </View>

                <View style={[styles.scanLabel, this.state.labelStyle]}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <TouchableOpacity style={styles.scanButton} onPress={this.scanLabelClick}>
                            <Text style={{color:'white',fontSize: Pixel.getPixel(13)}}>{this.state.labelText}</Text>
                        </TouchableOpacity>
                        {
                            this.state.labelText == '扫描OBD' ? null : <View style={{flex:1}}></View> }
                        {
                            this.state.labelText == '扫描OBD' ? <TextInput
                                    multiline={true}
                                    style={{flex:1, flexWrap: 'wrap', height:this.state.height,textAlign: 'right',marginRight:10}}
                                    onContentSizeChange={this.onContentSizeChange.bind(this)}
                                    underlineColorAndroid={"#00000000"}
                                    placeholder={'请扫描OBD'}
                                    onChangeText={(scanObdText) => this.setState({scanObdText})}
                                    value={this.state.scanObdText}
                                /> :
                                    <Text>{this.state.scanLabelText}</Text>

                        }

                    </View>
                </View>
                <View style={[styles.carPicture, this.state.photoStyle]}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{color:'red',marginRight:3}}>*</Text>
                        <Text style={{flex:1}}>车辆照片 （体现防伪标签和车架号）</Text>
                        <TouchableOpacity style={styles.photoButton} onPress={this.takePhoto}>
                            <Text style={{color:'white'}}>拍照</Text>
                        </TouchableOpacity>
                    </View>
                    <Image style={styles.image} source={this.state.imageSource}/>
                </View>
                <View style={{flex:1}}></View>
                <TouchableOpacity style={styles.bottomButton} activeOpacity={0.8} onPress={
                    this.save
                }>
                    <Text style={styles.buttonText}>提交</Text>
                </TouchableOpacity>

                <AllNavigationView title={'盘库异常'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>
        );
    }

    labelClick=()=>{
        valueText='';
        this.toNextPage('SelectMaskComponent', {
            viewData: allSouce,
            onClick: this._onClick,
            excecode: excecode

        })
    }
    scanLabelClick=()=>{
        if(this.state.labelText=='扫描标签'){
            this.toNextPage('BluetoothScene',{onReadData:this.onReadData})
        }else {
            NativeModules.DmsCustom.qrScan((rep) => {

                console.log('scan result', rep);
                if(typeof(rep.suc) === 'undefined' || rep.suc === null){
                    this._showHint('扫描失败');
                }else{
                    this.setState({
                        scanObdText: rep.suc.scan_result
                    });
                }
            })
        }
    }

    _onClick = (code, value) => {
        console.log(code+'-------'+value);
        valueText=value;
        excecode= code;
        this.setState({
            warningExplain: value,
            text: value,
            scanObdText: '',
            scanLabelText: '请扫描标签',
            photoStyle: value=='标签损坏' ? {display: 'flex'}:{display: 'none'},
            labelText: value=='OBD监管' ? '扫描OBD':'扫描标签',
            labelStyle: (value=='标签损坏' || value=='OBD监管') ? {display: 'flex'}:{display: 'none'},

        });
    }

    takePhoto = () => {
        if(IS_ANDROID === true){
            StorageUtil.mGetItem(StorageKeyNames.CAMERA_CUSTOM, (data) => {
                if (data.code == 1) {
                    if(data.result === '0' ){
                        //使用自定义相机
                        this.customeCamera();
                    }else if(data.result === '1' || data.result == null){
                        //使用系统相机
                        this.systemCamera();
                    }
                }
            });
        }else{
            this.systemCamera();
        }
    }

    systemCamera = () =>{
        ImagePicker.launchCamera(options, (responsesss) => {
            if (responsesss.didCancel) {
            }
            else if (responsesss.error) {
            }
            else if (responsesss.customButton) {
            }
            else {
                Net.request(responsesss.uri).then(
                    (response)=>{
                        this.props.screenProps.showToast('上传成功');
                        this.setState({
                            imageSource: {uri: response.mjson.retdata[0].file_url}
                        });
                        file_id=response.mjson.retdata[0].file_id;
                        if(IS_ANDROID === true){
                            console.log('file path',responsesss.path);
                            NativeModules.DmsCustom.deleteImageFile(responsesss.path);
                        }else{

                        }
                    },
                    (error)=>{
                        this.props.screenProps.showToast('上传失败');
                    });
            }
        });
    }
    customeCamera = () =>{
        NativeModules.DmsCustom.customCamera(40,
            (success) => {
                Net.request(success.uri).then(
                    (response)=>{
                        this.props.screenProps.showToast('上传成功');
                        this.setState({
                            imageSource: {uri: response.mjson.retdata[0].file_url}
                        });
                        file_id=response.mjson.retdata[0].file_id;
                        if(IS_ANDROID === true){
                            console.log('file path',success.path);
                            NativeModules.DmsCustom.deleteImageFile(success.path);
                        }else{

                        }
                    },
                    (error)=>{
                        this.props.screenProps.showToast('上传失败');
                    });


            }, (error) => {
                this.props.screenProps.showToast(error);
            });
    }

    save = () => {
        console.log('-----------'+this.state.warningExplain+'--------'+valueText);
        if(this.state.warningExplain==''){
            this.props.screenProps.showToast('请输入异常说明');
            return;
        }
        if(valueText=='OBD监管'){
            this.saveObd();
            return;
        }
        this.saveData();
    }
}

let styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    blueTooth: {
        flexDirection: 'row',
        backgroundColor: '#F6F693',
        paddingVertical: 5,
        marginTop: Pixel.getTitlePixel(68)
    },
    wainingExplain: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: Pixel.getPixel(10),
        alignItems: 'center',
        paddingVertical: Pixel.getPixel(8)
    },
    image: {
        height: Pixel.getPixel(90),
        width: Pixel.getPixel(100),
        marginTop: Pixel.getPixel(10),
        marginLeft: Pixel.getPixel(20)
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
    cancelButton: {
        backgroundColor: 'white',
        borderRadius: 3,
        width: Pixel.getPixel(75),
        height: Pixel.getPixel(35),
        marginRight: Pixel.getPixel(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1
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
    carPicture: {
        backgroundColor: 'white',
        padding: Pixel.getPixel(10),
        marginTop: Pixel.getPixel(10),
    },
    bottomButton: {
        flexDirection: 'row',
        margin: Pixel.getPixel(15),
        borderRadius: 4,
        backgroundColor: fontAndColor.all_blue
    },
    buttonText: {
        fontSize: Pixel.getPixel(16),
        flexDirection: 'row',
        color: 'white',
        flex: 1,
        textAlign: 'center',
        paddingVertical: Pixel.getPixel(7)
    },
    scanLabel: {
        backgroundColor: 'white',
        padding: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(10),
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