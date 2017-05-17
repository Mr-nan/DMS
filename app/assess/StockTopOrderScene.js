/**
 * Created by Administrator on 2017/5/17.
 */
import React from 'react';
import {
    View,
    StyleSheet,
    ListView,
    RefreshControl
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as FontAndColor from '../constant/fontAndColor';
import SearchTitleView from '../component/SearchTitleView';
import * as Net from '../utils/RequestUtil';
import * as appUrls from '../constant/appUrls';

import OrderItem from './component/OrderItem';


export default class StockTopOrderScene extends BaseComponent{

    constructor(props){
        super(props);

        this.merge_id = this.props.merge_id;
        this.page = 1;
        this.total = 0;
        this.payment_number = '';
        this.allSource = [];
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state= {
            loading: false,
            dataSource: this.ds.cloneWithRows(this.allSource),
        };
    }

    initFinish = ()=>{
        this._showLoadingModal();
        this._getData();
    };

    _showLoadingModal = ()=>{
        this.props.showLoading();
    };

    _closeLoadingModal = ()=>{
        this.props.closeLoading();
    };

    _showHint = (hint) =>{
        this.props.showHint(hint);
    };

    _renderItem = (item)=>{
        return(<OrderItem item={item} />)
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
        this.payment_number = '';
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
            payment_number:this.payment_number,
            merge_id:this.merge_id
        };

        Net.request(appUrls.INVENTORYFINANCINGLOANLIST,'post',maps).then(
            (response)=>{
                this._closeLoadingModal();

                let rep = response.mjson.retdata;
                this.total = Math.ceil(Number.parseInt(rep.total)/Number.parseInt(rep.listRows));

                this.allSource.push(...rep.list);
                this.setState({
                    dataSource:this.ds.cloneWithRows(this.allSource),
                    loading:false
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
        this.frame = searchValue;
        this.allSource = [];
        this._showLoadingModal();
        this._getData();
    };


    render(){
        return(
            <View style={styles.container}>
                <SearchTitleView hint={'订单号'} onSearchClick={this._onSearchClick}/>
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:FontAndColor.all_background,
    },
    fillSpace:{
        flex:1
    }
});