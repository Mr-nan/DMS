import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    BackHandler,
    InteractionManager
} from 'react-native';

import BaseComponent from '../component/BaseComponent';
let {height, width} = Dimensions.get('window');
import StorageUtil from '../utils/StorageUtil';
import * as StorageKeyNames from '../constant/storageKeyNames';
// import WelcomScene from './WelcomScene';
// import LoginGesture from '../login/LoginGesture';
// import {request} from '../utils/RequestUtil';
// import * as Urls from '../constant/appUrls';
// import codePush from 'react-native-code-push'
const versionCode = 6.0;

export default class RootScene extends BaseComponent {

    componentDidMount() {
        //codePush.sync();
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        InteractionManager.runAfterInteractions(() => {
            // this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
        });
    }

    initFinish = () => {
        // this.toNextPage('LoginScene',{});
        StorageUtil.mGetItem(StorageKeyNames.ISLOGIN, (data) => {
            if (data.code == 1) {
                if(!this.isEmpty(data.result) && data.result == 'true'){
                    this.placePage('FunctionScene');
                }else{
                    this.toNextPage('LoginScene',{});
                }
            }
        });


        // let maps = {
        //     type: '6',
        //     api: 'api/v1/App/Update'
        // };
        // request(Urls.APP_UPDATE, 'Post', maps)
        //     .then((response) => {
        //             // if (response.mjson.data.versioncode != versionCode) {
        //             //     this.navigatorParams.component = UpLoadScene;
        //             //     this.navigatorParams.params = {url: response.mjson.data.downloadurl}
        //             //     this.toNextPage(this.navigatorParams);
        //             // } else {
        //                 this.toJump();
        //             // }
        //         },
        //         (error) => {
        //             this.toJump();
        //         });
    };

    toJump = () => {
        StorageUtil.mSetItem(KeyNames.NEED_GESTURE, 'true');
        let that = this;
        setTimeout(
            () => {
                StorageUtil.mGetItem(KeyNames.FIRST_INTO, (res) => {
                    if (res.result == null) {
                        that.navigatorParams.component = WelcomScene;
                        that.toNextPage(that.navigatorParams);
                    } else {

                        StorageUtil.mGetItem(KeyNames.ISLOGIN, (res) => {
                            if (res.result !== StorageUtil.ERRORCODE) {
                                if (res.result == null) {
                                    that.navigatorParams.component = LoginAndRegister;
                                    that.toNextPage(that.navigatorParams);
                                } else {
                                    if (res.result == "true") {

                                        StorageUtil.mGetItem(KeyNames.USER_INFO, (data) => {
                                            let datas = JSON.parse(data.result);
                                            if (datas.user_level == 2) {
                                                if (datas.enterprise_list == null || datas.enterprise_list.length <= 0) {
                                                    that.navigatorParams.component = LoginAndRegister;
                                                    that.toNextPage(that.navigatorParams);
                                                } else {
                                                    if (datas.enterprise_list[0].role_type == '2') {
                                                        that.navigatorParams.component = LoginGesture;
                                                        that.navigatorParams.params = {from: 'RootScene'}
                                                        that.toNextPage(that.navigatorParams);
                                                    } else {
                                                        that.navigatorParams.component = MainPage;
                                                        that.navigatorParams.params = {}
                                                        that.toNextPage(that.navigatorParams);
                                                    }
                                                }
                                            } else {
                                                that.navigatorParams.component = MainPage;
                                                that.navigatorParams.params = {}
                                                that.toNextPage(that.navigatorParams);
                                            }
                                        });
                                    } else {
                                        that.navigatorParams.component = LoginAndRegister;
                                        that.toNextPage(that.navigatorParams);
                                    }
                                }
                            }
                        });
                    }
                });
            }, 500
        );
    }

    onPress = () => {
        this.toNextPage(this.mProps)
    };

    // toNextPage = (mProps) => {
    //     const navigator = this.props.navigator;
    //     if (navigator) {
    //         navigator.replace({
    //             ...mProps
    //         })
    //     }
    // };

    // navigatorParams = {
    //     name: 'MainPage',
    //     component: MainPage,
    //     params: {}
    // };

    render() {
        return (
            <View style={{backgroundColor: '#000'}}></View>
        );
    }
}

const styles = StyleSheet.create({
    parentStyle: {
        flex: 1
    },
    childStyle: {
        width: width,
        height: height
    },
});

