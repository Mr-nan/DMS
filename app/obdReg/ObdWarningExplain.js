import React, {Component} from 'react';
import {AppRegistry, Text, View, Image, TextInput, StyleSheet, TouchableOpacity,NativeModules} from 'react-native';
const login_logs = require('../../images/login_logs.png');
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import * as fontAndColor from '../constant/fontAndColor';
import  PixelUtil from '../utils/PixelUtil'
var Pixel = new PixelUtil();
import AllNavigationView from '../component/AllNavigationView';
import ImagePicker from "react-native-image-picker";
import StorageUtil from '../utils/StorageUtil';
import * as StorageKeyNames from '../constant/storageKeyNames';
let imageData;

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

export  default class ObdWarningExplain extends BaseComponent {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            imageSource: login_logs
        };

    }

    onContentSizeChange(event) {
        this.setState({height: event.nativeEvent.contentSize.height});
    }

    render() {
        return (
            <View style={styles.contain}>
                <View style={styles.wainingExplain}>
                    <Text style={{marginRight: 3, marginLeft:10, color:'black'}}>异常说明:</Text>
                    <TextInput
                        multiline={true}
                        style={{flex:1, flexWrap: 'wrap', height:this.state.height}}
                        placeholder={'请输入异常类说明'}
                        onContentSizeChange={this.onContentSizeChange.bind(this)}
                        underlineColorAndroid={"#00000000"}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text}
                    />
                </View>
                <View style={styles.carPicture}>
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
        );
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

                        NativeModules.DmsCustom.uploadFile(Urls.FILEUPLOAD,token,response.path,
                            (rep)=>{console.log('success',JSON.parse(rep).retdata)
                                imageData=JSON.parse(rep).retdata[0];
                            console.log(imageData);
                                if(JSON.parse(rep).retcode!=='1'){
                                    this.setState({
                                        imageSource: {uri: imageData.file_url}
                                    });
                                }
                        },(error)=>{console.log(error)});
                    }
                });


            }
        });
    }
    cancel = () => {
        this.backPage();
    }
    save = () => {
        if(this.state.text==''){
            this.props.screenProps.showToast('请输入异常类说明！');
        }
            let maps = {
                alarm_explain: this.state.text,
                alarm_explain_img_id: imageData.file_id,
                warn_record_id: this.props.navigation.state.params.warn_record_id,
            };
            request(Urls.ALARM_EXPLAIN, 'Post', maps)

                .then((response) => {
                        this.props.screenProps.showModal(false);
                        this.props.screenProps.showToast('保存成功！');
                        this.backPage();
                        this.props.navigation.state.params.freshDataClick();
                    },
                    (error) => {
                        this.props.screenProps.showModal(false);
                        this.props.screenProps.showToast(error.mjson.retmsg);
                    });
        }

}

let styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    wainingExplain: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: Pixel.getTitlePixel(78),
        marginBottom: Pixel.getPixel(10),
        alignItems: 'center',
        paddingVertical: Pixel.getPixel(12)
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
    carPicture: {
        backgroundColor: 'white',
        padding: Pixel.getPixel(10)
    },

})