/**
 * Created by Administrator on 2017/5/19.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import * as FontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
const {width} = Dimensions.get('window');

export default class TagSelectView extends Component {

    constructor(props) {
        super(props);

        const {cellData} = this.props;

        let viewItems = null;

        if(this.props.onTagClick){
            viewItems =  cellData.map((dt, index) => {
                return (
                    <TouchableOpacity key={index} activeOpacity={1} onPress={() => {
                        this.props.onTagClick(dt, index);
                    }}>
                        <View key={index}
                              style={dt.check ? styles.tag_select_Wrap : styles.tag_default_Wrap}>
                            <Text
                                style={dt.check ? styles.tag_select_text : styles.tag_default_text}>{dt.name}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        }else {
            viewItems = cellData.map((dt, index) => {
                return (
                    <View key={index} style={dt.check ? styles.tag_select_Wrap : styles.tag_default_Wrap}>
                        <Text
                            style={dt.check ? styles.tag_select_text : styles.tag_default_text}>{dt.name}</Text>
                    </View>
                )
            })
        }

        this.state = {
            cellData:viewItems
        }

    }

    componentWillReceiveProps(nextProps){
        const {cellData} = nextProps;

        let viewItems = null;

        if(this.props.onTagClick){
            viewItems =  cellData.map((dt, index) => {
                return (
                    <TouchableOpacity key={index} activeOpacity={1} onPress={() => {
                        this.props.onTagClick(dt, index);
                    }}>
                        <View key={index}
                              style={dt.check ? styles.tag_select_Wrap : styles.tag_default_Wrap}>
                            <Text
                                style={dt.check ? styles.tag_select_text : styles.tag_default_text}>{dt.name}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        }else {
            viewItems = cellData.map((dt, index) => {
                return (
                    <View key={index} style={dt.check ? styles.tag_select_Wrap : styles.tag_default_Wrap}>
                        <Text
                            style={dt.check ? styles.tag_select_text : styles.tag_default_text}>{dt.name}</Text>
                    </View>
                )
            })
        }

        this.setState({
            cellData:viewItems
        });
    }

    refreshData = (cellData)=>{

        let viewItems =  cellData.map((dt, index) => {
            return (
                <TouchableOpacity key={index} activeOpacity={1} onPress={() => {
                    this.props.onTagClick(dt, index);
                }}>
                    <View key={index}
                          style={dt.check ? styles.tag_select_Wrap : styles.tag_default_Wrap}>
                        <Text
                            style={dt.check ? styles.tag_select_text : styles.tag_default_text}>{dt.name}</Text>
                    </View>
                </TouchableOpacity>
            )
        });

        this.setState({
            cellData:viewItems
        });
    };

    render() {

        return (
            <View style={styles.container}>
                {this.state.cellData}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    tag_default_Wrap: {
        height: Pixel.getPixel(40),
        backgroundColor: 'transparent',
        marginRight: Pixel.getPixel(10),
        marginBottom: Pixel.getPixel(10),
        paddingHorizontal: Pixel.getPixel(5),
        borderRadius: Pixel.getPixel(10),
        borderWidth: Pixel.getPixel(2),
        borderColor: FontAndColor.line_gray,
        alignContent: 'center',
        justifyContent: 'center'
    },
    tag_default_text: {
        fontSize: Pixel.getFontPixel(18),
        color: FontAndColor.txt_gray
    },
    tag_select_Wrap: {
        height: Pixel.getPixel(40),
        backgroundColor: 'transparent',
        marginRight: Pixel.getPixel(10),
        marginBottom: Pixel.getPixel(10),
        paddingHorizontal: Pixel.getPixel(5),
        borderRadius: Pixel.getPixel(10),
        borderWidth: Pixel.getPixel(2),
        borderColor: FontAndColor.all_blue,
        alignContent: 'center',
        justifyContent: 'center'
    },
    tag_select_text: {
        fontSize: Pixel.getFontPixel(18),
        color: FontAndColor.all_blue
    }
});