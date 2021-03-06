/**
 * Created by Administrator on 2017/5/8.
 */
import React, {Component,PureComponent} from 'react';
import {
    View,

} from 'react-native';

import MyNavigator  from './component/MyNavigator';
import ShowToast from './component/toast/ShowToast';

export default class root extends Component {

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <MyNavigator
                    ref = {(ref)=>{this.myNav = ref}}
                    screenProps={{
                        showModal: this.showModal,
                        showToast: this.showToast,
                        showMenu:this.showMenu,
                        getRoute:this.getRoutes
                    }}/>
                <ShowToast ref={(toast)=>{this.toast = toast}} msg={''}></ShowToast>
            </View>
        );
    }

    showToast = (content) => {
        this.toast.changeType(ShowToast.TOAST, content);
    };

    showModal = (value) => {
        this.toast.showModal(value);
    };

    getRoutes = ()=>{
        return this.myNav.state.nav.routes;
    }

}