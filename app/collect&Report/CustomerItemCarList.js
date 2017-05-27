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
import {CollectCarListItem,ListFootComponent} from './Component/ListItemComponent'
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
        refreshing:false,
        renderPlaceholderOnly:STATECODE.loading
    };
    componentWillUnmount() {
        pageControl.currentPage=1;
        pageControl.total=0;
    }

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
                        renderPlaceholderOnly:STATECODE.loadSuccess,
                        refreshing:false,
                    })
                },
                (error) => {

                });
    }


    _carItemClick=(carFrameNumber)=>{


        this.toNextPage('CollectCarInfo',{carFrameNumber:carFrameNumber})

    }
    _onEndReached=()=>{

        if(pageControl.currentPage==pageControl.total){

        }
        else {
            pageControl.currentPage=pageControl.currentPage + 1;

            let maps = {p: pageControl.currentPage };

            request(apis.CARREVGETREVLIST, 'Post', maps)
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
        this.setState({
            refreshing:true
        })
        pageControl.currentPage=1;

        this._getCarList();

    }

    _renderItem =(data)=>{
        return(
            <CollectCarListItem
                carFrameNumber={data.item.vin}
                carType={data.item.brand_name}
                carDetailType={data.item.model_name}
                place={'监管地 : '+data.item.storge}
                base_id={data.item.base_id}
                type={data.item.type}
                carListItemClick={this._carItemClick}
            />
        )
    }
    _renderFootComponent=()=>{

        if(this.state.renderPlaceholderOnly==STATECODE.loading){

            return (<ListFootComponent info="正在加载..."/>)
        }
        if (this.state.loadMoreState=='0'){

            return (<ListFootComponent info='加载更多...'/>)
        }
        return (<ListFootComponent info='已加载全部数据'/>)
    }

    render(){

    return(
        <View style={commenStyle.commenPage}>
           <View style={commenStyle.testUI}>
            <CustomListSearch placehoder="车架号后6位"/>
               <FlatList
                   style={{flex:1}}
                   data={this.state.data}
                   renderItem={this._renderItem}
                   keyExtractor={(item, index) => item.vin}
                   onEndReached={this._onEndReached}
                   onEndReachedThreshold={0.5}
                   refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                   ListFooterComponent={this._renderFootComponent}
               />

           </View>
            <AllNavigationView title={this.props.navigation.state.params.title} backIconClick={() => {
                this.backPage();
            }} parentNavigation={this}/>
        </View>
    )}






}