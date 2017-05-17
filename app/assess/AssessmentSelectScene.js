/**
 * Created by Administrator on 2017/5/17.
 */
import React from 'react';
import {
    View,
    StyleSheet
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

    _showLoadingModal = ()=>{
        this.props.screenProps.showModal(true);
    };

    _closeLoadingModal = ()=>{
        this.props.screenProps.showModal(false);
    };

    _showHint = (hint) =>{
        this.props.screenProps.showToast(hint);
    };

    _getData = ()=> {
        let maps = {
            merge_id:this.merge_id,
        };

        Net.request(appUrls.USERGETPAYMENTCOUNT,'post',maps).then(
            (response)=>{
                let rep = response.mjson.retdata;
                let tabs =[];
                tabs.push(<StockBottomScene key={'0'}
                                            showHint={this._showHint}
                                            closeLoading={this._closeLoadingModal}
                                            showLoading={this._showLoadingModal}
                                            merge_id={this.merge_id} tabLabel='线下库容' />);
                this.tabFlag = false;
                if(rep.single !== '0'){
                    tabs.push(<OneCarOrderScene key={'1'}
                                                showHint={this._showHint}
                                                closeLoading={this._closeLoadingModal}
                                                showLoading={this._showLoadingModal}
                                                merge_id={this.merge_id} tabLabel='单车融资' />);
                    this.tabFlag = true;
                }
                if(rep.inventory !== '0'){
                    tabs.push(<StockTopOrderScene key={'2'}
                                                  showHint={this._showHint}
                                                  closeLoading={this._closeLoadingModal}
                                                  showLoading={this._showLoadingModal}
                                                  merge_id={this.merge_id} tabLabel='线上库容' />);
                    this.tabFlag = true;
                }
                if(rep.purcha !== '0'){
                    tabs.push(<PurchaseOrderScene key={'3'}
                                                  showHint={this._showHint}
                                                  closeLoading={this._closeLoadingModal}
                                                  showLoading={this._showLoadingModal}
                                                  merge_id={this.merge_id} tabLabel='采购融资' />);
                    this.tabFlag = true;
                }
                this.setState({
                    tabContent:tabs
                });
            },
            (error)=>{
                this.props.screenProps.showToast('网络请求失败');
            });

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