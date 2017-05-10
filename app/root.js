/**
 * Created by Administrator on 2017/5/8.
 */
import React, {Component} from 'react';
import {
    View
} from 'react-native';

import MyNavigator  from './component/MyNavigator';
import ShowToast from "./component/toast/ShowToast";

export default class root extends Component {

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MyNavigator
                    screenProps={{
                        showToast: this.showToast,
                        showModal: this.showModal
                    }}/>
                <ShowToast ref='toast' msg={''}></ShowToast>
            </View>
        );
    }

    showToast = (content) => {
        this.refs.toast.changeType(ShowToast.TOAST, content);
    };

    showModal = (value) => {
        this.refs.toast.showModal(value);
    }

}