/**
 * Created by lhc on 2017/2/15.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    InteractionManager,
    WebView,
    BackHandler
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import AllNavigationView from '../component/AllNavigationView';
import * as fontAndColor from '../constant/fontAndColor';
import BaseComponent from '../component/BaseComponent';
let oldUrl = '';
export  default class WebScene extends BaseComponent {

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            renderPlaceholderOnly: true,
        };
    }

    componentWillMount(){
        this.props.screenProps.showModal(true);
    }

    componentDidMount() {

        oldUrl = this.props.navigation.state.params.webUrl;
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});

        });

    }

    handleBack = () => {
        if(oldUrl==this.props.navigation.state.params.webUrl){
            this.backPage();
        }else{
            this.refs.www.goBack();
        }
        return true;
    }


    render() {
        if (this.state.renderPlaceholderOnly) {
            return this._renderPlaceholderView();
        }
        return (
            <View style={{backgroundColor: fontAndColor.COLORA3, flex: 1}}>
                <WebView
                    ref="www"
                    style={{width:width,height:height,backgroundColor:fontAndColor.COLORA3,marginTop:Pixel.getTitlePixel(64)}}
                    source={{uri:this.props.navigation.state.params.webUrl,method: 'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    onLoadEnd={()=>{ this.props.screenProps.showModal(false);}}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                />

                <AllNavigationView title={this.props.navigation.state.params.title} backIconClick={() => {
                    this.backPage();
                }} rightFootClick={()=>{}}/>
            </View>
        );
    }

    onNavigationStateChange=(navState)=> {
        oldUrl=navState.url;
    }

    _renderPlaceholderView() {
        return (
            <View style={{width: width, height: height,backgroundColor: fontAndColor.COLORA3}}>
                <AllNavigationView title={this.props.navigation.state.params.title} backIconClick={() => {
                    this.backPage();
                }} rightFootClick={()=>{}}/>
            </View>
        );
    }


}
const styles = StyleSheet.create({

    image: {
        width: 43,
        height: 43,
    },
    Separator: {
        backgroundColor: fontAndColor.COLORA3,
        height: Pixel.getPixel(10),

    },
    margin: {
        marginRight: Pixel.getPixel(15),
        marginLeft: Pixel.getPixel(15)

    },
    topViewStyle: {flex: 1, height: Pixel.getPixel(44), justifyContent: 'center'}
})