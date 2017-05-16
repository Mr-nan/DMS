/**
 * Created by Administrator on 2017/5/15.
 */
import React from 'react';
import {
    View,
    StyleSheet,
    FlatList
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
        this.customers=[];
        this.page = 1;
        this.total = 0;
        this.name = '';
        this.state={
            loading:false
        }
    }

    initFinish = ()=>{
        this._getData();
    };

    _onSearchClick=(searchValue)=>{

    };

    _renderItem = ({item})=>{
        return(<CustomerItem item={item} />)
    };

    _keyExtractor = (item, index) => index;

    _onRefresh = ()=>{
        console.log('下拉刷新');
        this.setState({
            loading:true
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
                let rep = response.mjson.retdata;
                this.total = Math.ceil(Number.parseInt(rep.total)/Number.parseInt(rep.listRows));

                console.log('response data',{rep});
                console.log('response total',this.total);
            },
            (error)=>{

            });

    };

    render(){
        console.log('++++1111111111');
        return(
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <SearchTitleView hint={'客户姓名关键字'} onSearchClick={()=>{}}/>
                    <FlatList
                        ref={(flat)=>{this.flatList = flat}}
                        data={this.funcs}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        refreshing={this.state.loading}
                        onRefresh={this._onRefresh}
                    />
                </View>
                <AllNavigationView title={'第1车贷'} backIconClick={() => {
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