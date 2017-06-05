/**
 * Created by Administrator on 2017/5/17.
 */
import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    ListView,
    Platform,
    RefreshControl
}from 'react-native';

import * as FontAndColor from '../constant/fontAndColor';
import SearchTitleView from '../component/SearchTitleView';
import * as Net from '../utils/RequestUtil';
import * as appUrls from '../constant/appUrls';

import OrderItem from './component/OrderItem';
import LoadMoreFooter from '../component/LoadMoreFooter';
const IS_ANDROID = Platform.OS === 'android';


export default class PurchaseOrderScene extends Component{

    constructor(props){
        super(props);

        this.merge_id = this.props.merge_id;
        this.page = 1;
        this.total = 0;
        this.payment_number = '';
        this.allSource = [];
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state= {
            loading: false,
            dataSource: this.ds.cloneWithRows(this.allSource),
            isFirst:true
        };
    }

    componentDidMount(){
        this._showLoadingModal();
        this._getData();
    };

    _showLoadingModal = ()=>{
        this.props.showLoading();
    };

    _closeLoadingModal = ()=>{
        this.props.closeLoading();
    };

    _showHint = (hint) =>{
        this.props.showHint(hint);
    };

    _renderItem = (item)=>{
        return(<OrderItem item={item} onItemClick={this._onItemClick}/>)
    };

    _onItemClick = (item) =>{

        this.props.toNextPage('PurchaseCarScene',{
            name:this.cName,
            merge_id:this.merge_id,
            payment_id:item.payment_id,
            payment_number:item.payment_number,
            loanmnystr:item.loanmnystr,
            makedatestr:item.makedatestr,
            loanmny:item.loanmny
        });
    };

    _onEndReached = ()=>{

        if(!this.state.loading && this.allSource.length>0 &&  this.page < this.total){
            this.page++;
            this._getData();
        }
    };

    _onRefresh = ()=>{

        console.log('下拉刷新');
        this.page = 1;
        this.total = 0;
        this.payment_number = '';
        this.allSource = [];
        this.setState({
            loading:true
        },()=>{
            this._getData();
        });

    };

    _getData = ()=>{
        let maps = {
            p:this.page,
            payment_number:this.payment_number,
            merge_id:this.merge_id
        };

        Net.request(appUrls.PURCHA_PAYMENTLIST,'post',maps).then(
            (response)=>{
                this._closeLoadingModal();
                if(response.mycode === 1){
                    let rep = response.mjson.retdata;
                    this.total = Math.ceil(Number.parseInt(rep.total)/Number.parseInt(rep.listRows));

                    this.allSource.push(...rep.list);
                    this.setState({
                        dataSource:this.ds.cloneWithRows(this.allSource),
                        loading:false,
                        isFirst:false
                    });
                }
            },
            (error)=>{
                this._closeLoadingModal();
                this.setState({
                    loading:false
                });
                this._delayShowHint(error);
            });

    };

    _delayShowHint = (error) => {
        if(error.mycode === -300 || error.mycode === -500){
            if(IS_ANDROID === true){
                this.props.showHint('网络请求失败');
            }else {
                this.timer = setTimeout(
                    () => { this.props.showHint('网络请求失败'); },
                    500
                );
            }
        }else{
            if(IS_ANDROID === true){
                this.props.showHint(error.mjson.retmsg);
            }else {
                this.timer = setTimeout(
                    () => {this.props.showHint(error.mjson.retmsg); },
                    500
                );
            }
        }
    };

    componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
    }

    _onSearchClick=(searchValue)=>{
        console.log('搜索');
        this.page = 1;
        this.total = 0;
        this.frame = searchValue;
        this.allSource = [];
        this._showLoadingModal();
        this._getData();
    };

    renderListFooter = () => {
        if (this.state.isFirst) {
            return null;
        } else {
            return (<LoadMoreFooter isLoadAll={this.page >= this.total ? true : false}/>)
        }
    };

    render(){
        return(
            <View style={styles.container}>
                <SearchTitleView hint={'订单号'} onSearchClick={this._onSearchClick}/>
                <View style={styles.fillSpace}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderItem}
                        onEndReached={this._onEndReached}
                        onEndReachedThreshold={1}
                        enableEmptySections={true}
                        renderFooter={this.renderListFooter}
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:FontAndColor.all_background,
    },
    fillSpace:{
        flex:1
    }
});