/**
 * Created by lhc on 2017/2/17.
 */


import React, {PropTypes, PureComponent, Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Dimensions,

} from 'react-native';

export class ObdCustomItem extends PureComponent {

    render() {
        const {name, carNum, status, warningTip, textStyle, warningStyle,checkStyle,onPress, onPressCheckResult}=this.props;
        return (
            <TouchableOpacity style={ObdCustomItemStyles.container} activeOpacity={0.8} onPress={onPress}>
                <View style={ObdCustomItemStyles.container1}>
                    <Text style={{fontWeight: 'bold'}}>{name}</Text>
                    <View style={{marginTop:10, flexDirection: 'row', flex:1}}>
                        <Text style={{textAlign:'left',flex : 1}}>{carNum}</Text>
                        <View style={{flexDirection:'row'}}>
                            <Text>状态：</Text>
                            <Text style={[{color: 'black'},textStyle]}>{status}</Text>
                        </View>

                    </View>
                    <View style={{marginTop:10,flexDirection: 'row', alignItems:'center'}}>
                        <Text style={[{textAlign:'left',flex : 1},warningStyle]}>{warningTip}</Text>
                        <Text style={[ObdCustomItemStyles.checkResult, checkStyle]} onPress={onPressCheckResult}>查看审核结果</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export class ObdCarItem extends PureComponent {

    render() {
        const {modelName, vin, auto_vin_from_obd,businessType, obdNum, obdStatus, noneSubmit, textStyle,vinTextStyle, onPress}=this.props;
        return (
            <TouchableOpacity style={ObdCustomItemStyles.container} activeOpacity={0.8} onPress={onPress}>
                <View style={ObdCustomItemStyles.container1}>
                    <Text style={{fontWeight: 'bold'}}>{modelName}</Text>
                    <Text style={{marginTop:5}}>{vin}</Text>
                    <View style={{flexDirection:'row', marginTop:5}}>
                        <Text>识别车架号：</Text>
                        <Text style={vinTextStyle}>{auto_vin_from_obd}</Text>
                    </View>
                    <Text style={{marginTop:5}}>{businessType}</Text>
                    <Text style={{marginTop:5}}>{obdNum}</Text>
                    <View style={{marginTop:5,flexDirection: 'row', alignItems:'center'}}>
                        <View style={{flexDirection:'row', marginRight: 20}}>
                            <Text>OBD状态：</Text>
                            <Text style={textStyle}>{obdStatus}</Text>
                        </View>
                        <Text style={{color: 'red'}}>{noneSubmit}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export class ObdCarDetailTable extends PureComponent {

    render() {
        const {obdNum, explains, time, warningStatus, borderStyle}=this.props;
        return (
            <View style={[ObdCustomItemStyles.tableContain, borderStyle]}>
                <View style={[ObdCustomItemStyles.rightLine,{flex:0.18}]}>
                    <View style={ObdCustomItemStyles.tableView}>
                        <Text >{warningStatus}</Text>
                    </View>
                </View>
                <View style={[ObdCustomItemStyles.rightLine,{flex:0.35}]}>
                    <View style={ObdCustomItemStyles.tableView}>
                        <Text >{time}</Text>
                    </View>
                </View>
                <View style={[ObdCustomItemStyles.rightLine,{flex:0.2}]}>
                    <View style={ObdCustomItemStyles.tableView}>
                        <Text >{obdNum}</Text>
                    </View>
                </View>
                <Text style={{flex:0.3, textAlign: 'center'}}>{explains}</Text>
            </View>

        )
    }
}

export class ObdCheckoutRecordTable extends PureComponent {

    render() {
        const {userName, explains, time, record, borderStyle}=this.props;
        return (
            <View style={[ObdCustomItemStyles.tableContain, borderStyle]}>
                <View style={[ObdCustomItemStyles.rightLine,{flex:0.38}]}>
                    <View style={ObdCustomItemStyles.tableView}>
                        <Text style={{fontSize:11, paddingVertical:5}}>{time}</Text>
                    </View>
                </View>
                <View style={[ObdCustomItemStyles.rightLine,{flex:0.12}]}>
                    <View style={ObdCustomItemStyles.tableView}>
                        <Text style={{fontSize:11, paddingVertical:5}}>{userName}</Text>
                    </View>
                </View>
                <View style={[ObdCustomItemStyles.rightLine,{flex:0.2}]}>
                    <View style={ObdCustomItemStyles.tableView}>
                        <Text style={{fontSize:11, paddingVertical:5}}>{record}</Text>
                    </View>
                </View>
                <Text style={{flex:0.3, textAlign: 'center',fontSize:11,paddingVertical:5}}>{explains}</Text>
            </View>

        )
    }
}

let ObdCustomItemStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: 'white',
    },
    container1: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        margin: 10,
    },
    checkResult: {
        padding: 2,
        backgroundColor: '#08c5a7',
        color: 'white',
        textAlign: 'center'
    },
    tableContain: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        marginHorizontal: 10,
        alignItems: 'center',
        borderTopWidth:1,
        borderLeftWidth:1,
        borderRightWidth:1,
        borderColor: '#D8D8D8',
    },
    rightLine: {
        borderRightWidth: 1,
        borderRightColor: '#D8D8D8',
    },
    tableView:{
        flex: 1,
        alignItems:'center',
        justifyContent:'center'
    },
    warningText:{

    }
})