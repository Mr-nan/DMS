import React, {Component} from 'react';
import {AppRegistry, ListView, Text, View, StyleSheet} from 'react-native';
import {ObdCheckoutRecordTable} from '../component/ComponentBlob'
import BaseComponent from '../component/BaseComponent';
import {request} from '../utils/RequestUtil';
import * as Urls from '../constant/appUrls';
import * as fontAndColor from '../constant/fontAndColor';
import  PixelUtil from '../utils/PixelUtil'
import AllNavigationView from '../component/AllNavigationView';
var Pixel = new PixelUtil();
let allSouce = [];

export  default class ObdCheckoutRecordFragment extends BaseComponent {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: {},
            renderPlaceholderOnly: 'blank',
            isRefreshing: false
        };
    }

    initFinish() {
        allSouce=[];
        this.props.screenProps.showModal(true);
        this.getData();
    }

    getData = () => {
        let maps = {
            // merge_threshold_warn_record_id: '20',
            merge_threshold_warn_record_id: this.props.navigation.state.params.merge_threshold_warn_record_id,
        };
        request(Urls.OBD_CHECKOUT_RECORD, 'Post', maps)

            .then((response) => {
                    this.props.screenProps.showModal(false);
                    if (response.mjson.retdata == '' || response.mjson.retdata == null) {
                        this.props.screenProps.showToast('数据为空！');
                    }
                    if (response.mjson.retdata.list.length <= 0) {
                        this.props.screenProps.showToast('数据为空！');
                    } else {
                        allSouce.push({
                            audit_time: '审核时间',
                            audit_user_name: '审核人',
                            audit_status_text: '审核意见',
                            audit_remark: '审核记录',
                        })
                        allSouce.push(...response.mjson.retdata.list);
                        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({
                            dataSource: ds.cloneWithRows(allSouce),
                            isRefreshing: false
                        });
                        this.setState({renderPlaceholderOnly: 'success'});
                    }
                },
                (error) => {
                    this.props.screenProps.showModal(false);
                    this.props.screenProps.showToast(error.mjson.retmsg);
                });
    }

    render() {
        if (this.state.renderPlaceholderOnly !== 'success') {
            return (<View style={{backgroundColor: fontAndColor.COLORA3, flex: 1, paddingTop: Pixel.getPixel(15)}}>
                <AllNavigationView title={this.props.navigation.state.params.name} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>);
        } else {
            return (
                <View style={styles.container}>
                    <View style={{flex:1}}>
                        <Text style={styles.textStyle}>审核记录</Text>
                        <ListView
                            contentContainerStyle={styles.listStyle}
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow}
                            enableEmptySections = {true}
                        />
                    </View>

                    <AllNavigationView title={this.props.navigation.state.params.name} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
                </View>
            );
        }
    }

    renderRow = (rowData, sectionID, rowId) => {
        return (

            <ObdCheckoutRecordTable
                borderStyle={rowId==(this.state.dataSource.length-1) ? {borderBottomWidth: 1}:null}
                time={rowData.audit_time}
                userName={rowData.audit_user_name} record={rowData.audit_status_text}
                explains={rowData.audit_remark}
            />);

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Pixel.getPixel(0),   //设置listView 顶在最上面
        backgroundColor: fontAndColor.COLORA3,
    },
    listStyle: {
        marginTop: Pixel.getPixel(10)
    },
    textStyle: {
        marginTop: Pixel.getTitlePixel(68),
        marginLeft: Pixel.getPixel(15),
    }
});
