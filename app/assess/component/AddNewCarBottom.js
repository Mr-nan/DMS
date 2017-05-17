/**
 * Created by Administrator on 2017/5/17.
 */
import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions
}from 'react-native';

const {width} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as FontAndColor from '../../constant/fontAndColor';

export default class AddNewCarBottom extends Component{

    render(){
        const {waitPrice,onAddClick} = this.props;
        return(
            <View style={styles.container}>
                <Text style={styles.firstFont}>{waitPrice}</Text>
                <TouchableOpacity
                    style={styles.btnWrap}
                    activeOpacity={0.6}
                    onPress = {onAddClick}>
                    <Text style={styles.btnFont}>添加车辆</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:FontAndColor.all_background,
        height:Pixel.getPixel(50),
        width:width,
        flexDirection:'row',
        alignItems:'center'
    },
    firstFont:{
        flex:1,
        marginLeft:Pixel.getPixel(14),
        fontSize:Pixel.getFontPixel(16),
        color:FontAndColor.txt_gray
    },
    btnWrap:{
        width:Pixel.getPixel(100),
        height:Pixel.getPixel(30),
        borderRadius:Pixel.getPixel(5),
        backgroundColor:'#76C8C2',
        marginRight:Pixel.getPixel(15),
        alignItems:'center',
        justifyContent:'center'
    },
    btnFont:{
        fontSize:Pixel.getFontPixel(16),
        color:FontAndColor.white
    }

});