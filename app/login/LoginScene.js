/**
 * Created by Administrator on 2017/5/9.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Image,
    TextInput,
    Text,
    Platform,
    TouchableOpacity
} from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';

const {width} = Dimensions.get('window');
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../constant/fontAndColor';
import StorageUtil from '../utils/StorageUtil';
import * as StorageKeyNames from '../constant/storageKeyNames';
import md5 from 'react-native-md5';
import * as AppUrls from '../constant/appUrls';
import * as baseUtil from 'base64-arraybuffer';
const IS_ANDROID = Platform.OS === 'android';

export default class LoginScene extends BaseComponent {

    constructor(props) {
        super(props);
        this.userName = '';
        this.userPwd = '';
        this.userCheck = '';
        this.imageCode = '';
        this.state = {
            isCheck: false,
            codeUrl: ''
        }
    }

    initFinish = () => {
        StorageUtil.mGetItem(StorageKeyNames.USERNAME, (data) => {
            if (data.code == 1) {
                this.userName = data.result;
                this.nameInput.setNativeProps({
                    text: this.userName
                });
            }
        });
        StorageUtil.mGetItem(StorageKeyNames.USERPWD, (data) => {
            if (data.code == 1) {
                this.userPwd = data.result;
                this.pwdInput.setNativeProps({
                    text: this.userPwd
                });
            }
        });
    };

    _showHint = (hint) => {
        this.props.screenProps.showToast(hint);
    };

    _showLoading = () => {
        this.props.screenProps.showModal(true);
    };

    _closeLoading = () => {
        this.props.screenProps.showModal(false);
    };

    _onNameChange = (text) => {
        this.userName = text;
    };

    _onPwdChange = (text) => {
        this.userPwd = text;
    };

    _onCheckChange = (text) => {
        this.userCheck = text;
    };

    _onLoginPress = () => {
        this._dataIsOK();
    };

    _dataIsOK = () => {
        if (this.isEmpty(this.userName)) {
            this._showHint('用户名不可为空');
        } else if (this.isEmpty(this.userPwd)) {
            this._showHint('密码不可为空');
        } else if (this.state.isCheck == true && this.isEmpty(this.userCheck)) {
            this._showHint('验证码不可为空');
        } else {
            StorageUtil.mSetItem(StorageKeyNames.USERNAME, this.userName);
            StorageUtil.mSetItem(StorageKeyNames.USERPWD, this.userPwd);
            this._showLoading();
            this._goLogin();
        }
    };

    _getImageCode = (code) => {
        let url = AppUrls.USER_IMG_CODE + "?img_ver_code_key=" + code;
        let request = new XMLHttpRequest();
        request.responseType = 'arraybuffer';
        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) {
                return;
            }

            if (request.status === 200) {
                let auth = request.getResponseHeader('auth');
                let split = auth.split('=');
                this.imageCode = split[1];

                let base64String = 'data:image/png;base64,' + baseUtil.encode(request.response);;
                // let base64String = 'data:image/png;base64,' + request.response;
                this.setState({
                    codeUrl: base64String,
                    isCheck: true
                });
            } else {
                this._showHint('获取验证码失败');
            }
        };

        request.open('GET', url);
        request.send();


        // fetch(url).then((response) => {
        //     let headers = response.headers;
        //     for (let key of Object.keys(headers.map)) {
        //         if(key == 'auth' && !this.isEmpty(headers.map[key][0])){
        //             let auth = headers.map[key][0];
        //             let split = auth.split('=');
        //             this.imageCode = split[1];
        //             break;
        //         }
        //     }
        //     return response.arrayBuffer();
        // },()=>{
        //     this._showHint('获取验证码失败');
        // }).then((rd)=>{
        //     let base64String ='data:image/png;base64,' + btoa(String.fromCharCode(...new Uint8Array(rd)));
        //     this.setState({
        //         codeUrl:base64String
        //     });
        // },(error)=>{
        //     this._showHint('获取验证码失败');
        // })
    };

    _goLogin = () => {
        let params = {
            username: this.userName,
            password: md5.hex_md5(this.userPwd),
            login_type: '2',
            device_code: 'dycd_dms_manage_android'
        };
        if (this.state.isCheck == true) {
            params.img_code = this.userCheck;
            params.img_sid = this.imageCode;
        }
        if (IS_ANDROID === false) {
            params.login_type = '5';
            params.device_code = 'dycd_dms_manage_android';
        }

        let isOk;
        let body = '';
        for (let key of Object.keys(params)) {
            body += key;
            body += '=';
            body += params[key];
            body += '&';
        }
        if (body.length > 0) {
            body = body.substring(0, body.length - 1);
        }

        fetch(AppUrls.USER_LOGIN + '?' + body, {
            method: 'post',
            body: body,
        }).then((response) => {
            if (response.ok) {
                isOk = true;
            } else {
                isOk = false;
            }
            console.log(response);
            return response.json();
        }).then((rd) => {
                this._closeLoading();
                console.log('11111111=====>>>>');
                console.log(rd);
                if (isOk) {
                    if (rd.retcode == 1) {
                        //登录成功
                        StorageUtil.mSetItem(StorageKeyNames.ISLOGIN, 'true');
                        StorageUtil.mSetItem(StorageKeyNames.TOKEN, rd.rettoken);
                        StorageUtil.mSetItem(StorageKeyNames.USER_FUNCTION, JSON.stringify(rd.retdata));
                        this.placePage('FunctionScene');
                    } else if (
                        rd.retcode == '4620001' || rd.retcode == '4610003'
                        || rd.retcode == '4620004' || rd.retcode == '-4620003'
                        || rd.retcode == '-4620002') {
                        //需要输入验证码
                        this._showHint("" + rd.retmsg);
                        this._getImageCode(rd.retdata.img_ver_code_key);
                    } else {
                        if (!this.isEmpty(rd.retmsg)) {
                            this._showHint("" + rd.retmsg);
                        } else {
                            this._showHint("服务器请求失败，请重新请求");
                        }
                    }
                } else {
                    this._showHint('网络请求失败1');
                }
            }
        ).catch((error) => {
            this._closeLoading();
            this._showHint('网络请求失败2');
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <Image style={styles.logoContainer} source={require('../../images/login_logs.png')}/>
                    <View style={styles.nameContainer}>
                        <Image style={styles.ImgContainer} source={require('../../images/login_username.png')}/>
                        <TextInput
                            ref={(input) => {
                                this.nameInput = input
                            }}
                            style={styles.inputContainer}
                            underlineColorAndroid='transparent'
                            placeholder={'账号'}
                            onChangeText={this._onNameChange}
                        />
                    </View>
                    <View style={styles.lineSplit}/>
                    <View style={styles.pwdContainer}>
                        <Image style={styles.ImgContainer} source={require('../../images/login_password.png')}/>
                        <TextInput
                            ref={(input) => {
                                this.pwdInput = input
                            }}
                            style={styles.inputContainer}
                            underlineColorAndroid='transparent'
                            placeholder={'密码'}
                            onChangeText={this._onPwdChange}
                        />
                    </View>
                    <View style={styles.lineSplit}/>
                    {
                        this.state.isCheck &&
                        <View style={styles.pwdContainer}>
                            <Image style={styles.ImgContainer} source={require('../../images/login_shield_gray.png')}/>
                            <TextInput
                                ref={(input) => {
                                    this.checkInput = input
                                }}
                                style={styles.checkInput}
                                underlineColorAndroid='transparent'
                                placeholder={'验证码'}
                                onChangeText={this._onCheckChange}
                            />
                            <Image style={styles.checkImg} source={{uri: this.state.codeUrl} }/>
                        </View>
                    }
                    <View style={{width: width}}>
                        <TouchableOpacity style={styles.btnLogin} activeOpacity={0.6} onPress={() => {
                            this._onLoginPress()
                        }}>
                            <Text style={styles.btnFont}>登 录</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <AllNavigationView title={'第1车贷'}/>
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
        alignItems: 'center'
    },
    logoContainer: {
        marginTop: Pixel.getPixel(20),
        height: Pixel.getPixel(80),
        width: Pixel.getPixel(80)
    },
    nameContainer: {
        flexDirection: 'row',
        paddingHorizontal: Pixel.getPixel(15),
        height: Pixel.getPixel(46),
        marginTop: Pixel.getPixel(20),
        backgroundColor: fontAndColor.white,
        alignItems: 'center'
    },
    ImgContainer: {
        width: Pixel.getPixel(25),
        height: Pixel.getPixel(25),
    },
    inputContainer: {
        flex: 1,
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(20)
    },
    lineSplit: {
        height: Pixel.getPixel(1),
        backgroundColor: fontAndColor.line_gray
    },
    pwdContainer: {
        flexDirection: 'row',
        paddingHorizontal: Pixel.getPixel(15),
        height: Pixel.getPixel(46),
        backgroundColor: fontAndColor.white,
        alignItems: 'center'
    },
    checkInput: {
        flex: 1,
        marginLeft: Pixel.getPixel(15),
        fontSize: Pixel.getFontPixel(20),
        marginRight: Pixel.getPixel(90)
    },
    checkImg: {
        width: Pixel.getPixel(85),
        height: Pixel.getPixel(30)
    },
    btnLogin: {
        marginTop: Pixel.getPixel(20),
        marginHorizontal: Pixel.getPixel(30),
        height: Pixel.getPixel(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Pixel.getFontPixel(5),
        backgroundColor: fontAndColor.all_blue
    },
    btnFont: {
        fontSize: Pixel.getFontPixel(20),
        color: fontAndColor.white,
        fontWeight: 'bold'
    }
});


