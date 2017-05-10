import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'

export  default class ObdChangeBind extends Component {

    constructor() {
        super()
        this.state = {
            index: 0
        }
        this.onSelect = this.onSelect.bind(this)
    }

    onSelect(index) {
        this.setState({
            index: index
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.blueTooth}>
                    <Text style={{flex: 1, textAlign:'center'}}>设备未连接</Text>
                </View>

                <RadioGroup
                    size={18}
                    thickness={2}
                    color='red'
                    selectedIndex={0}
                    style={styles.radioGroup}
                    onSelect={(index) => this.onSelect(index)}
                >
                    <RadioButton>
                        <Text>扫描标签</Text>
                    </RadioButton>

                    <RadioButton>
                        <Text>扫描OBD</Text>
                    </RadioButton>

                </RadioGroup>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0'
    },
    text: {
        padding: 10,
        fontSize: 16,
    },
    blueTooth: {
        flexDirection: 'row',
        backgroundColor: '#F6F693',
        paddingVertical: 5,
    },
    radioGroup: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 6,
        justifyContent:'space-around'
    },
})
