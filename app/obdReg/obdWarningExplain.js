import React, {Component} from 'react';
import {AppRegistry, Text, View, Image, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
const shareIcon = require('../../images/login_logs.png');

export  default class ObdWarningExplain extends Component {
    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.state = {text: ''};

    }

    onContentSizeChange(event) {
        this.setState({height: event.nativeEvent.contentSize.height});
    }

    render() {
        return (
            <View style={styles.contain}>
                <View style={styles.wainingExplain}>
                    <Text style={{marginRight: 3, marginLeft:10, color:'black'}}>异常说明:</Text>
                    <TextInput
                        multiline={true}
                        style={{flex:1, flexWrap: 'wrap', height:this.state.height}}
                        placeholder={'请输入异常类说明'}
                        onContentSizeChange={this.onContentSizeChange.bind(this)}
                        underlineColorAndroid={"#00000000"}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text}
                    />
                </View>
                <View style={styles.carPicture}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{color:'red',marginRight:3}}>*</Text>
                        <Text style={{flex:1}}>车辆照片 （体现防伪标签和车架号）</Text>
                        <TouchableOpacity style={styles.photoButton} onPress={this.takePhoto}>
                            <Text style={{color:'white'}}>拍照</Text>
                        </TouchableOpacity>
                    </View>
                    <Image style={styles.image} source={shareIcon}/>
                </View>
                <View style={{flex:1}}></View>
                <View style={{flexDirection:'row', margin:10}}>
                    <TouchableOpacity style={styles.cancelButton} onPress={this.cancel}>
                        <Text style={{color:'black',fontSize:16}}>取消</Text>
                    </TouchableOpacity>
                    <View style={{flex:1}}></View>
                    <TouchableOpacity style={styles.saveButton} onPress={this.save}>
                        <Text style={{color:'white',fontSize:16}}>保存</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    takePhoto = () => {
        alert('拍照');
    }
    cancel = () => {
        alert('拍照');
    }
    save = () => {
        alert('拍照');
    }

}

let styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    wainingExplain: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        paddingVertical: 12
    },
    image: {
        height: 90,
        width: 100,
        marginTop: 10,
        marginLeft: 20
    },
    photoButton: {
        backgroundColor: '#08c5a7',
        borderRadius: 3,
        width: 65,
        height: 30,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cancelButton: {
        backgroundColor: 'white',
        borderRadius: 3,
        width: 75,
        height: 35,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:'black',
        borderWidth:1
    },
    saveButton: {
        backgroundColor: '#08c5a7',
        borderRadius: 3,
        width: 75,
        height: 35,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    carPicture: {
        backgroundColor: 'white',
        padding: 10
    },

})