/**
 * Created by Administrator on 2017/5/17.
 */
import React from 'react';
import {
    View,
    StyleSheet,
    Platform
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import * as FontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as Net from '../utils/RequestUtil';
import * as appUrls from '../constant/appUrls';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import StockBottomScene from './StockBottomScene';
import StockTopOrderScene from './StockTopOrderScene';
import OneCarOrderScene from './OneCarOrderScene';
import PurchaseOrderScene from './PurchaseOrderScene';
import AssessTabBar from './component/AssessTabBar';
const IS_ANDROID = Platform.OS === 'android';

export default class AssessmentSelectScene extends BaseComponent{

    constructor(props){
        super(props);
        this.cName = this.props.navigation.state.params.name;
        this.merge_id = this.props.navigation.state.params.merge_id;
        this.state = {
            tabContent:[]
        };
    }

    initFinish = ()=>{
        this._getData();
    };

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    _showLoadingModal = ()=>{
        this.props.screenProps.showModal(true);
    };

    _closeLoadingModal = ()=>{
        this.props.screenProps.showModal(false);
    };

    _showHint = (hint) =>{
        this.props.screenProps.showToast(hint);
    };

    _toNextPage = (sceneName,sceneParam)=>{
        this.toNextPage(sceneName,sceneParam);
    };

    _getData = ()=> {
        let maps = {
            merge_id:this.merge_id,
        };

        this._showLoadingModal();
        Net.request(appUrls.USERGETPAYMENTCOUNT,'post',maps).then(
            (response)=>{
                this._closeLoadingModal();
                if (response.mycode === 1) {
                    let rep = response.mjson.retdata;
                    let tabs =[];
                    tabs.push(<StockBottomScene key={'0'}
                                                showHint={this._showHint}
                                                closeLoading={this._closeLoadingModal}
                                                showLoading={this._showLoadingModal}
                                                toNextPage={this._toNextPage}
                                                merge_id={this.merge_id} tabLabel='线下库融' />);
                    this.tabFlag = false;
                    if(rep.single !== '0'){
                        tabs.push(<OneCarOrderScene key={'1'}
                                                    name={this.cName}
                                                    showHint={this._showHint}
                                                    closeLoading={this._closeLoadingModal}
                                                    showLoading={this._showLoadingModal}
                                                    toNextPage={this._toNextPage}
                                                    merge_id={this.merge_id} tabLabel='单车融资' />);
                        this.tabFlag = true;
                    }
                    if(rep.inventory !== '0'){
                        tabs.push(<StockTopOrderScene key={'2'}
                                                      name={this.cName}
                                                      showHint={this._showHint}
                                                      closeLoading={this._closeLoadingModal}
                                                      showLoading={this._showLoadingModal}
                                                      toNextPage={this._toNextPage}
                                                      merge_id={this.merge_id} tabLabel='线上库融' />);
                        this.tabFlag = true;
                    }
                    if(rep.purcha !== '0'){
                        tabs.push(<PurchaseOrderScene key={'3'}
                                                      name={this.cName}
                                                      showHint={this._showHint}
                                                      closeLoading={this._closeLoadingModal}
                                                      showLoading={this._showLoadingModal}
                                                      toNextPage={this._toNextPage}
                                                      merge_id={this.merge_id} tabLabel='采购融资' />);
                        this.tabFlag = true;
                    }
                    this.setState({
                        tabContent:tabs
                    });
                }
            },
            (error)=>{
                this._closeLoadingModal();
                this._delayShowHint(error);
            });

    };

    _delayShowHint = (error) => {
        if(error.mycode === -300 || error.mycode === -500){
            if(IS_ANDROID === true){
                this.props.screenProps.showToast('网络请求失败');
            }else {
                this.timer = setTimeout(
                    () => { this.props.screenProps.showToast('网络请求失败'); },
                    500
                );
            }
        }else{
            if(IS_ANDROID === true){
                this.props.screenProps.showToast(error.mjson.retmsg);
            }else {
                this.timer = setTimeout(
                    () => { this.props.screenProps.showToast(error.mjson.retmsg); },
                    500
                );
            }
        }
    };

    renderTabBar =()=>{
        if(this.tabFlag === true){
            return <AssessTabBar />
        }else {
            return <View/>;
        }
    };

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <ScrollableTabView
                        renderTabBar={this.renderTabBar}>
                        {this.state.tabContent}
                    </ScrollableTabView>
                </View>
                <AllNavigationView title={this.cName} backIconClick={() => {
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
        backgroundColor: FontAndColor.all_background
    },
});