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

import CustomerList from '../collect&Report/CustomerList'
import CustomerItemCarList from '../collect&Report/CustomerItemCarList'
import ReportCustomerList from '../collect&Report/ReportCustomerList'
import VersionInfo from '../collect&Report/VersionInfo'
import ReportInfoManage from '../collect&Report/ReportInfoManage'
import ReporInfoPeople from '../collect&Report/ReporInfoPeople'
import ReporInfoFkong from '../collect&Report/ReporInfoFkong'
import CarCheckCustomer from '../makingInventory/CarCheckCustomer';
import CarCheckWifiSelect from '../makingInventory/CarCheckWifiSelect';
import CarCheckNoWifiList from '../makingInventory/CarCheckNoWifiList';
import CarCheckWarning from '../makingInventory/CarCheckWarning';
import AssessCustomerScene from '../assess/AssessCustomerScene';

import BluetoothScene from '../main/BluetoothScene';

import SelectMaskComponent from '../makingInventory/SelectMaskComponent';

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
        CustomerList:{screen:CustomerList},
        CarCheckCustomer:{screen:CarCheckCustomer},
        CarCheckWifiSelect:{screen:CarCheckWifiSelect},
        CarCheckNoWifiList:{screen:CarCheckNoWifiList},
        CarCheckWarning:{screen:CarCheckWarning},

        CustomerItemCarList:{screen:CustomerItemCarList},
        ReportCustomerList:{screen:ReportCustomerList},

        AssessCustomerScene:{screen:AssessCustomerScene},
        VersionInfo:{screen:VersionInfo},

        BluetoothScene:{screen:BluetoothScene},
        SelectMaskComponent:{screen:SelectMaskComponent},
        ReportInfoManage:{screen:ReportInfoManage},
        ReporInfoPeople:{screen:ReporInfoPeople},
        ReporInfoFkong:{screen:ReporInfoFkong}
    },
    {
        initialRouteName: 'Root',
        headerMode: 'none'
    }
);
