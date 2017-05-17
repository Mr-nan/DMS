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

export default class CustomerItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let {item,onItemClick} = this.props;

        let wait_evaluate_price = '待评估车辆金额：' + item.wait_evaluate_price;
        let one_car_price = '单车融资金额：' + item.one_car_price;
        let customerName = item.name;
        let companyName = item.companyname;
        if(companyName !== '' && companyName !== null){
            companyName = '(' + companyName + ')'
        }else{
            companyName = '(空)'
        }

        return (
            <View style={{width: width}}>
                <TouchableOpacity activeOpacity={0.6} onPress={()=>{onItemClick(item.name,item.merge_id)}} style={styles.container}>
                    <View style={styles.firstWrap}>
                        <Text style={styles.firstFont}>{customerName}</Text>
                        <Text style={styles.firstFont}>{companyName}</Text>
                    </View>
                    <View style={styles.secondWrap}>
                        <Text style={styles.secondFont}>{wait_evaluate_price}</Text>
                        <Text style={styles.secondFont}>{one_car_price}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: Pixel.getPixel(10),
        backgroundColor: FontAndColor.white,
        marginHorizontal: Pixel.getPixel(10),
        paddingHorizontal:Pixel.getPixel(10)
    },
    firstWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Pixel.getPixel(15)
    },
    firstFont: {
        fontSize: Pixel.getFontPixel(16),
        color: FontAndColor.black
    },
    secondWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Pixel.getPixel(15),
    },
    secondFont: {
        fontSize: Pixel.getFontPixel(13),
        color: FontAndColor.txt_gray,
        flex:1
    },


});