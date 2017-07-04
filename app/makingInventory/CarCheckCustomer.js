import React, {Component} from 'react';
import {
    AppRegistry,
    ListView,
    Text,
    View,
    StyleSheet,
    RefreshControl,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native';
import {CarCheckCustomerItem} from '../component/ComponentBlob'
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import  LoadMoreFooter from '../component/LoadMoreFooter';
import * as fontAndColor from '../constant/fontAndColor';
import  PixelUtil from '../utils/PixelUtil'
import AllNavigationView from '../component/AllNavigationView';
import SearchTitleView from '../component/SearchTitleView';
import * as FontAndColor from '../constant/fontAndColor';
var Pixel = new PixelUtil();
let page = 1;
let allPage = 1;
let allSouce = [];

export  default class CarCheckCustomer extends BaseComponent {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.keyword = ''
        this.retmsg = ''
        this.state = {
            dataSource: {},
            renderPlaceholderOnly: 'blank',
            isRefreshing: false,
        };
    }

    initFinish() {
        allSouce = []
        page = 1;
        this.props.screenProps.showModal(true);
        this.getData();
    }

    getData = () => {
        let maps = {
            pages: page,
            name: this.keyword,
        };
        request(Urls.CARCHECKUSER_GETBUSILIST, 'Post', maps)

            .then((response) => {
                    this.props.screenProps.showModal(false);
                    this.retmsg = response.mjson.retmsg;
                    if (page == 1 && response.mjson.retdata.busilist.length <= 0) {
                        this.props.screenProps.showToast('数据为空！');
                    } else {
                        allPage = response.mjson.retdata.listcount / 10;
                        allSouce.push(...response.mjson.retdata.busilist);
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(allSouce),
                            isRefreshing: false
                        });
                        this.setState({renderPlaceholderOnly: 'success'});
                    }
                },
                (error) => {
                    this.props.screenProps.showModal(false);
                    this.props.screenProps.showToast(error.mjson.retmsg);
                });
    }

    refreshingData = () => {
        allSouce = [];
        this.setState({isRefreshing: true});
        page = 1;
        this.getData();
    };

    toEnd = () => {
        if (this.state.isRefreshing) {

        } else {
            if (page < allPage) {
                page++;
                this.getData();
            }
        }

    };

    renderListFooter = () => {
        if (this.state.isRefreshing) {
            return null;
        } else {
            return (<LoadMoreFooter isLoadAll={page>=allPage?true:false}/>)
        }
    }

    textChange = (text) => {
        this.keyword = text;
    };

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (<View style={{backgroundColor: fontAndColor.COLORA3, flex: 1, paddingTop: Pixel.getPixel(15)}}>
                <AllNavigationView title={'客户列表'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>);
        } else {

            return (
                <View style={styles.container}>
                    <View style={styles.topStyle}>
                        <Text style={{flex: 1, textAlign:'center'}}>{this.retmsg}</Text>
                    </View>
                    <SearchTitleView hint={'客户姓名关键字'} onSearchClick={this.searchData}/>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        enableEmptySections = {true}
                        renderFooter={
                            this.renderListFooter
                        }
                        onEndReached={this.toEnd}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.refreshingData}
                                tintColor={[fontAndColor.COLORB0]}
                                colors={[fontAndColor.COLORB0]}
                            />
                        }
                    />

                    <AllNavigationView title={'客户列表'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>

                </View>
            );
        }
    }

    searchData = (text) => {
        allSouce = []
        page = 1;
        this.props.screenProps.showModal(true);
        this.keyword = text;
        this.getData();
    }

    renderRow = (rowData, sectionID, rowId) => {
        //customerName, carNum, onPress
        return (
            <CarCheckCustomerItem
                onPress={()=>{
                    this.toNextPage('CarCheckWifiSelect',{
                    name: rowData.name,
                    merge_id: rowData.busino
                });}}
                customerName={rowData.name}
                carNum={rowData.wpkCount}
            />);

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: FontAndColor.all_background,
    },
    topStyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 5,
        marginTop: Pixel.getTitlePixel(68),
    },
});