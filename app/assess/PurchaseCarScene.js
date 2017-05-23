/**
 * Created by Administrator on 2017/5/18.
 */
import React from 'react';
import {
    View,
    StyleSheet,
    ListView,
    RefreshControl
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as FontAndColor from '../constant/fontAndColor';
import SearchTitleView from '../component/SearchTitleView';
import * as Net from '../utils/RequestUtil';
import * as appUrls from '../constant/appUrls';

import PurchaseCarItem from './component/PurchaseCarItem'

import AddNewCarBottom from './component/AddNewCarBottom';
import PurchaseTitleItem from './component/PurchaseTitleItem';


export default class PurchaseCarScene extends BaseComponent{

    constructor(props){
        super(props);

        this.payment_id = this.props.navigation.state.params.payment_id;
        this.cName = this.props.navigation.state.params.name;
        this.page = 1;
        this.total = 0;
        this.frame_number = '';
        this.allSource = [];
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state= {
            loading: false,
            dataSource: this.ds.cloneWithRows(this.allSource),
            waitPrice:'采购贷待评估车辆金额：'
        };
    }

    initFinish = ()=>{
        this._showLoadingModal();
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

    _renderItem = (item)=>{
        return(<PurchaseCarItem item={item} />)
    };

    _onEndReached = ()=>{

        if(!this.state.loading && this.allSource.length>0 && this.page !== this.total){
            if (this.page < this.total) {
                this.page++;
                this._getData();
                this._showHint("加载中......");
            } else {
                this._showHint("没有更多数据");
            }
        }
    };

    _onRefresh = ()=>{

        console.log('下拉刷新');
        this.page = 1;
        this.total = 0;
        this.frame_number = '';
        this.allSource = [];
        this.setState({
            loading:true
        },()=>{
            this._getData();
        });

    };

    _getData = ()=>{
        console.log('请求数据');
        let maps = {
            p:this.page,
            frame_number:this.frame_number,
            payment_id:this.payment_id
        };

        Net.request(appUrls.PURCHAAUTOLIST,'post',maps).then(
            (response)=>{
                this._closeLoadingModal();

                let rep = response.mjson.retdata;
                this.total = Math.ceil(Number.parseInt(rep.total)/Number.parseInt(rep.listRows));

                this.allSource.push(...rep.list);
                this.setState({
                    dataSource:this.ds.cloneWithRows(this.allSource),
                    loading:false,
                    waitPrice:'采购贷待评估车辆金额：' + rep.wait_mny_str
                });

                console.log('response data',{rep});
                console.log('response total',this.total);
            },
            (error)=>{
                this._closeLoadingModal();
                this.setState({
                    loading:false
                });
            });

    };

    _onSearchClick=(searchValue)=>{
        console.log('搜索');
        this.page = 1;
        this.total = 0;
        this.frame_number = searchValue;
        this.allSource = [];
        this._showLoadingModal();
        this._getData();
    };

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <PurchaseTitleItem
                        payment_number={this.props.navigation.state.params.payment_number}
                        jkje={this.props.navigation.state.params.loanmnystr}
                        yksj={this.props.navigation.state.params.makedatestr}
                    />
                    <SearchTitleView hint={'车架号后六位'} onSearchClick={this._onSearchClick}/>
                    <View style={styles.fillSpace}>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this._renderItem}
                            onEndReached={this._onEndReached}
                            onEndReachedThreshold={1}
                            enableEmptySections={true}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.loading}
                                    onRefresh={this._onRefresh}
                                    tintColor={[FontAndColor.COLORB0]}
                                    colors={[FontAndColor.COLORB0]}
                                />
                            }
                        />
                    </View>
                    <AddNewCarBottom waitPrice={this.state.waitPrice}
                                     onAddClick={()=>{}} addEnable={false}/>
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
    fillSpace:{
        flex:1
    }
});
