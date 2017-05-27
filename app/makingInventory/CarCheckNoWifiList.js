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
import SQLiteUtil from '../utils/SQLiteUtil';
const SQLite = new SQLiteUtil();
let allSouce = [];
let lists = [];
const searchIcon = require('../../images/assessment_customer_find.png');
let name = '';
let merge_id = '';
let index1 = 0;
let that = null;
let haveCheck = false;
let sublist=[];
let subSomeCarCheckData;
let dbItem;
export  default class CarCheckNoWifiList extends BaseComponent {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.keyword = '';
        this.retmsg = ''
        this.state = {
            dataSource: {},
            leftStyle: {},
            rightStyle: {},
            renderPlaceholderOnly: 'blank',
            blueToothText: '设备未连接'
        };
        this.onSelect = this.onSelect.bind(this)
        that = this;
    }

    onSelect(index) {
        index1 = index;
        if (index1 == 0) {
            this.setState({
                leftStyle: {color: 'white'},
                rightStyle: {color: 'black'}
            });
            this.findData();
        } else {
            this.setState({
                leftStyle: {color: 'black'},
                rightStyle: {color: 'white'}
            });
            this.readData();
        }
    }

    findData = () => {
        lists = [];
        if (that.keyword == '' || that.keyword == null) {
            SQLite.selectData('SELECT * FROM carchecksuccess WHERE busno = ?',
                [merge_id],
                (data) => {
                    console.log('------------------' + data.code);
                    if (data.code === 1) {
                        console.log(data.result);
                        lists.push(...allSouce)
                            for (let i = 0; i < data.result.rows.length; i++) {
                                console.log(data.result.rows.item(i).chkno);
                                for (let j = 0; j < allSouce.length; j++) {
                                    if (allSouce[j].chkno == data.result.rows.item(i).chkno) {
                                        lists.splice(j, 1);
                                    }
                                }
                            }
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(lists),
                        });
                    } else {
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(allSouce),
                        });
                    }
                });

        } else {
            SQLite.selectData('SELECT * FROM carchecksuccess WHERE busno = ?',
                [merge_id],
                (data) => {
                    if (data.code === 1) {

                        if(index1==0){
                            if(data.result.rows.length==0){
                                for (let value of allSouce) {
                                        let subStr = '';
                                        subStr = value.vin.substring(11, 17);
                                        if (subStr == this.keyword) {
                                            lists.push(value);
                                            break;
                                        }
                                }
                            }else{
                                    for (let j=0; j<allSouce;j++) {
                                        for(let i=0;i<data.result.rows.length;i++){
                                            if (allSouce[j].chkno !== data.result.rows.item(i).chkno) {
                                                let subStr = '';
                                                subStr = allSouce[j].vin.substring(11, 17);
                                                if (subStr == this.keyword) {
                                                    lists.push(allSouce[j]);
                                                    break;
                                                }
                                            }
                                        }

                                    }
                            }

                        }else{
                            for (let i = 0; i < data.result.rows.length; i++) {
                                        let subStr = '';
                                        subStr = data.result.rows.item(i).vin.substring(11, 17);
                                        if (subStr == this.keyword) {
                                            lists.push(data.result.rows.item(i));
                                            break;
                                        }
                            }

                        }
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(lists),
                        });
                    }else{
                        for (let value of allSouce) {
                            let subStr = '';
                            subStr = value.vin.substring(11, 17);
                            if (subStr == this.keyword) {
                                lists.push(value);
                                break;
                            }
                        }
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(lists),
                        });
                    }
                });
        }

    }

    saveData = (value) => {
        SQLite.changeData('INSERT INTO carchecksuccess (vin,busno,excecode,execinfo,rfid_img_id,chkno,newrfid,brand,chk_time,name,storage,type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [value.vin,merge_id, '1205', '正常', '', value.chkno, ''
            , value.brand, value.chk_time, value.name, value.storage, value.type]);
        that.findData();

    }

    readData = () => {
        lists = [];
        SQLite.selectData('SELECT * FROM carchecksuccess WHERE busno = ?',
            [merge_id],
            (data) => {
            console.log(data.code+'----------'+data.result.rows.length);
                if (data.code === 1) {
                    if(data.result.rows.length==0){
                        this.props.screenProps.showToast('暂无成功数据！');
                    }
                        for (let i = 0; i < data.result.rows.length; i++) {
                            lists.push(data.result.rows.item(i));
                        }
                    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    this.setState({
                        dataSource: ds.cloneWithRows(lists),
                    });
                } else {
                    this.props.screenProps.showToast('暂无成功数据！');
                }
            });

    }

    onReadData(data) {//盘库检验蓝牙测到的标签是否在列表中存在
        haveCheck = false;
        if (allSouce !== null) {
            for (let value of allSouce) {
                if (value.rfid !== null) {
                    if (value.rfid == data.result) {
                        that.saveData(value)
                        haveCheck = true;
                    }
                }
            }
            if (!haveCheck) {
                that.props.screenProps.showToast('标签无匹配！');
            }
        } else {
            that.props.screenProps.showToast('数据异常，请重新进入此页面！');
        }
    }

    initFinish() {
        SQLite.createTable();
        NativeAppEventEmitter
            .addListener('onReadData', this.onReadData);
        NativeModules.DmsCustom.isConnection((data)=>{
            if(data==1){
                that.setState({
                    blueToothText: '设备已连接'
                });
            }
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
                        });
                    }
                    this.setState({renderPlaceholderOnly: 'success'});
                },
                (error) => {
                    this.props.screenProps.showModal(false);
                    this.props.screenProps.showToast(response.mjson.retmsg);
                });
    }

    onBlueConnection(){
        that.setState({
            blueToothText: '设备已连接'
        });
    }

    checkData=()=>{
        sublist=[];
        SQLite.selectData('SELECT * FROM carchecksuccess WHERE busno = ?',
            [merge_id],
            (data) => {
                if (data.code === 1) {
                    //chkno;
                    // private String excecode;
                    // private String execinfo;
                    // private String newrfid;
                    // private String rfid_img_id;
                    // private String vin;
                    subSomeCarCheckData={};
                    dbItem=null;
                    for (let i = 0; i < data.result.rows.length; i++) {
                        dbItem=data.result.rows.item(i);
                        subSomeCarCheckData={
                            chkno : dbItem.chkno,
                            excecode : dbItem.excecode,
                            execinfo : dbItem.execinfo,
                            newrfid : '',
                            rfid_img_id : '',
                            vin : dbItem.vin,
                        }
                        sublist.push(subSomeCarCheckData);
                    }
                    this.requestData();
                } else {
                    this.props.screenProps.showToast('暂无成功数据！');
                }
            });
    }

    requestData = () => {//提交盘库成功列表
        if(sublist.length<=0){
            this.props.screenProps.showToast('暂无成功数据！');
            return;
        }
        console.log(JSON.stringify(sublist).toString());
        // this.props.screenProps.showModal(true);
        let url = "";
        allSouce = [];
        url = Urls.CARCHECKPATCHSUBMITCHKDATA;
        let maps = {
            list: JSON.stringify(sublist).toString(),
        };
        request(url, 'Post', maps)

            .then((response) => {
                    this.props.screenProps.showModal(false);
                    this.deleteData();
                },
                (error) => {
                    this.props.screenProps.showModal(false);
                    this.props.screenProps.showToast(response.mjson.retmsg);
                });
    }

    deleteData=()=>{
        for (let i = 0; i < sublist.length; i++) {
            for (let j = 0; j < allSouce.length; j++) {
                if (allSouce[j].chkno == sublist[i].chkno) {
                    allSouce.splice(j, 1);
                    break;
                }
            }
        }
        SQLite.changeData('DELETE FROM carchecksuccess where busno = ?', [merge_id]);
        this.props.screenProps.showToast('盘库成功');
        this.onSelect(0);
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
                        <Text style={{flex: 1, textAlign:'center'}}>{this.state.blueToothText}</Text>
                    </View>
                    <View style={styles.searchStyle}>
                        <View style={{flex:1, }}>
                            <TextInput
                                multiline={true}
                                style={{height: Pixel.getPixel(40)}}
                                placeholder={'车架号后六位'}
                                underlineColorAndroid={"#00000000"}
                                onChangeText={this.textChange}
                            />
                        </View>

                        <TouchableOpacity activeOpacity={0.8} onPress={
                            this.keyword=='' && index1==1 ? this.readData: this.findData
                          }>
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
                            <Text style={[{color:'white'},this.state.leftStyle]}>本地待盘车辆</Text>
                        </RadioButton>

                        <RadioButton>
                            <Text style={[{color:'black'},this.state.rightStyle,]}>本地成功车辆</Text>
                        </RadioButton>

                    </RadioGroup>
                    <ListView
                        contentContainerStyle={styles.listStyle}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        enableEmptySections = {true}
                    />

                    <TouchableOpacity style={styles.bottomButton} activeOpacity={0.6} onPress={
                        this.checkData
                    }>
                        <Text style={styles.buttonText}>提交已盘车辆</Text>
                    </TouchableOpacity>

                    <AllNavigationView title={'无网盘库'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>

                </View>
            );
        }
    }

    renderRow = (rowData, sectionID, rowId) => {
        return (
            <CarCheckCarListItem
                brandName={rowData.type==null ? '':(rowData.type=='0'?'【建档车辆  】' +rowData.brand : '【质押车辆  】'+rowData.brand)}
                modelName={rowData.name}
                vin={'车架号：'+rowData.vin}
                address={'监管地：'+rowData.storage}
                type={index1==0 ? '盘库中': '盘库成功'}
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
    bottomButton: {
        flexDirection: 'row',
        margin: Pixel.getPixel(25),
        borderRadius: 4,
        backgroundColor: fontAndColor.all_blue,
        marginHorizontal: Pixel.getPixel(25),
        position:'absolute',
        bottom: Pixel.getPixel(10)
    },
    buttonText: {
        fontSize: Pixel.getPixel(16),
        flexDirection: 'row',
        color: 'white',
        flex: 1,
        textAlign: 'center',
        paddingVertical: Pixel.getPixel(7)
    },
});