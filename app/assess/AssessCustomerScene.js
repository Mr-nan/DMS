/**
 * Created by Administrator on 2017/5/15.
 */
import React from 'react';
import {
    View,
    StyleSheet,
    FlatList
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as FontAndColor from '../constant/fontAndColor';
import SearchTitleView from '../component/SearchTitleView';

export default class AssessCustomerScene extends BaseComponent{

    constructor(props){
        super(props);
    }


    _onSearchClick=(searchValue)=>{

    };

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <SearchTitleView hint={'客户姓名关键字'} onSearchClick={()=>{}}/>
                    <FlatList

                    />
                </View>
                <AllNavigationView title={'第1车贷'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapContainer: {
        flex: 1,
        marginTop: Pixel.getTitlePixel(68),
        backgroundColor: FontAndColor.all_background,
        alignItems: 'center',
    },
});