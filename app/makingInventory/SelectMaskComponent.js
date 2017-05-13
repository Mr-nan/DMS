/**
 * Created by Administrator on 2017/2/13.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    ListView
} from 'react-native';

import * as fontAndColor from '../constant/fontAndColor';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
const {width, height} = Dimensions.get('window');

export default class SelectMaskComponent extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.props.viewData),
            modalVisible: false
        };
    }

    changeData = (data) => {
        console.log(data);
        this.setState({
            dataSource: this.ds.cloneWithRows(data)
        })
    };


    _hideModal = () => {
        console.log('1');
        this.setState({
            modalVisible: false
        });
    };

    openModal = () => {
        this.setState((preState, props) => ({
            modalVisible: true
        }));
    };

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                }}>
                <TouchableOpacity style={styles.container} onPress={this._hideModal}>

                        <ListView
                            contentContainerStyle={{marginTop:Pixel.getFontPixel(48)}}
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow}
                        />
                </TouchableOpacity>
            </Modal>
        );
    }


    // 每一行中的数据
    _renderRow = (rowData, sectionID, rowID) => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                key={rowID}
                onPress={()=> {
                    this.props.onClick(rowID),this._hideModal()
                }}>
                <View style={styles.rowStyle}>
                    <RadioGroup
                        size={18}
                        thickness={2}
                        style={{flexDirection:'row',alignItems: 'center'}}
                        color='red'>
                        <RadioButton>
                            <Text>{rowData.name}</Text>
                        </RadioButton>
                    </RadioGroup>
                </View>
            </TouchableOpacity>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        width: width,
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowStyle: {
        flex: 1,
        backgroundColor: 'white',
        width: width * 0.8,
        flexDirection: 'row'
    },
    fontMain: {
        color: '#000000',
        fontSize: Pixel.getFontPixel(14)
    },
});



