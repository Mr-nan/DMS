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

import BottomStockItem from './component/BottomStockItem'

import AddNewCarBottom from './component/AddNewCarBottom';


export default class StockBottomScene extends BaseComponent{

    constructor(props){
        super(props);

        this.merge_id = this.props.merge_id;
        this.page = 1;
        this.total = 0;
        this.frame = '';
        this.allSource = [];
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state= {
            loading: false,
            dataSource: this.ds.cloneWithRows(this.allSource),
            waitPrice:'待评估车辆金额：'
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
        return(<BottomStockItem item={item} />)
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
        this.frame = '';
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
            frame:this.frame,
            merge_id:this.merge_id
        };

        Net.request(appUrls.INVENTORYFINANCINGGETAUTOLIST,'post',maps).then(
            (response)=>{
                this._closeLoadingModal();

                let rep = response.mjson.retdata;
                this.total = Math.ceil(Number.parseInt(rep.total)/Number.parseInt(rep.listRows));

                this.allSource.push(...rep.list);
                this.setState({
                    dataSource:this.ds.cloneWithRows(this.allSource),
                    loading:false,
                    waitPrice:'待评估车辆金额：' + rep.wait_mny_str
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
                <AddNewCarBottom waitPrice={this.state.waitPrice} onAddClick={()=>{}}/>
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