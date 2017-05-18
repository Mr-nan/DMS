/**
 * Created by Administrator on 2017/5/15.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
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

        const {payment_number, jkje,yksj,zjqd} = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={styles.titleWrap}>{payment_number}</Text>
                    <View style={styles.contentWrap}>
                        <Text style={styles.firstFont}>{'借款金额：' + jkje}</Text>
                        <Text style={styles.secondFont}>{'用款时间：' + yksj}</Text>
                    </View>
                    <View style={styles.contentWrap}>
                        <Text style={styles.firstFont}>{'资金渠道：' + zjqd}</Text>
                    </View>
                </View>
                <View style={styles.bottomBorder}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width
    },
    subContainer: {
        backgroundColor: FontAndColor.all_background,
        paddingHorizontal: Pixel.getPixel(10),
        height: Pixel.getPixel(92)
    },
    titleWrap: {
        marginTop: Pixel.getPixel(10),
        fontSize: Pixel.getFontPixel(16),
        color: FontAndColor.black
    },
    contentWrap: {
        flexDirection: 'row',
        marginTop: Pixel.getPixel(10),
    },
    firstFont: {
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.txt_gray,
        flex: 1
    },
    secondFont: {
        fontSize: Pixel.getFontPixel(14),
        color: FontAndColor.txt_gray,
        flex: 1
    },
    bottomBorder: {
        borderBottomWidth:1,
        borderBottomColor:FontAndColor.txt_gray
    }
});
