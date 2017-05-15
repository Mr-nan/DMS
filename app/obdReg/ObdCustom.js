import React, {Component} from 'react';
import {AppRegistry, ListView, Text, View,StyleSheet,RefreshControl} from 'react-native';
import {ObdCustomItem, ObdCarItem, ObdCarDetailTable} from '../component/ComponentBlob'
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import  LoadMoreFooter from '../component/LoadMoreFooter';
import * as fontAndColor from '../constant/fontAndColor';
import  PixelUtil from '../utils/PixelUtil'
import AllNavigationView from '../component/AllNavigationView';
var Pixel = new PixelUtil();
let page = 1;
let allPage = 1;
let allSouce = [];

export  default class ObdCustom extends BaseComponent {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            renderPlaceholderOnly: 'blank',
            isRefreshing: false
        };
    }

    initFinish() {
        allSouce=[]
        page=1;
        allPage=1;
        this.props.screenProps.showModal(true);
        this.getData();
    }

    getData = () => {
        let maps = {
            p: page,
            r: 10,
        };
        request(Urls.OBD_CUSTOMER_LIST, 'Post', maps)

            .then((response) => {
                    this.props.screenProps.showModal(false);
                    if (page == 1 && response.mjson.retdata.list.length <= 0) {
                        this.props.screenProps.showToast('数据为空！');
                    } else {
                        allPage = response.mjson.retdata.total / 10;
                        allSouce.push(...response.mjson.retdata.list);
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

                    <ListView
                        contentContainerStyle={styles.listStyle}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
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

    renderRow = (rowData, sectionID, rowId) => {
        return (
            <ObdCustomItem
                onPress={()=>{this.toNextPage('ObdCarList',{
                    merge_id: rowData.merge_id,
                });}}
                textStyle={rowData.threshold_warning_status == '1' ? {color: 'red'} : null}
                checkStyle={rowData.merge_threshold_warn_record_id == '0' ? {display: 'none'} : null}
                warningStyle={(rowData.threshold_warning_status == '3' || rowData.threshold_warning_status == '5') ? {color: 'red'} : null}
                name={rowData.name+'（'+rowData.companyname+'）'} carNum={'OBD监管车辆：'+rowData.obd_reg_num+"辆"}
                status={rowData.threshold_warning_status_text} warningTip={'预警说明：'+rowData.threshold_warning_audit_status_text}
                onPressCheckResult={()=>{
                    this.toNextPage('ObdCheckoutRecordFragment',{
                    name: rowData.name,
                    merge_threshold_warn_record_id: rowData.merge_threshold_warn_record_id
                });}}
            />);

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: fontAndColor.COLORA3,
    },
    listStyle: {
        marginTop: Pixel.getPixel(48)
    },
});