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

const repStyles=StyleSheet.create({

    radioGroup:{
        marginLeft:adapeSize(10),
        marginTop:adapeSize(5)
    },
    repToutal:{
        marginLeft:adapeSize(10),
        marginTop:adapeSize(8),
        marginRight:adapeSize(10)
    },
    repToutalText:{

        marginBottom:adapeSize(10) ,
        marginLeft:adapeSize(15),
        marginTop:adapeSize(10),
        color:PAGECOLOR.font_blue
    },
    rateText:{

        marginLeft:adapeSize(15),
        color:PAGECOLOR.font_blue,
        marginTop:adapeSize(10),
        marginBottom:adapeSize(10)
    }

})


export {commenStyle,repStyles}