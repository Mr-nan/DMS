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
import {ObdCarItem} from '../component/ComponentBlob'
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

export  default class ObdCarList extends BaseComponent {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.keyword = ''
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
            p: page,
            r: 10,
            merge_id: this.props.navigation.state.params.merge_id,
            keyword: this.keyword,
        };
        request(Urls.OBD_CAR_LIST, 'Post', maps)

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
                <AllNavigationView title={'车辆列表'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>);
        } else {

            return (
                <View style={styles.container}>
                    <View style={styles.wrapContainer}>
                    <SearchTitleView hint={'车架号、OBD设备号、借款单号关键字'} onSearchClick={this.searchData}/>
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

                    </View>
                    <AllNavigationView title={'车辆列表'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>

                </View>
            );
        }
    }

    searchData = (text) => {
        allSouce = []
        page = 1;
        this.keyword =text;
        this.props.screenProps.showModal(true);
        this.getData();
    }

    renderRow = (rowData, sectionID, rowId) => {
        //modelName, vin, businessType, obdNum,obdStatus, noneSubmit, textStyle, onPress,vinTextStyle,auto_vin_from_obd
        return (
            <ObdCarItem
                onPress={()=>{this.toNextPage('ObdCarDetail',{
                    rid: rowData.id,
                });}}
                textStyle={rowData.is_explain=='1' ? {color: 'red'} : null}
                modelName={rowData.model_name}
                vin={'实车车架号：'+rowData.auto_vin}
                vinTextStyle={rowData.auto_vin_from_obd==''?{ color: 'red'}:null}
                auto_vin_from_obd={rowData.auto_vin_from_obd=='' ? '未识别': rowData.auto_vin_from_obd}
                businessType={rowData.business_type+'：'+rowData.payment_number}
                obdNum={'Obd设备号：'+rowData.obd_number}
                obdStatus={rowData.obd_status_text} noneSubmit={rowData.is_explain == '1' ?  '未提交说明！': ''}
            />);

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapContainer: {
        flex: 1,
        marginTop: Pixel.getTitlePixel(68),
        backgroundColor: FontAndColor.all_background,
    },
});