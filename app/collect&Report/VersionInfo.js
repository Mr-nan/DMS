/**
 * Created by lcus on 2017/5/10.
 */

import React, {Component} from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text
} from 'react-native';
import BaseComponent from '../component/BaseComponent'
import * as apis from '../constant/appUrls'
import  {request} from '../utils/RequestUtil'
import {STATECODE} from './Component/MethodComponet'
import {commenStyle} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';

export default class VersionInfo extends BaseComponent{


    state = {
        data:[],
        renderPlaceholderOnly:STATECODE.loading
    };


    _dateReversal=(time)=>{

        let date = new Date();
        date.setTime(time);
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        return (Y+M+D);

    };
    _genData=(data)=>{
   return [{title:'当前版本:',value:data.versionName},
       {title:'创建时间:',value:this._dateReversal(data.create_time*1000)},
       {title:'新增版本内容',value:data.updateLog}]
    }



    initFinish(){

        let maps = { type:'5'};
        request(apis.APPUPDATE, 'Post', maps)
            .then((response) => {

                    let tempJson=response.mjson.retdata;

                    this.setState({
                        data:this._genData(tempJson),
                        renderPlaceholderOnly:STATECODE.loadSuccess
                    })

                },
                (error) => {

                });

    }


    _renderItem=(data)=>{

        return (
            <View style={data.index==2?styles.versionInfo2:styles.versionInfo1}>
                <Text >{data.item.title}</Text>
                <Text style={[styles.textColor,data.index==2?{marginTop:10}:null]}>{data.item.value}</Text>
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
                        keyExtractor={(item, index) => index}
                    />

                </View>

                <AllNavigationView title={'关于版本'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>
        )
    }
}
const styles =StyleSheet.create({

    versionInfo1:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'white',
        marginBottom:10,
        padding:10,
        marginTop:10
    },
    versionInfo2:{
        backgroundColor:'white',
        padding:10,
        paddingBottom:4,
    },
    textColor:{
        color:'gray'
    }



})



