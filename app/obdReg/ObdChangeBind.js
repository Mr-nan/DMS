import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    NativeModules,
    NativeAppEventEmitter,
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
import ImagePicker from "react-native-image-picker";
import StorageUtil from '../utils/StorageUtil';
import * as StorageKeyNames from '../constant/storageKeyNames';
let imageData;
let files;
let that=null;
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
export  default class ObdChangeBind extends BaseComponent {

    constructor() {
        super()
        this.state = {
            index: 0,
            labelText: '扫描标签',
            scanObdText: '请扫描OBD',
            scanLabel: '请扫描标签',
            imageSource: addIcon
        }
        this.onSelect = this.onSelect.bind(this)
        that = this;
    }

    initFinish(){
        NativeAppEventEmitter
            .addListener('onReadData', this.onReadData);
    }

    onSelect(index) {
        if (index == 0) {
            this.setState({
                index: index,
                labelText: '扫描标签'
            })
        } else {
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
                            this.state.index == 0 ? <Text >{this.state.scanLabel}</Text> :
                                <Text >{this.state.scanObdText}</Text>
                        }

                    </View>
                </View>
                <View style={[styles.scanLabel, this.state.index == 0 ? null: {display: 'none'}]}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <TouchableOpacity style={styles.photoButton} onPress={this.takePhoto}>
                            <Text style={{color:'white'}}>拍照</Text>
                        </TouchableOpacity>
                        <View style={{flex:1}}></View>
                        <Image style={styles.addIcon} source={this.state.imageSource}/>
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
        if (this.state.index == 1) {
            this.saveObd();
        } else {
            this.saveSM();
        }
    }

    saveObd = () => {

        if (this.state.scanObdText == '请扫描OBD') {
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
    saveSM = () => {
        // map.put("rfid", rfid);
        // map.put("product_type_code", product_type_code);
        // map.put("regulator_id", regulator_id);
        // map.put("files", reslut.toString());

        if (this.state.scanLabel == '请扫描标签') {
            this.props.screenProps.showToast('请扫描标签！');
            return;
        }
        if(imageData==null){
            this.props.screenProps.showToast('请拍照！');
            return;
        }
        files = {
            file_id: imageData.file_id,
            syscodedata_id: 'reqfile1'
        }
        let maps = {
            files: JSON.stringify([files]).toString(),
            product_type_code: this.props.navigation.state.params.product_type_code,
            regulator_id: this.props.navigation.state.params.regulator_id,
            rfid: this.state.scanLabel,
        };
        request(Urls.REGOBDTORFID, 'Post', maps)

            .then((response) => {
                    console.log(response);
                    if (response.mjson.retcode == '1') {
                        this.props.screenProps.showModal(false);
                        this.props.screenProps.showToast('保存成功');
                        setTimeout(()=>{
                            this.backPage();
                            this.props.navigation.state.params.freshDataClick();
                        },500);
                    }
                },
                (error) => {
                    this.props.screenProps.showModal(false);
                    this.props.screenProps.showToast(error.mjson.retmsg);
                });
    }

    takePhoto = () => {
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

                        NativeModules.DmsCustom.uploadFile(Urls.FILEUPLOAD, token, response.path,
                            (rep) => {
                                console.log('success', JSON.parse(rep).retdata)
                                imageData = JSON.parse(rep).retdata[0];
                                console.log(imageData);
                                if (JSON.parse(rep).retcode !== '1') {
                                    this.setState({
                                        imageSource: {uri: imageData.file_url}
                                    });
                                }
                            }, (error) => {
                                console.log(error)
                            });
                    }
                });


            }
        });
    }

    onReadData(data){
        that.setState({
            scanLabel: data.result
        });
    }

    labelClick = () => {
        if (this.state.index == 0) {

            this.toNextPage('BluetoothScene',{onReadData:this.onReadData})
        } else {
            NativeModules.DmsCustom.qrScan((success) => {
                console.log('success', success)
                this.setState({
                    scanObdText: success.scan_result
                });

            }, (error) => {
                console.log('error', error)
            });
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
    scanLabel: {
        backgroundColor: 'white',
        padding: Pixel.getPixel(15),
        marginTop: Pixel.getPixel(10),
    },
    addIcon: {
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
