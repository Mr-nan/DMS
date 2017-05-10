import React, {Component} from 'react';
import {AppRegistry, ListView, Text, View} from 'react-native';
import {ObdCustomItem, ObdCarItem, ObdCarDetailTable} from './ComponentBlob'
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import  LoadMoreFooter from '../component/LoadMoreFooter';
import * as fontAndColor from '../constant/fontAndColor';
import  PixelUtil from '../utils/PixelUtil'
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
    initFinish(){
        this.getData();
    }

    getData = () => {
        let maps = {
            p: page,
            r: 10,
        };
        request(Urls.OBD_CUSTOMER_LIST, 'Post', maps)

            .then((response) => {
            console.log(response.mjson.retdata);
                    if (page == 1 && response.mjson.retdata.list.length <= 0) {
                        this.setState({renderPlaceholderOnly: 'null'});
                    } else {
                        allPage= response.mjson.retdata.total/10;
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
                    this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
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
                {this.loadView()}
            </View>);
        }else{

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

                </View>
            );
        }
    }

    renderRow = (rowData, sectionID, rowId) => {
        return (
            <ObdCustomItem
                onPress={()=>{alert('safsdf')}}
                textStyle={rowData === 'John' ? {color: 'red'} : null}
                name={'刘勇（123）'} carNum={'OBD监管车辆:'+"4辆"} status={'预警'} warningTip={'预警说明：'+'风控待审核'}
                onPressCheckResult={()=>{alert('查看')}}
            />);

    }

    _renderRow = (rowData, sectionID, rowId) => {
        //modelName, vin, businessType, obdNum,obdStatus, noneSubmit, textStyle, onPress
        return (
            <ObdCarItem
                onPress={()=>{alert('safsdf')}}
                textStyle={rowData === 'John' ? {color: 'red'} : null}
                modelName={'东风雪铁龙'} vin={'实车车架号:'+"12348973127489"} businessType={'线下库融：'+'0'}
                obdNum={'Obd设备号：'+'3274983727932'} obdStatus={'正常'}
                noneSubmit={rowData === 'Joel' ?  '未提交说明！': ''}
                onPressCheckResult={()=>{alert('查看')}}
            />);

    }
    _tableRenderRow = (rowData, sectionID, rowId) => {
        //warningStatus, time,obdNum,explains,borderStyle
        return (

            <ObdCarDetailTable
                borderStyle={rowId==(data.length-1) ? {borderBottomWidth: 1}:null}
                warningStatus={'正常'}
                obdNum={'32749'} time={'3478'}
                explains={'jfadsjlioppioipip'}
            />);

    }
}