/**
 * Created by lcus on 2017/5/12.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Platform,
} from 'react-native';
import  {PAGECOLOR,width,height,adapeSize,fontadapeSize} from './MethodComponet'
const  commenStyle =StyleSheet.create({

    commenPage:{
        flex:1,
        backgroundColor:PAGECOLOR.all_background

    },
    testUI:{
        flex:1,
        backgroundColor:PAGECOLOR.all_background,
        marginTop:Platform.OS === 'android'?48:68,
    }

})

export {commenStyle}