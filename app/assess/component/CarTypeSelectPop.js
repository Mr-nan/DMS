/**
 * Created by Administrator on 2017/5/22.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ListView
} from 'react-native';

import * as FontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
const {width, height} = Dimensions.get('window');

export default class CarTypeSelectPop extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource:ds ,
        };
    }


    refresh = (data,dtType) => {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data)
        });
        this.dtType = dtType;
    };

    _hideModal = ()=>{
        this.props.closeModal();
    };


    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.container}
                onPress={this._hideModal}>
                <View style={styles.contentMargin}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                    />
                </View>
            </TouchableOpacity>
        );
    }


    // 每一行中的数据
    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                key={rowID}
                onPress={() => {
                    this.props.onItemClick(rowID,rowData,this.dtType);
                    this._hideModal();
                }}>
                <View style={styles.rowStyle}>
                    <Text style={styles.fontMain}>{rowData}</Text>
                </View>
            </TouchableOpacity>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        width: width,
        height:height,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        position:'absolute',
        left:0,
        top:0
    },
    rowStyle: {
        backgroundColor: '#FFFFFF',
        height: Pixel.getPixel(44),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: FontAndColor.COLORA4,
        borderBottomWidth: 0.5
    },
    fontMain: {
        color: '#000000',
        fontSize: Pixel.getFontPixel(14)
    },
    splitLine: {
        borderColor: FontAndColor.COLORA4,
        borderWidth: 0.5
    },
    contentMargin:{
        marginHorizontal:Pixel.getPixel(10)
    }
});



