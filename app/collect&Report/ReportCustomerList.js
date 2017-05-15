/**
 * Created by lcus on 2017/5/10.
 */
import React, {Component} from 'react';
import {
    View,
    FlatList,
} from 'react-native';
import BaseComponent from '../component/BaseComponent'
import  {RepListSearch} from './Component/SearchBarBlobs'
import * as apis from '../constant/appUrls'
import  {request} from '../utils/RequestUtil'
import {toutalPage,STATECODE} from './Component/MethodComponet'
import {ReportCustomerListItem,SeparatorComponent,ListFootComponentNorMore,ListFootComponentMore} from './Component/ListItemComponent'
import {commenStyle} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';

const  pageControl ={
    currentPage :1,
    total:0,
}
export  default class ReportCustomerList extends BaseComponent{


    state = {
        data:[],
        loadMoreState:'0',
        renderPlaceholderOnly:STATECODE.loading
    };


    initFinish(){

        this._getRepoCustomList();
    }

    _getRepoCustomList=()=>{

        let maps = {
            month:'201705',
            pageNo:pageControl.currentPage,
        };
        request(apis.PATROLEVALGETMERGELIST, 'Post', maps)
            .then((response) => {

                    let tempJson=response.mjson.retdata;


                    pageControl.total=toutalPage(tempJson.total,10);
                    this.setState({
                        data:tempJson.busilist,
                        loadMoreState:pageControl.total==pageControl.currentPage?'1':'0',
                        renderPlaceholderOnly:STATECODE.loadSuccess
                    })
                },
                (error) => {

                });


    }
    _getOrderState=(state)=>{

        let temp =Number(state);
        switch (temp){
            case -1:
                return '未提交';
                break;
            case 0:
                return '暂存';
                break;
            case 1:
                return '已提交';
                break;
            case 2:
                return '退回';
                break;

        }


    }
    _renderItem=(data)=>{
        return (<ReportCustomerListItem
            companyName ={data.item.name}
            money={'未结清借款 ：'+data.item.loanBalance+'万元'}
            merge_id={data.item.merge_id}
            state={this._getOrderState(data.item.reportStstus)}
        />)

    }


    render(){

        return (

        <View style={commenStyle.commenPage}>
            <View style={commenStyle.testUI}>
                <RepListSearch timeButtonClick={()=>{alert('点击了时间')}} onPress={(searchVale)=>{alert(searchVale)}}/>
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.merge_id}
                    // onEndReached={this._onEndReached}
                    // onEndReachedThreshold={0}
                    // refreshing={false}
                    // onRefresh={this._onRefresh}
                    ListFooterComponent={this.state.loadMoreState=='0'?ListFootComponentMore:ListFootComponentNorMore}
                />

            </View>
            <AllNavigationView title={'客户列表'} backIconClick={() => {
                this.backPage();
            }} parentNavigation={this}/>
        </View>


        )

    }




}