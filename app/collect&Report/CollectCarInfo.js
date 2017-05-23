/**
 * Created by lcus on 2017/5/11.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    KeyboardAvoidingView,
    NativeModules
} from 'react-native';
import BaseComponent from '../component/BaseComponent'
import {CollectTitle,CollectDate,CollectTitelInput,CollectButtonInput,CollectSelect,CollectOBDRFID,CollectNestTep} from './Component/CollectCarListComponent'
import * as apis from '../constant/appUrls'
import  {request} from '../utils/RequestUtil'
import {getTopdistance,STATECODE,height,adapeSize} from './Component/MethodComponet'
import {SeparatorComponent} from './Component/ListItemComponent'
import {commenStyle} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';

const [show,date,input,select,doubleClick,click] =['show','date','input','select','doubleClick','click']
const data=[

    {title:"车架号",type:show,showValue:'1231231232',key:'vin'},
    {title:'入库时间',type:date,showValue:'',placeholder:'请选择',key:'onstorge'},
    {title:'录入时间',type:date,showValue:'',placeholder:'请选择',key:'oncard'},
    {title:'车辆所有人',type:input,showValue:'',placeholder:'请输入车辆所有人',key:'owner'},
    {title:['借款人','担保人','员工','未过户'], type:select,showValue:'',key:'ownership'},
    {title:['资料已收全','随车资料未收全'], type:select,showValue:'',key:'allin'},
    {title:['抵押监管','质押监管','过户监管'], type:select,showValue:'',key:'rg_type'},
    {title:'扫描登记证',type:click,showValue:'',placeholder:'请扫描登记证',key:'regbr'},
    {title:'扫描行驶证',type:click,showValue:'',placeholder:'请扫描行驶证',key:'runbr'},
    {title:'扫描身份证',type:click,showValue:'',placeholder:'请扫描身份证',key:'carid'},
    {title:['扫描标签','扫描OBD'],type:doubleClick,showValue:'',placeholder:'请扫描标签',key:'obd_numberrfid'},
]

export  default  class CollectCarInfo extends BaseComponent{



    _dateClick=(key)=>{

        alert(key)
    }
    _scanItemClick=(key)=>{

        if(key=='runbr'){

            NativeModules.DmsCustom.scanVL((info,error)=>{console.log(info)})
        }else if(key=='regbr'){

            NativeModules.DmsCustom.scanVin((info,error)=>{console.log(info)})
        }else {

            NativeModules.DmsCustom.scanID((info,error)=>{console.log(info)})
        }


    }

    _renderItem=(data)=>{
        let tempdata =data.item;
        switch (tempdata.type){
            case show:
                return <CollectTitle title={tempdata.title} value={tempdata.showValue}/>
                break;
            case date :
                return <CollectDate title={tempdata.title} value={tempdata.showValue} placeholder={tempdata.placeholder} onPress={()=>{
                    this._dateClick(tempdata.key);
                    }
                }/>
                break;
            case input:
                return <CollectTitelInput title={tempdata.title} value={tempdata.showValue} placeholder={tempdata.placeholder}/>
                break;
            case click:
                return <CollectButtonInput title={tempdata.title} value={tempdata.showValue} placeholder={tempdata.placeholder} onPress={()=>{
                    this._scanItemClick(tempdata.key);
                    }
                }/>
             break;

            case select:

                return <CollectSelect titles={tempdata.title}/>
                break;
            case doubleClick:
                return <CollectOBDRFID/>
                break;
        }

    }
    _renderFooter=()=>{return (<SeparatorComponent/>)}

    render(){



        return(
            <View style={commenStyle.commenPage}>

                <KeyboardAvoidingView behavior={'position'}  style={commenStyle.testUI}>

                    <FlatList
                        data={data}
                        style={{height:height-getTopdistance()}}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => item.key}
                        ListFooterComponent={this._renderFooter}
                        ItemSeparatorComponent={SeparatorComponent}
                        initialNumToRender={11}
                    />

                </KeyboardAvoidingView>
                <CollectNestTep/>
                <AllNavigationView title={'收车'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>
        )

    }

}