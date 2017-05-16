/**
 * Created by lcus on 2017/5/10.
 */

import React, {Component} from 'react';
import {
    View,
    FlatList,
    StyleSheet
} from 'react-native';
import BaseComponent from '../component/BaseComponent'
import  {CustomListSearch} from './Component/SearchBarBlobs'
import * as apis from '../constant/appUrls'
import  {request} from '../utils/RequestUtil'
import {toutalPage,STATECODE} from './Component/MethodComponet'
import {CollectCustomerListItem,SeparatorComponent,ListFootComponentNorMore,ListFootComponentMore} from './Component/ListItemComponent'
import {commenStyle} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';

export default class VersionInfo extends BaseComponent{


    state = {
        data:[],
        renderPlaceholderOnly:STATECODE.loading
    };

    _genData=(data)=>{


    }



    initFinish(){

        let maps = { type:'5'};
        request(apis.APPUPDATE, 'Post', maps)
            .then((response) => {

                    let tempJson=response.mjson.retdata;
                    sourceControl.total=toutalPage(tempJson.total,10);
                    this.setState({
                        data:tempJson.list,

                        refreshing:false
                    })
                    console.log('加载完成');
                },
                (error) => {

                });

    }


    _renderItem=(data)=>{

        return (
            <View>
                <Text>{data.item.title}</Text>
                <Text>{data.item.value}</Text>
            </View>
        )

    }

    render(){

        return (
            <View style={commenStyle.commenPage}>
                <View style={commenStyle.testUI}>
                    <FlatList
                        data={this.state.data}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) =>index}
                    />

                </View>

                <AllNavigationView title={'关于版本'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>
        )
    }





}