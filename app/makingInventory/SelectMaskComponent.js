/**
 * Created by Administrator on 2017/2/13.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ListView,
    Image
} from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
const arrows = require('../../images/celljiantou@2x.png');

export default class SelectMaskComponent extends BaseComponent {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.props.navigation.state.params.viewData),
        };
    }

    render() {
        return (

            <View style={styles.container}>
                <ListView
                    contentContainerStyle={{marginTop: Pixel.getTitlePixel(78),}}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                />

                <AllNavigationView title={'异常类型选择'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>
        );
    }

    // 每一行中的数据
    _renderRow = (rowData) => {
        return (
            <TouchableOpacity style={{marginBottom:Pixel.getPixel(5)}} activeOpacity={0.6} onPress={()=>{
                this.backPage();
                this.props.navigation.state.params.onClick(rowData.code, rowData.name);
            }}>
                <View >
                    <View style={styles.rowStyle}>
                        <Text style={styles.textStyle}>{rowData.name}</Text>
                        <Image source={arrows}/>
                    </View>
                    <View style={styles.lineStyle}></View>
                </View>
            </TouchableOpacity>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    rowStyle: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Pixel.getPixel(6)
    },
    imageStyle: {
        width: Pixel.getPixel(30),
        height: Pixel.getPixel(30),
        marginLeft: Pixel.getPixel(20)
    },
    textStyle: {
        flex:1,
        fontSize: Pixel.getFontPixel(16),
        marginLeft: Pixel.getFontPixel(15),
    },
    lineStyle:{
        height: Pixel.getFontPixel(1),
        backgroundColor:'#d8d8d8'
    }
});



