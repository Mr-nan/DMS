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

export default class BottomStockItem extends Component {

   render(){
       const {item,onItemClick} = this.props;
       let title = item.title;
       let region_assess_mny_str = '评估定价：' + item.region_assess_mny_str;
       let lend_mny_str = '评估放款额：' + item.lend_mny_str;
       let region_rebate_str = '折扣率：' + item.region_rebate_str;
       let loan_mny_str = '审批放款额：'+ item.loan_mny_str;
       let dq = item.is_time_out === 1;
       return(
       <View style={styles.container}>
           <View style={styles.subContainer}>
               <TouchableOpacity
                   style={styles.wrapContainer}
                   activeOpacity={0.6}
                   onPress={()=>{onItemClick(item)}}>
                   <View style={styles.leftWrap}>
                       <Text style={styles.carName}>{title}</Text>
                       <View style={styles.leftSubWrap}>
                           <View style={styles.leftSubOne}>
                               <Text style={styles.pgdjFont}>
                                   {region_assess_mny_str}
                               </Text>
                               <Text style={styles.pgfkeFont}>
                                   {lend_mny_str}
                               </Text>
                           </View>
                           <View style={styles.leftSubTwo}>
                               <Text style={styles.pgdjFont}>
                                   {region_rebate_str}
                               </Text>
                               <Text style={styles.pgfkeFont}>
                                   {loan_mny_str}
                               </Text>
                           </View>
                       </View>
                   </View>
                   <View style={styles.rightWrap}>

                   </View>
               </TouchableOpacity>
               {
                   dq &&
                   <Image resizeMode={'contain'} style={styles.pgdqImg} source={pgdq}>
                       <Text style={styles.pgdqFont}>{'评\r\n估\r\n即\r\n将\r\n到\r\n期'}</Text>
                   </Image>
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
        height:Pixel.getPixel(130),
        position:'absolute',
        right:Pixel.getPixel(5)
    },
    pgdqFont:{
        fontSize:Pixel.getFontPixel(12),
        color:FontAndColor.white,
        marginLeft:Pixel.getPixel(11),
        marginTop:Pixel.getPixel(28)
    }
});
