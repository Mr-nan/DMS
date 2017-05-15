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
import {CollectCarListItem,SeparatorComponent,ListFootComponentNorMore,ListFootComponentMore} from './Component/ListItemComponent'
import {commenStyle} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';

const  pageControl ={
    currentPage :1,
    total:0,
}
export  default class CustomerItemCarList extends BaseComponent{

    state = {
        data:[],
        loadMoreState:'0',
        renderPlaceholderOnly:STATECODE.loading
    };

    initFinish(){this._getCarList()}

    _getCarList=()=>{

        let maps = {
            p:pageControl.currentPage,
            merge_id:this.props.navigation.state.params.merge_id
        };
        request(apis.CARREVGETREVLIST, 'Post', maps)
            .then((response) => {

                    let tempJson=response.mjson.retdata;


                    pageControl.total=toutalPage(tempJson.total,10);
                    this.setState({
                        data:tempJson.list,
                        loadMoreState:pageControl.total==pageControl.currentPage?'1':'0',
                        renderPlaceholderOnly:STATECODE.loadSuccess
                    })
                },
                (error) => {

                });
    }


    _carItemClick=()=>{


    }

    _renderItem =(data)=>{
        //carType,carDetailType,carFrameNumber,place
        return(
            <CollectCarListItem
                carFrameNumber={'车架号 ：'+data.item.vin}
                carType={data.item.brand_name}
                carDetailType={data.item.model_name}
                place={'监管地 : '+data.item.storge}
                base_id={data.item.base_id}
                type={data.item.type}
                carListItemClick={()=>{this._carItemClick()}}
            />
        )
    }


    render(){

    return(
        <View style={commenStyle.commenPage}>
           <View style={commenStyle.testUI}>
            <CustomListSearch placehoder="车架号后6位"/>
               <FlatList
                   data={this.state.data}
                   renderItem={this._renderItem}
                   keyExtractor={(item, index) => item.vin}
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
    )}






}