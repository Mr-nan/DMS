/**
 * Created by Administrator on 2017/5/15.
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

import CustomerItem from './component/CustomerItem';

export default class AssessCustomerScene extends BaseComponent{

    constructor(props){
        super(props);

        this.page = 1;
        this.total = 0;
        this.name = '';
        this.allSource = [];
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state= {
            loading: false,
            customers: this.ds.cloneWithRows(this.allSource)
        };

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

    initFinish = ()=>{
        this._showLoadingModal();
        this._getData();
    };

    _onSearchClick=(searchValue)=>{
        console.log('搜索');
        this.page = 1;
        this.total = 0;
        this.name = searchValue;
        this.allSource = [];
        this._showLoadingModal();
        this._getData();
    };

    _renderItem = (item)=>{
        return(<CustomerItem item={item} onItemClick={this._onItemClick}/>)
    };

    _onItemClick = (name,merge_id)=>{
        this.toNextPage('AssessmentSelectScene',{name:name,merge_id:merge_id})
    };

    _onRefresh = ()=>{

        console.log('下拉刷新');
        this.page = 1;
        this.total = 0;
        this.name = '';
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
            name:this.name
        };

        Net.request(appUrls.USERCUSTOMERLIST,'post',maps).then(
            (response)=>{
                this._closeLoadingModal();

                let rep = response.mjson.retdata;
                this.total = Math.ceil(Number.parseInt(rep.total)/Number.parseInt(rep.listRows));

                this.allSource.push(...rep.list);
                this.setState({
                    customers:this.ds.cloneWithRows(this.allSource),
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

    render(){

        return(
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <SearchTitleView hint={'客户姓名关键字'} onSearchClick={this._onSearchClick}/>
                    <ListView
                        dataSource={this.state.customers}
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
                <AllNavigationView title={'客户列表'} backIconClick={() => {
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
        backgroundColor: FontAndColor.all_background,
        alignItems: 'center'
    },
});