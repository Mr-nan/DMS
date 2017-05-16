/**
 * Created by Administrator on 2017/5/12.
 */
import React,{Component} from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity
}from 'react-native';

import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as FontAndColor from '../../constant/fontAndColor';

export default class SettingMenu extends Component{

    constructor(props){
        super(props);
        this.state = {
            modalVisible: false
        };
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

    };

    _aboutVersion = ()=>{
        this.props.parentNav.toNextPage('VersionInfo',{})
    };

    _backLogin = ()=>{
        this.props.parentNav.placePage('LoginScene')
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
        height:Pixel.getPixel(153),
        width:Pixel.getPixel(140),
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
