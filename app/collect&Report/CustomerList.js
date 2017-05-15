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
import {toutalPage} from './Component/MethodComponet'
import {CollectCustomerListItem,SeparatorComponent,ListFootComponentNorMore,ListFootComponentMore} from './Component/ListItemComponent'
import {commenStyle} from './Component/PageStyleSheet'
const  sourceControl ={
    currentPage :1,
    total:0,

}
export default  class CustomerList extends BaseComponent{
    // loadMoreState 0是可以加载更多，1是没了
   state = { data:[],loadMoreState:'0'};

    initFinish(){this._getCustonList()}

    _getCustonList=()=>{
        let maps = { p:sourceControl.currentPage};
        request(apis.CARREVGETUSERLIST, 'Post', maps)
            .then((response) => {

            let tempJson=response.mjson.retdata;


                sourceControl.total=toutalPage(tempJson.total,10);
                this.setState({
                    data:tempJson.list,
                    loadMoreState:sourceControl.total==sourceControl.currentPage?'1':'0'
                })

                },
                (error) => {

                });

    }
    _onEndReached=()=> {

        if(sourceControl.currentPage==sourceControl.total){
            this.props.screenProps.showToast('没有更多的数据');
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

    _customListItemClick=(itemId)=>{

        alert(itemId)
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

        return(
            <View style={commenStyle.testUI}>
                <CustomListSearch onPress={this._onSearchBarClick}/>
                <FlatList
                data={this.state.data}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                ListHeaderComponent={SeparatorComponent}
                ListFooterComponent={this.state.loadMoreState=='0'?ListFootComponentMore:ListFootComponentNorMore}
                onEndReached={this._onEndReached}
                />
            </View>
        )

    }




}