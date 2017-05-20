/**
 * Created by Administrator on 2017/5/20.
 */
import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    ListView,
    Dimensions
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import * as FontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
const {width} = Dimensions.get('window');
import * as Net from '../utils/RequestUtil';
import * as appUrls from '../constant/appUrls';

export default class CarBrandSelectScene extends BaseComponent{

    constructor(props){
        super(props);

        let getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        let getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ":" + rowID];
        };

        const dataSource = new ListView.DataSource({
            getSectionData: getSectionData,
            getRowData: getRowData,
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            dataSource: dataSource,
            sectionTitleArray: [],
        };
    }

    initFinish = ()=>{
        Net.request(appUrls.AUTOGETBRANDLIST,'post',{}).then(
            (response)=>{
                let rb = response.mjson.retdata;
                this._setBrandList(rb);
            },
            (error)=>{

            }
        )
    };

    _setBrandList = (rb)=>{

        //按字母排序
        let iChars = [];
        let groups = [];
        rb.map((r)=>{
            let flag = true;
            iChars.map((c)=>{
                if(c === r.brand_initial){
                    flag = false;
                }
            });
            if(flag) iChars.push(r.brand_initial);
        });

        iChars.sort();
        iChars.map((ic)=>{
            let cars = [];
            rb.map((r)=>{
                if(r.brand_initial === ic){
                    cars.push(r);
                }
            });
            groups.push({
                title:ic,
                car:cars
            });
        });


        //生成ListView数据源
        let dataBlob = {}, sectionIDs = [], rowIDs = [], cars = [], sectionTitleArray = [];
        for (var i = 0; i < groups.length; i++) {
            //把组号放入sectionIDs数组中
            sectionIDs.push(i);
            //把组中内容放入dataBlob对象中
            dataBlob[i] = groups[i].title;
            sectionTitleArray.push(groups[i].title);
            //把组中的每行数据的数组放入cars
            cars = groups[i].car;
            //先确定rowIDs的第一维
            rowIDs[i] = [];
            //遍历cars数组,确定rowIDs的第二维
            for (var j = 0; j < cars.length; j++) {
                rowIDs[i].push(j);
                //把每一行中的内容放入dataBlob对象中
                dataBlob[i + ':' + j] = cars[j];
            }

        }

        this.carData = groups;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
            sectionTitleArray: sectionTitleArray,
        });

    };

    // 每一组对应的数据
    renderSectionHeader = (sectionData, sectionId) => {

        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionText}>{sectionData}</Text>
            </View>
        );
    };

    // 每一行中的数据
    renderRow = (rowData, sectionID, rowID) => {
        return (
            <View style={styles.rowCell}>
                <Image style={styles.rowCellImag}
                       source={{uri:rowData.brand_icon}} />
                <Text style={styles.rowCellText}>{rowData.brand_name}</Text>
            </View>
        )
    };

    render(){
        return(
            <ListView ref="listView"
                      dataSource={this.state.dataSource}
                      renderRow={this.renderRow}
                      renderSectionHeader={this.renderSectionHeader}
                      pageSize={100}
            />
        );
    }


}

const styles =StyleSheet.create({
    container: {
        flex: 1
    },
    wrapContainer: {
        flex: 1,
        marginTop: Pixel.getTitlePixel(68),
        backgroundColor: FontAndColor.all_background
    },
    sectionHeader: {
        backgroundColor: FontAndColor.COLORA3,
        height: Pixel.getPixel(40),
        justifyContent: 'center'
    },
    sectionText: {
        marginLeft: Pixel.getPixel(31),
        color: FontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
    },
    rowCell: {

        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: FontAndColor.COLORA3,
        height: Pixel.getPixel(44),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',

    },
    rowCellImag: {
        width: Pixel.getPixel(40),
        height: Pixel.getPixel(40),
        marginLeft: Pixel.getPixel(15),
    },
    rowCellText: {
        marginLeft: Pixel.getPixel(5),
        color: FontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
    },

});