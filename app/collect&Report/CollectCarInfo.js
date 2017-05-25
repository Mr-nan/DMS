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
import {getTopdistance,STATECODE,height,adapeSize,dateFormat} from './Component/MethodComponet'
import {SeparatorComponent} from './Component/ListItemComponent'
import {commenStyle} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';
import DateTimePicker from 'react-native-modal-datetime-picker'
const [show,date,input,select,doubleClick,click] =['show','date','input','select','doubleClick','click']

import SQLiteUtil from '../utils/SQLiteUtil';
const SQLite = new SQLiteUtil();
export  default  class CollectCarInfo extends BaseComponent{


    initFinish(){

        SQLite.createTable();


        SQLite.selectData('SELECT * FROM carCollectInfo WHERE vin= ?',[this.props.navigation.state.params.carFrameNumber],
            (data)=>{

            if(data.code==1){
                if(data.result.rows.length==0){

                    SQLite.changeData('INSERT INTO carCollectInfo (vin) VALUES(?)',[this.props.navigation.state.params.carFrameNumber])
                }else {

                    console.log(data.result.rows.item(0));
                }

            }

            }

        )
    }
    data=[

        {title:"车架号",type:show,showValue:this.props.navigation.state.params.carFrameNumber,key:'vin'},
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
    tempTimeKeyType='';
    cttBlobs={}
    state={
        isdatePikershow:false
    }

    _handleDatePicked=(date)=>{

        let fdate=dateFormat(date,'yyyy-MM-dd')
        if(this.tempTimeKeyType=='onstorge'){
            this.cttBlobs['onstorge'].setText(fdate)
            SQLite.changeData('UPDATE carCollectInfo SET onstorge=? WHERE vin=?',[fdate,this.props.navigation.state.params.carFrameNumber])

        }else if (this.tempTimeKeyType=='oncard'){
            this.cttBlobs['oncard'].setText(fdate);
            SQLite.changeData('UPDATE carCollectInfo SET oncard=? WHERE vin=?',[fdate,this.props.navigation.state.params.carFrameNumber])
        }
        this.setState({
            isdatePikershow:false
        })

    }
    _hideDateTimePicker=()=>{

        this.setState({
            isdatePikershow:false
        })

    }
    _dateClick=(key)=>{

        this.tempTimeKeyType=key;
        this.setState({
            isdatePikershow:true
        })
    }
    _selctIndex=(index)=>{

    }
    _scanItemClick=(key)=>{
//登记证
        if(key=='regbr'){

            NativeModules.DmsCustom.qrScan((info,error)=>{

                this.cttBlobs['regbr'].setTitle(info)
                SQLite.changeData('UPDATE carCollectInfo SET regbr=? WHERE vin=?',[info,this.props.navigation.state.params.carFrameNumber])
            })
        }
//行驶证
        else if(key=='runbr'){

            NativeModules.DmsCustom.scanVL((info,error)=>{

                this.cttBlobs['runbr'].setTitle(info.carVl)
                SQLite.changeData('UPDATE carCollectInfo SET runbr=? WHERE vin=?',[info.carVl,this.props.navigation.state.params.carFrameNumber])
            })

        }
//身份证
        else if(key=='carid') {

            NativeModules.DmsCustom.scanID((info, error) => {
                this.cttBlobs['carid'].setTitle(info)
                SQLite.changeData('UPDATE carCollectInfo SET carid=? WHERE vin=?',[info.carVl,this.props.navigation.state.params.carFrameNumber])
            })
        }

    }

    _renderItem=(data)=>{
        let tempdata =data.item;
        switch (tempdata.type){
            case show:
                return <CollectTitle title={tempdata.title} value={tempdata.showValue} />
                break;
            case date :
                return <CollectDate title={tempdata.title} value={tempdata.showValue} ref={(title)=>{this.cttBlobs[tempdata.key]=title}} placeholder={tempdata.placeholder} onPress={()=>{
                    this._dateClick(tempdata.key);
                    }
                }/>
                break;
            case input:
                return <CollectTitelInput  title={tempdata.title} value={tempdata.showValue} placeholder={tempdata.placeholder} onEndEditing={(event)=>{

                    SQLite.changeData('UPDATE carCollectInfo SET owner=? WHERE vin=?',[event.nativeEvent.text,this.props.navigation.state.params.carFrameNumber])
                }
                }/>
                break;
            case click:
                return <CollectButtonInput title={tempdata.title} value={tempdata.showValue} placeholder={tempdata.placeholder} ref={(button)=>{this.cttBlobs[tempdata.key]=button}} onPress={()=>{
                    this._scanItemClick(tempdata.key);
                    }
                }/>
             break;
            case select:
                return <CollectSelect titles={tempdata.title} selectedIndex={this._selctIndex}/>
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

                <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-100} style={commenStyle.testUI}>

                    <FlatList
                        data={this.data}
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
                <DateTimePicker
                    isVisible={this.state.isdatePikershow}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                    titleIOS="请选择日期"
                    confirmTextIOS='确定'
                    cancelTextIOS='取消'
                    minimumDate= {new Date()}
                />
            </View>
        )

    }

}