import React, {Component} from 'react';
import {
    AppRegistry,
    ListView,
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    InteractionManager,
    WebView,
    BackAndroid
} from 'react-native';
import {ObdCarDetailTable} from '../component/ComponentBlob'
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import * as fontAndColor from '../constant/fontAndColor';
import  PixelUtil from '../utils/PixelUtil'
import AllNavigationView from '../component/AllNavigationView';
var Pixel = new PixelUtil();
let allSouce = [];
let tabSouce = [];
let obd_info = null;
let regulation_info = null;
let auto_base_info;

export  default class ObdCarDetail extends BaseComponent {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: {},
            tabDataSource: {},
            renderPlaceholderOnly: 'blank',
            isRefreshing: false
        };
    }

    initFinish() {
        allSouce = [];
        this.props.screenProps.showModal(true);
        this.getData();
    }

    getData = () => {
        auto_base_info = null;
        regulation_info = null;
        tabSouce = [];
        let maps = {
            // rid: this.props.navigation.state.params.rid,
            rid: '39',
        };
        request(Urls.OBD_CAR_DETAIL, 'Post', maps)

            .then((response) => {
                    this.props.screenProps.showModal(false);
                    if (response.mjson.retdata == '' || response.mjson.retdata == null) {
                        return;
                    }
                    if (response.mjson.retdata.auto_base_info !== null) {
                        auto_base_info = response.mjson.retdata.auto_base_info;
                        allSouce.push([(auto_base_info.auto_type.name + '：' + auto_base_info.auto_type.value), (auto_base_info.certification.name + '：' + auto_base_info.certification.value)]);
                        allSouce.push([(auto_base_info.brand_name.name + '：' + auto_base_info.brand_name.value), (auto_base_info.series_name.name + '：' + auto_base_info.series_name.value)]);
                        allSouce.push([(auto_base_info.model_name.name + '：' + auto_base_info.model_name.value), (auto_base_info.frame_number.name + '：' + auto_base_info.frame_number.value)]);
                        allSouce.push([(auto_base_info.engine_number.name + '：' + auto_base_info.engine_number.value), (auto_base_info.displacement.name + '：' + auto_base_info.displacement.value)]);
                        allSouce.push([(auto_base_info.init_reg.name + '：' + auto_base_info.init_reg.value), (auto_base_info.manufacture.name + '：' + auto_base_info.manufacture.value)]);
                        allSouce.push([(auto_base_info.car_color.name + '：' + auto_base_info.car_color.value), (auto_base_info.trim_color.name + '：' + auto_base_info.trim_color.value)]);
                        allSouce.push([(auto_base_info.nature_use.name + '：' + auto_base_info.nature_use.value), (auto_base_info.transfer_count.name + '：' + auto_base_info.transfer_count.value)]);
                        allSouce.push([(auto_base_info.mileage.name + '：' + auto_base_info.mileage.value), (auto_base_info.plate_number.name + '：' + auto_base_info.plate_number.value)]);
                        allSouce.push([(auto_base_info.inspection_end.name + '：' + auto_base_info.inspection_end.value), (auto_base_info.insurance_end.name + '：' + auto_base_info.insurance_end.value)]);
                        allSouce.push([(auto_base_info.record_type.name + '：' + auto_base_info.record_type.value), (auto_base_info.storage.name + '：' + auto_base_info.storage.value)]);
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(allSouce),
                            isRefreshing: false
                        });
                    }
                    if (response.mjson.retdata.regulation_info !== null) {
                        regulation_info = response.mjson.retdata.regulation_info;
                    }
                    if (response.mjson.retdata.obd_info !== null) {
                        obd_info = response.mjson.retdata.obd_info;
                    }
                    if (response.mjson.retdata.warn_record !== null) {
                        console.log('1111111111111111111111');
                        tabSouce.push({
                            alarm_type_text: '报警类型',
                            alarm_time: '时间',
                            obd_number: 'OBD设备号',
                            alarm_explain: '说明',

                        });
                        tabSouce.push(...response.mjson.retdata.warn_record);
                        const ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            tabDataSource: ds1.cloneWithRows(tabSouce),
                            isRefreshing: false
                        });
                    }
                    this.setState({renderPlaceholderOnly: 'success'});
                },
                (error) => {
                    this.props.screenProps.showModal(false);
                    this.setState({renderPlaceholderOnly: 'error', isRefreshing: false});
                });
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success' || auto_base_info == null) {
            return (<View style={{backgroundColor: fontAndColor.COLORA3, flex: 1, paddingTop: Pixel.getPixel(15)}}>
                {this.loadView()}
                <AllNavigationView title={this.props.navigation.state.params.name} backIconClick={() => {
                    this.backPage();
                }} rightFootClick={()=>{}}/>
            </View>);
        } else {
            return (
                <View style={styles.container}>
                    <ScrollView style={[styles.container, {marginBottom: Pixel.getPixel(10)} ]}>
                        <View style={styles.container}>
                            <View style={{flex:1}}>
                                <Text style={styles.textStyle}>车辆基本信息</Text>
                                <ListView
                                    contentContainerStyle={styles.listStyle}
                                    dataSource={this.state.dataSource}
                                    renderRow={this.renderRow}
                                />

                                <Text style={styles.typeText}>OBD位置及护栏</Text>

                                <TouchableOpacity
                                    style={{flex:1,flexDirection:'row',justifyContent:'center'}}
                                    onPress={()=>{
                                        this.toNextPage('WebScene',{
                                    title: 'OBD位置及护栏',
                                    webUrl: obd_info.obd_track_url, });
                            }}>
                                    <View>
                                        <WebView
                                            ref="www"
                                            style={styles.webStyle}
                                            source={{uri:obd_info.obd_track_url, method:'GET'}}
                                            javaScriptEnabled={true}
                                            domStorageEnabled={true}
                                            scalesPageToFit={false}
                                        />
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.obdStatus}>
                                    <View style={{flexDirection:'row', flex: 1}}>
                                        <Text>OBD状态：</Text>
                                        <Text
                                            style={obd_info.is_explain=='1'? {color: 'red'}: null}>{obd_info.obd_status}</Text>
                                    </View>
                                    <TouchableOpacity style={{marginRight:Pixel.getPixel(10)}} activeOpacity={0.8}
                                                      onPress={()=>{this.toNextPage('ObdWarningExplain',{
                                                          warn_record_id: regulation_info.warn_record_id,
                                                          freshDataClick: this.freshDataClick});}}>
                                        <Text style={[styles.explainButton, {width: Pixel.getPixel(50)}]}>说明</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.obdStatus}>
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity style={{marginRight:Pixel.getPixel(10)}} activeOpacity={0.8}
                                                      onPress={()=>{this.toNextPage('ObdChangeBind',{
                                                          product_type_code : regulation_info.product_type_code,
                                                          regulator_id : regulation_info.regulator_id,
                                                          freshDataClick: this.freshDataClick});}}>
                                        <Text style={styles.explainButton}>重新绑定</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={[styles.typeText,{marginTop:Pixel.getPixel(20)}]}>OBD报警记录</Text>
                                <ListView
                                    contentContainerStyle={styles.listStyle}
                                    dataSource={this.state.tabDataSource}
                                    renderRow={this._tableRenderRow}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    <AllNavigationView title={'OBD监管详情'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
                </View>
            );
        }
    }

    freshDataClick = () => {
        allSouce = [];
        this.props.screenProps.showModal(true);
        this.getData();
    }

    renderRow = (rowData, sectionID, rowId) => {

        return (
            <View style={styles.detailItem}>
                <Text style={{flex:1,fontSize: Pixel.getPixel(11)}}>{rowData[0]}</Text>
                <View style={{flex:1, paddingLeft:Pixel.getPixel(5),}}>
                    <Text style={{fontSize: Pixel.getPixel(11)}}>{rowData[1]}</Text>
                </View>

            </View>
        );

    }
    _tableRenderRow = (rowData, sectionID, rowId) => {
        //warningStatus, time,obdNum,explains,borderStyle
        return (

            <ObdCarDetailTable
                borderStyle={rowId==(tabSouce.length-1) ? {borderBottomWidth: 1}:null}
                warningStatus={rowData.alarm_type_text}
                obdNum={rowData.obd_number} time={rowData.alarm_time}
                explains={rowData.alarm_explain}
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
        marginTop: Pixel.getPixel(10)
    },
    textStyle: {
        marginTop: Pixel.getPixel(58),
        marginLeft: Pixel.getPixel(10),
        fontSize: Pixel.getPixel(15),
    },
    typeText: {
        marginLeft: Pixel.getPixel(10),
        fontSize: Pixel.getPixel(15),
        marginVertical: Pixel.getPixel(10),
    },
    detailItem: {
        flex: 1,
        flexDirection: 'row',
        marginTop: Pixel.getPixel(5),
        marginLeft: Pixel.getPixel(20)
    },
    webStyle: {
        width: Pixel.getPixel(200),
        height: Pixel.getPixel(100),
        backgroundColor: fontAndColor.COLORA3,
    },
    obdStatus: {
        marginLeft: Pixel.getPixel(10),
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    explainButton: {
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#08c5a7',
        padding: Pixel.getPixel(3),
        marginTop: Pixel.getPixel(10),
        borderRadius: 3,
    }

});
