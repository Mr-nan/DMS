/**
 * Created by Administrator on 2017/5/22.
 */
import React,{Component} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity
}from 'react-native';

const {width} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as FontAndColor from '../../constant/fontAndColor';

export default class AddCarPricePop extends Component{

    constructor(props){
        super(props);
    }

    _onPriceChange = (text)=>{
        this.price = text;
    };

    _onOkClick = ()=>{
        this.props.onOkClick(this.price);
    };

    _onEscClick = ()=>{
        this.props.closePop();
    };

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.box_wrap}>
                    <View style={styles.box_top_wrap}>
                        <View/>
                        <View style={styles.box_input_wrap}>
                            <TextInput style={styles.box_input_input}
                                       placeholder={'评估定价'}
                                       underlineColorAndroid='transparent'
                                       onChangeText={this._onPriceChange}
                            />
                            <Text style={styles.box_input_hint}>万元</Text>
                        </View>
                    </View>
                    <View style={styles.box_btn_wrap}>
                        <TouchableOpacity style={styles.box_btn_ok_touch}
                                          activeOpacity={0.6}
                                          onPress={this._onOkClick}>
                            <Text style={styles.box_btn_text}>确定</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.box_btn_esc_touch}
                                          activeOpacity={0.6}
                                          onPress={this._onEscClick}>
                            <Text style={styles.box_btn_text}>取消</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:width,
        flex:1,
        backgroundColor:'rgba(255,255,255,0)',
        alignItems:'center',
        position:'absolute',
        left:0,
        top:Pixel.getTitlePixel(68)
    },
    box_wrap:{
        height:Pixel.getPixel(160),
        width:Pixel.getPixel(245),
        marginTop:Pixel.getPixel(120),
        backgroundColor:'#eaf0fc',

        borderWidth:Pixel.getPixel(1),
        borderRadius:Pixel.getPixel(8),
        borderColor:'rgba(0,0,0,0.7)'
    },
    box_top_wrap:{
        height:Pixel.getPixel(80),
        marginHorizontal:Pixel.getPixel(30),
        justifyContent:'space-between'
    },
    box_input_wrap:{
        flexDirection:'row'
    },
    box_input_input:{
        width:Pixel.getPixel(80),
        height:Pixel.getPixel(40),
        marginLeft:Pixel.getPixel(5),
        marginBottom:Pixel.getPixel(10),

        borderRadius:Pixel.getPixel(5),
        borderWidth:Pixel.getPixel(1),
        borderColor:'#f79578',
        backgroundColor:FontAndColor.white,
        fontSize:Pixel.getFontPixel(14)
    },
    box_input_hint:{
        marginRight:Pixel.getPixel(20),
        marginBottom:Pixel.getPixel(20),
        alignSelf:'flex-end',
        marginLeft:40
    },
    box_btn_wrap:{
        height:Pixel.getPixel(80),
        marginHorizontal:Pixel.getPixel(30),
        paddingBottom:Pixel.getPixel(22),
        paddingTop:Pixel.getPixel(22),
        justifyContent:'center',
        flexDirection:'row'
    },
    box_btn_ok_touch:{
        flex:1,
        backgroundColor:'#f79578',
        marginRight:Pixel.getPixel(10),
        justifyContent:'center',
        alignItems:'center'
    },
    box_btn_text:{
        color:FontAndColor.white
    },
    box_btn_esc_touch:{
        flex:1,
        backgroundColor:FontAndColor.esc_button,
        marginLeft:Pixel.getPixel(10),
        justifyContent:'center',
        alignItems:'center'
    },

});