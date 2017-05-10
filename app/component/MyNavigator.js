import React from 'react';

import {StackNavigator} from 'react-navigation';
import RootScene from '../main/RootScene';
import LoginScene from '../login/LoginScene';
import FunctionScene from '../main/FunctionScene';
import ObdCustom from '../obdReg/ObdCustom';

export default MyApp = StackNavigator({
        Root: {screen: RootScene},
        LoginScene: {screen: LoginScene},
        FunctionScene: {screen: FunctionScene},
        ObdCustom:{screen:ObdCustom}
    },
    {
        initialRouteName: 'Root',
        headerMode: 'none'
    }
);
