/**
 * Created by Administrator on 2017/5/17.
 */
import React,{Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Dimensions,
    Image
}from 'react-native';

const {width} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as FontAndColor from '../../constant/fontAndColor';

const pgdq = require('../../../images/thbq1.png');

export default class PurchaseCarItem extends Component {

    render(){
        const {item,onItemClick} = this.props;

        let title = item.model_name + '(' + item.frame_number.substring(
            item.frame_number.length - 6, item.frame_number.length) + ')';

        let region_assess_mny = '评估定价：' + Number.parseFloat(item.region_assess_mny) / 10000 + '万元';
        let hq_assess_mny = '审批定价：' + Number.parseFloat(item.hq_assess_mny) / 10000 + '万元';
        let lend_mny = '评估放款额：' + Number.parseFloat(item.lend_mny) / 10000 + '万元';
        let loan_mny = '审批放款额：'+ Number.parseFloat(item.loan_mny) / 10000 + '万元';
        let dq = false;
        let dqHint = '';
        let clickType = '4';
        if(item.can_assess !== undefined && item.can_assess !== ''){
            if(item.can_assess === 1){
                dq = true;
                dqHint = '待\n评\n估';
                clickType = '4';
            }else if(item.can_assess === 2){
                dq = true;
                dqHint = '可\n编\n辑';
                clickType = '5';
            }else{
                dq = false;
            }
        }else{
            dq = false;
        }

        return(
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <TouchableOpacity
                        style={styles.wrapContainer}
                        activeOpacity={0.6}
                        onPress={()=>{onItemClick('2',item)}}>
                        <View style={styles.leftWrap}>
                            <Text style={styles.carName}>{title}</Text>
                            <View style={styles.leftSubWrap}>
                                <View style={styles.leftSubOne}>
                                    <Text style={styles.pgdjFont}>
                                        {region_assess_mny}
                                    </Text>
                                    <Text style={styles.pgfkeFont}>
                                        {hq_assess_mny}
                                    </Text>
                                </View>
                                <View style={styles.leftSubTwo}>
                                    <Text style={styles.pgdjFont}>
                                        {lend_mny}
                                    </Text>
                                    <Text style={styles.pgfkeFont}>
                                        {loan_mny}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.rightWrap}>

                        </View>
                    </TouchableOpacity>
                    {
                        dq &&
                        <TouchableOpacity
                            style={styles.pgdqWrap}
                            activeOpacity={0.6}
                            onPress={()=>{onItemClick(clickType,item)}}>
                            <Image resizeMode={'contain'} style={styles.pgdqImg} source={pgdq}>
                                <Text style={styles.pgdqFont}>{dqHint}</Text>
                            </Image>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:width
    },
    subContainer:{
        height:Pixel.getPixel(130),
        minHeight:Pixel.getPixel(130),
        marginHorizontal:Pixel.getPixel(10)
    },
    wrapContainer:{
        height:Pixel.getPixel(110),
        backgroundColor:FontAndColor.white,
        paddingHorizontal:Pixel.getPixel(10),
        flexDirection:'row',
        marginTop:Pixel.getPixel(20)
    },
    leftWrap:{
        flex:8
    },
    rightWrap:{
        flex:1
    },
    carName:{
        marginTop:Pixel.getPixel(10),
        fontSize:Pixel.getFontPixel(14),
        color:FontAndColor.black
    },
    leftSubWrap:{
        flex:1,
        flexDirection:'row',
        alignItems:'center'
    },
    leftSubOne:{
        flex:1,
    },
    leftSubTwo:{
        flex:1,
    },
    pgdjFont:{
        fontSize:Pixel.getFontPixel(13),
        color:FontAndColor.txt_gray
    },
    pgfkeFont:{
        fontSize:Pixel.getFontPixel(13),
        color:FontAndColor.txt_gray,
        marginTop:Pixel.getPixel(15)
    },
    pgdqImg:{
        width:Pixel.getPixel(40),
        height:Pixel.getPixel(130)
    },
    pgdqFont:{
        fontSize:Pixel.getFontPixel(12),
        color:FontAndColor.white,
        marginLeft:Pixel.getPixel(11),
        marginTop:Pixel.getPixel(48),
        backgroundColor:'transparent'
    },
    pgdqWrap:{
        width:Pixel.getPixel(40),
        height:Pixel.getPixel(130),
        position:'absolute',
        right:Pixel.getPixel(5)
    },
});
