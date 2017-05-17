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
import {toutalPage,STATECODE,dateFormat} from './Component/MethodComponet'
import {ReportCustomerListItem,SeparatorComponent,ListFootComponentNorMore,ListFootComponentMore} from './Component/ListItemComponent'
import {commenStyle} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';
import DateTimePicker from 'react-native-modal-datetime-picker'
const  pageControl ={
    currentPage :1,
    total:0,
    month:''
}
export  default class ReportCustomerList extends BaseComponent{


    state = {
        data:[],
        loadMoreState:'0',
        renderPlaceholderOnly:STATECODE.loading,
        refreshing:false,
        isDateTimePickerVisible: false,
    };

    componentWillMount() {
        let date =new Date();
        pageControl.month=dateFormat(date,'yyyyMM');
    }
    componentWillUnmount() {
        pageControl.currentPage=1;
        pageControl.total=0;
    }

    initFinish(){

        this._getRepoCustomList();
    }

    _getRepoCustomList=()=>{

        let maps = {
            month:pageControl.month,
            pageNo:pageControl.currentPage,
        };
        request(apis.PATROLEVALGETMERGELIST, 'Post', maps)
            .then((response) => {

                    let tempJson=response.mjson.retdata;


                    pageControl.total=toutalPage(tempJson.listcount,10);
                    this.setState({
                        data:tempJson.busilist,
                        loadMoreState:pageControl.total==pageControl.currentPage?'1':'0',
                        renderPlaceholderOnly:STATECODE.loadSuccess,
                        refreshing:false,
                    })
                },
                (error) => {

                });

    }

    _handleDatePicked=(date)=>{

        this.searchBar._setTimeValue(dateFormat(date,'yyyy-MM'))
        pageControl.month=dateFormat(date,'yyyyMM')
        this.setState({
            isDateTimePickerVisible:false
        })
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
    _onEndReached=()=>{

        if(pageControl.currentPage==pageControl.total){

        }
        else {
            pageControl.currentPage=pageControl.currentPage + 1;

            let maps = {pageNo: pageControl.currentPage , month:pageControl.month};

            request(apis.PATROLEVALGETMERGELIST, 'Post', maps)
                .then((response) => {

                        let tempJson=response.mjson.retdata;

                        this.setState({
                            data:this.state.data.concat(tempJson.busilist),
                            loadMoreState:pageControl.total==pageControl.currentPage?'1':'0'
                        })
                    },
                    (error) => {

                    });
        }

    }

    _repCustomItemClick=(merge_id,companyName,money)=>{

        this.toNextPage('ReportInfoManage',{merge_id:merge_id,title:companyName,money:money,month:pageControl.month})
    }

    _onRefresh=()=>{

        this.setState({
            refreshing:true
        })
        pageControl.currentPage=1;

        this._getRepoCustomList();
    }
    _renderItem=(data)=>{
        return (<ReportCustomerListItem
            companyName ={data.item.name}
            money={'未结清借款 ：'+data.item.loanBalance+'万元'}
            merge_id={data.item.merge_id}
            state={this._getOrderState(data.item.reportStstus)}
            repCustomItemClick={this._repCustomItemClick}
        />)

    }
    _getFootHeader=(state)=>{
        if (state=='0'){

            return ListFootComponentMore
        }
        return ListFootComponentNorMore;

    }



    render(){

        let foot =this._getFootHeader(this.state.loadMoreState);
        return (

        <View style={commenStyle.commenPage}>
            <View style={commenStyle.testUI}>
                <RepListSearch ref={(sear)=>{this.searchBar=sear}} timeButtonClick={()=>{this.setState({isDateTimePickerVisible:true})}} onPress={(searchVale)=>{alert(searchVale)}}/>
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.merge_id}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={0.5}
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                    ListFooterComponent={foot}
                />

            </View>
            <AllNavigationView title={'客户列表'} backIconClick={() => {
                this.backPage();
            }} parentNavigation={this}/>
            <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                titleIOS="请选择日期"
                confirmTextIOS='确定'
                cancelTextIOS='取消'
                minimumDate= {new Date()}
            />
        </View>


        )

    }




}