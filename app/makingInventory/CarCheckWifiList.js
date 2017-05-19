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
    TouchableOpacity,
    NativeAppEventEmitter,
    NativeModules
} from 'react-native';
import {CarCheckCarListItem} from '../component/ComponentBlob'
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import * as fontAndColor from '../constant/fontAndColor';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import  PixelUtil from '../utils/PixelUtil'
import AllNavigationView from '../component/AllNavigationView';
var Pixel = new PixelUtil();
let allSouce = [];
const searchIcon = require('../../images/assessment_customer_find.png');
let name = '';
let merge_id = '';
let index1 = 0;

export  default class CarCheckNoWifiList extends BaseComponent {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.keyword = '';
        this.retmsg = ''
        this.state = {
            dataSource: {},
            isRefreshing: false,
            leftStyle: {},
            rightStyle: {},
            renderPlaceholderOnly: 'blank',
        };
        this.onSelect = this.onSelect.bind(this)
    }

    onSelect(index) {
        index1=index;
        if (index1 == 0) {
            this.setState({
                leftStyle: {color: 'white'},
                rightStyle: {color: 'black'}
            });
        } else {
            this.setState({
                leftStyle: {color: 'black'},
                rightStyle: {color: 'white'}
            });
        }
        this.getData(index1);
    }

    onReadData(data) {
        alert(data.result);
    }

    initFinish() {
        NativeModules.DmsCustom.isConnection((data) => {
        })

        index1 = 0;
        name = this.props.navigation.state.params.name;
        merge_id = this.props.navigation.state.params.merge_id;
        this.props.screenProps.showModal(true);
        this.getData(index1);
    }

    getData = (index1) => {
        let url = "";
        allSouce = [];
        if (index1 == 0) {//盘库车辆列表
            url = Urls.CARCHECKLOADCHKSTOREDATA;
        } else {//盘库成功车辆列表
            url = Urls.CARCHECKLOADCOMPLETEDCHKDATA;
        }
        let maps = {
            busno: merge_id,
            search: this.keyword,
        };
        request(url, 'Post', maps)

            .then((response) => {
                    this.props.screenProps.showModal(false);
                    if (response.mjson.retdata.chklist == null) {
                        this.props.screenProps.showToast('数据为空！');
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(allSouce),
                            isRefreshing: false
                        });
                        return;
                    }
                    if (response.mjson.retdata.chklist.length <= 0) {
                        this.props.screenProps.showToast('数据为空！');
                    } else {
                        allSouce.push(...response.mjson.retdata.chklist);
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(allSouce),
                            isRefreshing: false
                        });
                    }
                    this.setState({renderPlaceholderOnly: 'success'});
                },
                (error) => {
                    this.props.screenProps.showModal(false);
                    this.props.screenProps.showToast(response.mjson.retmsg);
                });
    }

    refreshingData = () => {
        allSouce = [];
        this.setState({isRefreshing: true});
        this.getData(index1);
    };

    textChange = (text) => {
        this.keyword = text;
    };

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (<View style={{backgroundColor: fontAndColor.COLORA3, flex: 1, paddingTop: Pixel.getPixel(15)}}>
                <AllNavigationView title={name} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>);
        } else {

            return (
                <View style={styles.container}>
                    <View style={styles.topStyle}>
                        <Text style={{flex: 1, textAlign:'center'}}>设备未连接</Text>
                    </View>
                    <View style={styles.searchStyle}>
                        <View style={{flex:1, }}>
                            <TextInput
                                multiline={true}
                                style={{height: Pixel.getPixel(40)}}
                                placeholder={'车架号、名称、品牌关键字'}
                                underlineColorAndroid={"#00000000"}
                                onChangeText={this.textChange}
                            />
                        </View>

                        <TouchableOpacity activeOpacity={0.8} onPress={this.searchData}>
                            <Image style={styles.searchIcon} source={searchIcon}/>
                        </TouchableOpacity>

                    </View>
                    <RadioGroup
                        size={0}
                        thickness={0}
                        color='red'
                        selectedIndex={0}
                        style={styles.radioGroup}
                        onSelect={(index) => this.onSelect(index)}
                    >
                        <RadioButton>
                            <Text style={[{color:'white'},this.state.leftStyle]}>待盘车辆</Text>
                        </RadioButton>

                        <RadioButton>
                            <Text style={[{color:'black'},this.state.rightStyle,]}>成功车辆</Text>
                        </RadioButton>

                    </RadioGroup>
                    <ListView
                        contentContainerStyle={styles.listStyle}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        enableEmptySections = {true}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.refreshingData}
                                tintColor={[fontAndColor.COLORB0]}
                                colors={[fontAndColor.COLORB0]}
                            />
                        }
                    />

                    <AllNavigationView title={name} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>

                </View>
            );
        }
    }

    searchData = () => {
        allSouce = []
        this.props.screenProps.showModal(true);
        this.getData();
    }

    renderRow = (rowData, sectionID, rowId) => {
        return (
            <CarCheckCarListItem
                onPress={()=>{
                    if(index1==0){
                        this.toNextPage('CarCheckWarning',{
                    vin: rowData.vin,
                    chkno: rowData.chkno,
                    model: rowData.name,
                    brand: rowData.brand,
                    address: rowData.storage,
                    status: rowData.type,
                    freshDataClick: this.freshDataClick
                        });
                    }
                 }}
                brandName={rowData.type==null ? '':(rowData.type=='0'?'【建档车辆  】' +rowData.brand : '【质押车辆  】'+rowData.brand)}
                modelName={rowData.name}
                vin={'车架号：'+rowData.vin}
                address={'监管地：'+rowData.storage}
                type={rowData.type==null || rowData.type=='' ? '': '盘库中'}
            />);

    }
    freshDataClick = () => {
        name = this.props.navigation.state.params.name;
        merge_id = this.props.navigation.state.params.merge_id;
        this.props.screenProps.showModal(true);
        this.getData(index1);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: fontAndColor.COLORA3,
    },
    listStyle: {
        marginTop: Pixel.getPixel(10),
    },
    searchStyle: {
        flexDirection: 'row',
        marginHorizontal: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginTop: Pixel.getPixel(10),
        backgroundColor: 'white',
        borderRadius: 92,
        height: Pixel.getPixel(40),
    },
    searchIcon: {
        width: Pixel.getPixel(28),
        height: Pixel.getPixel(28),
        margin: 3
    },
    topStyle: {
        flexDirection: 'row',
        backgroundColor: '#F6F693',
        paddingVertical: 5,
        marginTop: Pixel.getPixel(48),
    },
    radioGroup: {
        flexDirection: 'row',
        backgroundColor: '#76C8C2',
        justifyContent: 'space-around',
        marginTop: Pixel.getPixel(10)
    },
});