/**
 * Created by Administrator on 2017/5/15.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions
}from 'react-native';

import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as FontAndColor from '../../constant/fontAndColor';
const {width} = Dimensions.get('window');

export default class OrderItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {item,onItemClick} = this.props;

        let payment_number = item.payment_number;

        if(item.loantype !== undefined){
            payment_number = item.payment_number +  "   " + item.loantype;
            if(item.loantype === "续贷" || item.loantype === "续租"){
                payment_number = item.payment_number +  "   " + item.loantype +
                    "（" + item.getFather_number() + "）";
            }
        }


        let jkje = '借款金额：' + item.loanmnystr;
        let yksj = '用款时间：' + item.makedatestr;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={()=>{onItemClick(item)}}
                    style={styles.subContainer}>
                    <Text style={styles.titleWrap}>{payment_number}</Text>
                    <View style={styles.contentWrap}>
                        <Text style={styles.firstFont}>{jkje}</Text>
                        <Text style={styles.secondFont}>{yksj}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width
    },
    subContainer: {
        marginTop: Pixel.getPixel(10),
        backgroundColor: FontAndColor.white,
        marginHorizontal: Pixel.getPixel(10),
        paddingHorizontal:Pixel.getPixel(10),
        height:Pixel.getPixel(82)
    },
    titleWrap: {
        marginTop: Pixel.getPixel(10),
        fontSize:Pixel.getFontPixel(16),
        color:FontAndColor.black
    },
    contentWrap: {
        flexDirection: 'row',
        marginTop: Pixel.getPixel(10),
    },
    firstFont: {
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.txt_gray,
        flex:1
    },
    secondFont: {
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.txt_gray,
        flex:1
    }
});