import React from 'react';

import {StackNavigator} from 'react-navigation';
import RootScene from '../main/RootScene';
import LoginScene from '../login/LoginScene';
import FunctionScene from '../main/FunctionScene';
import ObdCustom from '../obdReg/ObdCustom';
import ObdCheckoutRecordFragment from '../obdReg/ObdCheckoutRecordFragment';
import ObdCarList from '../obdReg/ObdCarList';
import ObdCarDetail from '../obdReg/ObdCarDetail';
import WebScene from '../component/WebScene';
import ObdWarningExplain from '../obdReg/ObdWarningExplain';
import ObdChangeBind from '../obdReg/ObdChangeBind';

export default MyApp = StackNavigator({
        Root: {screen: RootScene},
        LoginScene: {screen: LoginScene},
        FunctionScene: {screen: FunctionScene},
        ObdCustom:{screen:ObdCustom},
        ObdCheckoutRecordFragment:{screen:ObdCheckoutRecordFragment},
        ObdCarList:{screen:ObdCarList},
        ObdCarDetail:{screen:ObdCarDetail},
        WebScene:{screen:WebScene},
        ObdWarningExplain:{screen:ObdWarningExplain},
        ObdChangeBind:{screen:ObdChangeBind},
    },
    {
        initialRouteName: 'Root',
        headerMode: 'none'
    }
);
