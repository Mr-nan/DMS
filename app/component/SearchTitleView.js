/**
 * Created by Administrator on 2017/5/15.
 */
import React,{Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    TextInput,
    Dimensions,
    TouchableOpacity
}from 'react-native';

import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as FontAndColor from '../constant/fontAndColor';
const {width} = Dimensions.get('window');

export default class SearchTitleView extends Component{

    constructor(props){
        super(props);
        this.searchValue=''
    }

    _onNameChange = (text)=>{
        this.searchValue = text;
    };

    render(){
        const {hint,onSearchClick} = this.props;
        return(
            <View style={styles.container}>
                <View style={styles.editWrap}>
                    <TextInput
                        ref={(input) => {
                            this.nameInput = input
                        }}
                        style={styles.fontInput}
                        underlineColorAndroid='transparent'
                        placeholder={hint}
                        onChangeText={this._onNameChange}
                    />
                    <TouchableOpacity activeOpacity={0.6} onPress={()=>{onSearchClick(this.searchValue)}}>
                    <Image style={styles.searchImg} source={require('../../images/assessment_customer_find.png')}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        width:width,
        height:Pixel.getPixel(50),
        backgroundColor:FontAndColor.all_background,
        paddingHorizontal:Pixel.getPixel(15),
        justifyContent:'center',
    },
    editWrap:{
        height:Pixel.getPixel(40),
        borderRadius:Pixel.getPixel(18),
        paddingLeft:Pixel.getPixel(20),
        backgroundColor:FontAndColor.white,
        flexDirection:'row',
        alignItems:'center'
    },
    fontInput:{
        fontSize:Pixel.getPixel(14),
        flex:1
    },
    searchImg:{
        width:Pixel.getPixel(26),
        height:Pixel.getPixel(26),
        marginRight:Pixel.getPixel(10),
    }

});