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
import AllNavigationView from '../component/AllNavigationView';
import * as FontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();

import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view';
import StockBottomScene from './StockBottomScene';
import StockTopOrderScene from './StockTopOrderScene';
import OneCarOrderScene from './OneCarOrderScene';
import PurchaseOrderScene from './PurchaseOrderScene';

export default class AssessmentSelectScene extends BaseComponent{

    constructor(props){
        super(props);
        this.cName = this.props.navigation.state.params.name;
        this.merge_id = this.props.navigation.state.params.merge_id;
        this.tabContent =[
            <StockBottomScene tabLabel='线下库融' />,
            <StockTopOrderScene tabLabel='线上库融' />,
            <OneCarOrderScene tabLabel='单车' />,
            <PurchaseOrderScene tabLabel='采购贷' />];
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <ScrollableTabView

                        renderTabBar={() => <DefaultTabBar />}
                    >
                        {this.tabContent}
                    </ScrollableTabView>
                </View>
                <AllNavigationView title={this.cName} backIconClick={() => {
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
        backgroundColor: FontAndColor.all_background
    },
});