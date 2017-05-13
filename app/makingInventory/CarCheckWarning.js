import React, {Component} from 'react';
import {AppRegistry, Text, View, Image, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
const shareIcon = require('../../images/login_logs.png');
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import * as fontAndColor from '../constant/fontAndColor';
import  PixelUtil from '../utils/PixelUtil'
var Pixel = new PixelUtil();
import AllNavigationView from '../component/AllNavigationView';
import SelectMaskComponent from '../makingInventory/SelectMaskComponent';
let allSouce = [];
export  default class CarCheckWarning extends BaseComponent {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            dataSource: {},
        };

    }

    initFinish() {
        this.getData();
    }

    getData = () => {
        allSouce = [];
        this.props.screenProps.showModal(true);
        let maps = {};
        request(Urls.AUTOGETEXCEPTIONDICTLIST, 'Post', maps)

            .then((response) => {
                    allSouce.push(...response.mjson.retdata);
                    this.props.screenProps.showModal(false);
                },
                (error) => {
                    this.props.screenProps.showToast(error.mjson.retmsg);
                    this.props.screenProps.showModal(false);
                });
    }
    saveData = () => {
        const {vin, chkno, model, brand, address, status}=this.props.navigation.state.params;
        this.props.screenProps.showModal(true);
        // map.put("excecode", "" + list.get(position).getCode());
        // map.put("execinfo", "" + ycsm);
        // map.put("vin", "" + vin);
        // map.put("reqtoken", "" + token);
        // map.put("chkno", "" + chkno);
        // if (type == 2) {
        //     map.put("newrfid", "" + bq);
        //     map.put("rfid_img_id", "" + fileid);
        // }
        let maps = {
            vin: vin,
            chkno: chkno,
        };
        request(Urls.CARCHECKSUBMITCHKDATA, 'Post', maps)

            .then((response) => {
                    this.props.screenProps.showModal(false);
                },
                (error) => {
                    this.props.screenProps.showToast(error.mjson.retmsg);
                    this.props.screenProps.showModal(false);
                });
    }

    onContentSizeChange(event) {
        this.setState({height: event.nativeEvent.contentSize.height});
    }

    render() {
        return (
            <View style={styles.contain}>
                <View style={styles.blueTooth}>
                    <Text style={{flex: 1, textAlign:'center'}}>设备未连接</Text>
                </View>
                <TouchableOpacity activeOpacity={0.8} onPress={this.labelClick}>
                    <View style={[styles.wainingExplain,{paddingVertical: Pixel.getPixel(18)}]}>
                        <Text style={{marginRight: 3, marginLeft:10, color:'black',flex:1}}>异常类型:</Text>
                        <Text style={{marginRight:10, color:'black'}}>标签损坏</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.wainingExplain}>
                    <Text style={{marginRight: 3, marginLeft:10, color:'black'}}>异常说明:</Text>
                    <TextInput
                        multiline={true}
                        style={{flex:1, flexWrap: 'wrap', height:this.state.height,textAlign: 'right'}}
                        placeholder={'请输入异常类说明'}
                        onContentSizeChange={this.onContentSizeChange.bind(this)}
                        underlineColorAndroid={"#00000000"}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text}
                    />
                </View>
                <View style={styles.carPicture}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{color:'red',marginRight:3}}>*</Text>
                        <Text style={{flex:1}}>车辆照片 （体现防伪标签和车架号）</Text>
                        <TouchableOpacity style={styles.photoButton} onPress={this.takePhoto}>
                            <Text style={{color:'white'}}>拍照</Text>
                        </TouchableOpacity>
                    </View>
                    <Image style={styles.image} source={shareIcon}/>
                </View>
                <View style={{flex:1}}></View>
                <TouchableOpacity style={styles.bottomButton} activeOpacity={0.8} onPress={()=>{

                }}>
                    <Text style={styles.buttonText}>提交</Text>
                </TouchableOpacity>
                <SelectMaskComponent  ref={(modal) => {
                                         this.selectModal = modal
                                     }}
                                      viewData={[]} onClick={(rowID) => this._onClick(rowID)}/>
                <AllNavigationView title={'盘库异常'} backIconClick={() => {
                    this.backPage();
                }} rightFootClick={()=>{}}/>
            </View>
        );
    }

    labelClick=()=>{
        this.selectModal.changeData(allSouce);
        this.selectModal.openModal();
    }

    _onClick = (rowID) => {
    }

    takePhoto = () => {
        alert('拍照');
    }
    cancel = () => {
        this.backPage();
    }
    save = () => {
        this.backPage();
        this.props.navigation.state.params.freshDataClick();
    }

}

let styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    blueTooth: {
        flexDirection: 'row',
        backgroundColor: '#F6F693',
        paddingVertical: 5,
        marginTop: Pixel.getPixel(48)
    },
    wainingExplain: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: Pixel.getPixel(10),
        alignItems: 'center',
        paddingVertical: Pixel.getPixel(8)
    },
    image: {
        height: Pixel.getPixel(90),
        width: Pixel.getPixel(100),
        marginTop: Pixel.getPixel(10),
        marginLeft: Pixel.getPixel(20)
    },
    photoButton: {
        backgroundColor: '#08c5a7',
        borderRadius: 3,
        width: Pixel.getPixel(65),
        height: Pixel.getPixel(30),
        marginRight: Pixel.getPixel(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: 'white',
        borderRadius: 3,
        width: Pixel.getPixel(75),
        height: Pixel.getPixel(35),
        marginRight: Pixel.getPixel(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1
    },
    saveButton: {
        backgroundColor: '#08c5a7',
        borderRadius: 3,
        width: Pixel.getPixel(75),
        height: Pixel.getPixel(35),
        marginLeft: Pixel.getPixel(10),
        alignItems: 'center',
        justifyContent: 'center'
    },
    carPicture: {
        backgroundColor: 'white',
        padding: Pixel.getPixel(10),
        marginTop: Pixel.getPixel(10),
    },
    bottomButton: {
        flexDirection: 'row',
        margin: Pixel.getPixel(15),
        borderRadius: 4,
        backgroundColor: fontAndColor.all_blue
    },
    buttonText: {
        fontSize: Pixel.getPixel(16),
        flexDirection: 'row',
        color: 'white',
        flex: 1,
        textAlign: 'center',
        paddingVertical: Pixel.getPixel(7)
    }

})