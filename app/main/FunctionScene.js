/**
 * Created by Administrator on 2017/5/9.
 */
import React from 'react';
import{
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../constant/fontAndColor';
import StorageUtil from '../utils/StorageUtil';
import * as StorageKeyNames from '../constant/storageKeyNames';
import Grid from '../component/Grid';
const {width} = Dimensions.get('window');

const clpg = require('../../images/clpg.png');
const clrk = require('../../images/clrk.png');
const pk = require('../../images/pk.png');
const sc = require('../../images/sc.png');
const xcbg = require('../../images/xcbg.png');
const obd_jg = require('../../images/obd_jg.png');

export default class FunctionScene extends BaseComponent {

    constructor(props) {
        super(props);
        this.funcs =[];
    }

    initFinish = () => {
        StorageUtil.mGetItem(StorageKeyNames.USER_FUNCTION, (data) => {
            if (data.code == 1) {
                let func = JSON.parse(data.result);
                if(func.auto_assess == '1'){
                    this.funcs.push('车辆评估');
                }
                if(func.close_the_car == '1'){
                    this.funcs.push('收车');
                }
                if(func.check_car == '1'){
                    this.funcs.push('盘库');
                }
                if(func.vehicle_storage == '1'){
                    this.funcs.push('车辆建档');
                }
                if(func. patrol_report == '1'){
                    this.funcs.push('巡查报告');
                }
                if(func.auto_assess == '1'){
                    this.funcs.push('OBD监管');
                }
                this.funcGrid.refresh(this.funcs);
            }
        });

    };

    _itemClick = (type)=>{
        switch(type)
        {
            case 1:
                break;
            case 2:
                this.toNextPage('CustomerList',{});
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                this.toNextPage('ObdCustom',{});
                break;
        }
    };

    _renderItem = (data, i)=>{
        let type,img;
        if(data == '车辆评估'){
            img = clpg;
            type = 1;
        }else if(data == '收车'){
            img = sc;
            type = 2;
        }else if(data == '盘库'){
            img = pk;
            type = 3;
        }else if(data == '车辆建档'){
            img = clrk;
            type = 4;
        }else if(data == '巡查报告'){
            img = xcbg;
            type = 5;
        }else if(data == 'OBD监管'){
            img = obd_jg;
            type = 6;
        }
        return(
            <TouchableOpacity
                key={i+''}
                style={styles.item_container}
                activeOpacity={0.6}
                onPress={()=>{this._itemClick(type)}}
            >
                <Image style={styles.imgContainer} source={img}/>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={styles.fontLabel}>{data}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    render() {
        return (
            <View style={styles.container}>
                <AllNavigationView title={'第1车贷'} backIconClick={() => {
                    this.backPage();
                }} rightFootClick={()=>{}}/>
                <View style={styles.wrapContainer}>
                    <View style={{flex:1,width:width,paddingHorizontal:Pixel.getPixel(30)}}>
                        <Grid
                            ref={(grid)=>{this.funcGrid = grid}}
                            style={styles.girdContainer}
                            renderItem={this._renderItem}
                            data={this.funcs}
                            itemsPerRow={3}
                        />
                    </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapContainer: {
        flex: 1,
        marginTop: Pixel.getPixel(48),
        backgroundColor: fontAndColor.all_background,
        alignItems: 'center'
    },
    girdContainer: {
        flex: 1,
    },
    itemContainer:{
        width:Pixel.getPixel(100),
        height:Pixel.getPixel(150),
        justifyContent:'center',
        alignItems:'center',
        marginTop:Pixel.getPixel(20),
        backgroundColor:'red'
    },
    imgContainer:{
        width:Pixel.getPixel(70),
        height:Pixel.getPixel(70),
        marginTop:Pixel.getPixel(30),
    },
    fontLabel:{
        fontSize:Pixel.getFontPixel(14),
        color:fontAndColor.black,
        marginTop:Pixel.getPixel(8)
    }

});
