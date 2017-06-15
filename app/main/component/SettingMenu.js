/**
 * Created by Administrator on 2017/5/12.
 */
import React,{Component} from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity
}from 'react-native';

import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as FontAndColor from '../../constant/fontAndColor';
import StorageUtil from '../../utils/StorageUtil';
import * as StorageKeyNames from '../../constant/storageKeyNames';
const IS_ANDROID = Platform.OS === 'android';
import CheckBox from 'react-native-check-box'

export default class SettingMenu extends Component{

    constructor(props){
        super(props);
        this.state = {
            modalVisible: false,
            selectCheck:false
        };
    }

    componentDidMount(){
        StorageUtil.mGetItem(StorageKeyNames.CAMERA_CUSTOM, (data) => {
            console.log('camera custom',data.result);
            let selectIndex = false;
            if (data.code == 1) {
                if(data.result === '0'){
                    //使用自定义相机
                    selectIndex = true
                }else if(data.result === '1'){
                    //使用系统相机
                    selectIndex = false;
                }else{
                    selectIndex = false;
                }
            }
            this.setState({
                selectCheck:selectIndex
            });
        });
    }

    openModal = ()=>{
        this.setState({
            modalVisible: true
        });
    };

    closeModal= ()=>{
        this.setState({
            modalVisible: false
        });
    };

    _blueConnect = ()=>{
        this.setState({
            modalVisible: false
        },()=>{this.props.parentNav.toNextPage('BluetoothScene',{
            onReadData:this.props.parentNav.onReadData,
            onBlueConnection:this.props.parentNav.onBlueConnection
        })});
    };

    _aboutVersion = ()=>{
        this.setState({
            modalVisible: false
        },()=>{this.props.parentNav.toNextPage('VersionInfo',{})});
    };

    _backLogin = ()=>{
        this.props.parentNav.placePage('LoginScene')
    };

    _cameraSelect = ()=> {
        return (
        <View style={{flex:1,justifyContent:'center',paddingHorizontal:10}}>
            <CheckBox
                leftTextStyle={styles.textWrap}
                onClick={()=>this._onCheckClick()}
                isChecked={this.state.selectCheck}
                leftText={'使用通用相机'} />
        </View>
        );
    };

    _onCheckClick = () =>{
        this.setState({
            selectCheck:!this.state.selectCheck
        },()=>{
            StorageUtil.mSetItem(StorageKeyNames.CAMERA_CUSTOM, this.state.selectCheck ? '0' : '1');
        })
    };

    render(){
        return(
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={()=>{}}>
                <TouchableOpacity style={styles.container} activeOpacity={0} onPress={()=>{this.closeModal()}}>
                    <View style={styles.wrapContainer}>
                        <TouchableOpacity style={styles.btnWrap} onPress={this._blueConnect}>
                            <Text style={styles.textWrap}>蓝牙连接</Text>
                        </TouchableOpacity>
                        <View style={styles.splitView}/>
                        <TouchableOpacity style={styles.btnWrap} onPress={this._aboutVersion}>
                            <Text style={styles.textWrap}>关于版本</Text>
                        </TouchableOpacity>
                        <View style={styles.splitView}/>
                        <TouchableOpacity style={styles.btnWrap} onPress={this._backLogin}>
                            <Text style={styles.textWrap}>退出登录</Text>
                        </TouchableOpacity>
                        {
                            IS_ANDROID && <View style={styles.splitView}/>
                        }
                        {
                            IS_ANDROID && this._cameraSelect()
                        }
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles =StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'transparent'
    },
    wrapContainer:{
        marginTop:Pixel.getTitlePixel(68),
        backgroundColor:'rgba(0,0,0,0.6)',
        borderRadius:Pixel.getPixel(5),
        height:Pixel.getMenuHeightPixel(153),
        width:Pixel.getMenuWidthPixel(140),
        alignSelf:'flex-end'
    },
    btnWrap:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    splitView:{
        marginHorizontal:Pixel.getPixel(10),
        backgroundColor:'#888888',
        height:1
    },
    textWrap:{
        fontSize:Pixel.getFontPixel(16),
        color:FontAndColor.white
    }

});
