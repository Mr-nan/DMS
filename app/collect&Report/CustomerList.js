/**
 * Created by lcus on 2017/5/10.
 */

import React, {Component} from 'react';
import {
    View,
    FlatList,
} from 'react-native';
import BaseComponent from '../component/BaseComponent'
import  {CustomListSearch} from './Component/SearchBarBlobs'
import * as apis from '../constant/appUrls'
import  {request} from '../utils/RequestUtil'
import {toutalPage,STATECODE} from './Component/MethodComponet'
import {CollectCustomerListItem,SeparatorComponent,ListFootComponentNorMore,ListFootComponentMore} from './Component/ListItemComponent'
import {commenStyle} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';
const  sourceControl ={
    currentPage :1,
    total:0,
}
export default  class CustomerList extends BaseComponent{
    // loadMoreState 0是可以加载更多，1是没了
   state = {
       data:[],
       loadMoreState:'0',
       refreshing:false,
       renderPlaceholderOnly:STATECODE.loading
   };

    initFinish(){this._getCustonList()}

    componentWillUnmount() {
        sourceControl.currentPage=1;
        sourceControl.total=0;
    }
    _getCustonList=()=>{

        let maps = { p:sourceControl.currentPage};
        request(apis.CARREVGETUSERLIST, 'Post', maps)
            .then((response) => {

            let tempJson=response.mjson.retdata;


                sourceControl.total=toutalPage(tempJson.total,10);
                this.setState({
                    data:tempJson.list,
                    loadMoreState:sourceControl.total==sourceControl.currentPage?'1':'0',
                    renderPlaceholderOnly:STATECODE.loadSuccess,
                    refreshing:false
                })
                },
                (error) => {

                });

    }
    _onEndReached=()=> {

        if(sourceControl.currentPage==sourceControl.total){
            // this.props.screenProps.showToast('全部数据已加载');
        }
        else {
          sourceControl.currentPage=sourceControl.currentPage + 1;

            let maps = {p: sourceControl.currentPage };

            request(apis.CARREVGETUSERLIST, 'Post', maps)
                .then((response) => {

                        let tempJson=response.mjson.retdata;

                        this.setState({
                            data:this.state.data.concat(tempJson.list),
                            loadMoreState:sourceControl.total==sourceControl.currentPage?'1':'0'
                        })
                    },
                    (error) => {

                    });
        }


    }

    _onRefresh=()=>{

        console.log('刷新')
        this.setState({
            refreshing:true
        })
        sourceControl.currentPage=1;

        this._getCustonList();


    }


    _customListItemClick=(itemId,itemName,carNum)=>{

        let tempCarNUm =Number.parseInt(carNum);
        if(tempCarNUm>0){
            this.toNextPage('CustomerItemCarList',{merge_id:itemId,title:itemName})
        }else {
            this.props.screenProps.showToast('没有待处理车辆');
        }
    }

    _onSearchBarClick=(searchValue)=>{

        alert(searchValue)
    }

    _renderItem =(data)=>{

        return(
            <CollectCustomerListItem
                legalcompany={data.item.name}
                carNum={data.item.unrgnum+'辆'}
                merge_id={data.item.merge_id}
                customListItemClick={this._customListItemClick}
            />
        )
    }

    _keyExtractor = (item, index) => item.merge_id;
    render(){
        if(this.state.renderPlaceholderOnly!==STATECODE.loadSuccess){
            return( <View style={commenStyle.commenPage}>
                <AllNavigationView title={'客户列表'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>);
        }
        return(

            <View style={commenStyle.commenPage}>

                <View style={commenStyle.testUI}>
                    <CustomListSearch onPress={this._onSearchBarClick} placehoder='客户姓名关键字'/>
                    <FlatList
                        style={{flex:1}}
                        data={this.state.data}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        onEndReached={this._onEndReached}
                        onEndReachedThreshold={0.5}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
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