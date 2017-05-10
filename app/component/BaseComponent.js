import React, {Component} from "react";
import {
    View,
    BackHandler,
    InteractionManager,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
    Text,
} from "react-native";

import PixelUtil from "../utils/PixelUtil";
import * as fontAndColor from "../constant/fontAndColor";
import MyButton from "./MyButton";
const {width, height} = Dimensions.get('window');
const Pixel = new PixelUtil();
import ConsoleUtils from "../utils/ConsoleUtils";
const Console = new ConsoleUtils();

import { NavigationActions } from 'react-navigation'

export default class BaseComponent extends Component {

    handleBack = () => {
        console.log('11111111111111111');
        this.backPage();
        return true;
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        InteractionManager.runAfterInteractions(() => {
            //this.setState({renderPlaceholderOnly: 'loading'});
            this.initFinish();
        });
    }

    initFinish() {

    }

    toNextPage = (mPage,mParam) => {
        const { navigate } = this.props.navigation;
        navigate(mPage,mParam);
    };

    backToLogin = (mProps) => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.immediatelyResetRouteStack([{
                ...mProps
            }])
        }
    };

    backPage = () => {
        const { dispatch } = this.props.navigation;
        const backAction = NavigationActions.back({
            key: null
        });
        dispatch(backAction);
    };

    placePage = (name)=> {
        const { dispatch } = this.props.navigation;
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: name})
            ]
        });
        dispatch(resetAction)
    };

    backToTop = () => {
        const navigator = this.props.navigator;
        if (navigator) {
            navigator.popToTop();
        }
    };


    showConsole = (content) => {
        Console.showConsole(content);
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
    }

    allRefreshParams = {
        buttonType: MyButton.TEXTBUTTON,
        parentStyle: {
            height: Pixel.getPixel(40),
            width: Pixel.getPixel(140),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: fontAndColor.COLORB0,
            marginTop: Pixel.getPixel(66)
        },
        childStyle: {
            fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
            color: '#ffffff',
        },
        opacity: 0.8,
        content: '刷新',
        mOnPress: () => {
            this.allRefresh();
        }
    }
    allRefresh = () => {

    }

    loadView = () => {
        let view;
        let margintop = 0;
        if (this.state.loadingMarginTop) {
            margintop = this.state.loadingMarginTop;
        }
        if (this.state.renderPlaceholderOnly == 'blank') {
            view = <View/>
        } else if (this.state.renderPlaceholderOnly == 'loading') {
            view = <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                    style={{
                        width: Pixel.getPixel(150),
                        height: Pixel.getPixel(159),
                        marginTop: Pixel.getTitlePixel(189) - margintop
                    }}
                    source={require('../../images/loading.gif')}/>
                <Text
                    style={{
                        color: fontAndColor.COLORA0,
                        fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                        marginTop: Pixel.getPixel(32)
                    }}>
                    加载中......
                </Text>
            </View>
        } else if (this.state.renderPlaceholderOnly == 'error') {
            view = <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                    style={{
                        width: Pixel.getPixel(121),
                        height: Pixel.getPixel(163),
                        marginTop: Pixel.getTitlePixel(85 + 64) - margintop
                    }}
                    source={require('../../images/loadingError.png')}/>
                <Text
                    style={{
                        color: fontAndColor.COLORA0, fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                        marginTop: Pixel.getPixel(27)
                    }}>
                    网络错误
                </Text>
                <Text
                    style={{
                        color: fontAndColor.COLORA1, fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                        marginTop: Pixel.getPixel(10)
                    }}>
                    当前网络环境较差，请刷新重试
                </Text>
                <MyButton {...this.allRefreshParams} />
            </View>
        } else {
            view = <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                    style={{
                        width: Pixel.getPixel(121),
                        height: Pixel.getPixel(163),
                        marginTop: Pixel.getTitlePixel(85 + 64) - margintop
                    }}
                    source={require('../../images/noData.png')}/>
                <Text
                    style={{
                        color: fontAndColor.COLORA0, fontSize: Pixel.getFontPixel(fontAndColor.BUTTONFONT30),
                        marginTop: Pixel.getPixel(27)
                    }}>
                    暂无数据
                </Text>
                <Text
                    style={{
                        color: fontAndColor.COLORA1, fontSize: Pixel.getFontPixel(fontAndColor.LITTLEFONT28),
                        marginTop: Pixel.getPixel(10)
                    }}>
                </Text>
            </View>
        }
        return view;

    }

    loadingView = () => {
        let view;
        if (this.state.loading == true) {
            view = <TouchableWithoutFeedback onPress={() => {
            }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        width: width,
                        height: height,
                    }}>
                    <Image style={{width: 60, height: 60}}
                           source={require('../../images/setDataLoading.gif')}/>
                </View>
            </TouchableWithoutFeedback>
        } else {
            view = null;
        }
        return view;
    }

    isEmpty = (str)=>{
        if(typeof(str) != 'undefined' && str !== ''){
            return false;
        }else {
            return true;
        }
    };
}