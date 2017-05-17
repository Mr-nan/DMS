/**
 * Created by Administrator on 2017/5/17.
 */
import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import * as FontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();


export default class OneCarOrderScene extends BaseComponent{
    render(){
        return(
            <View>
                <Text>{'OneCarOrderScene'}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});