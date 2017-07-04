/**
 * Created by lcus on 2017/5/11.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    KeyboardAvoidingView,
    NativeModules,
    NativeAppEventEmitter
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

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this. state={
            isdatePikershow:false,
            data:[],
            renderModel:STATECODE.loading
        }
      }
    tempTimeKeyType='';
    cttBlobs={}
    current_obd_rfid='1';

    componentWillUnmount() {
        readData.remove();

    }

    initFinish() {

        readData = NativeAppEventEmitter.addListener(
            'onReadData',
            (reminder) => {

                this.rfid._setTitle(reminder.result)
                SQLite.changeData('UPDATE carCollectInfo SET rfid=? WHERE vin=?', [reminder.result, this.props.navigation.state.params.carFrameNumber])
            }
        );

        SQLite.selectData('SELECT * FROM carCollectInfo WHERE vin= ?', [this.props.navigation.state.params.carFrameNumber], (data) => {




            if (data.code == 1) {

                if (data.result.rows.length == 0) {
                    console.log('执行了插入');
                    SQLite.changeData('INSERT INTO carCollectInfo (vin,store_type) VALUES(?,?)', [this.props.navigation.state.params.carFrameNumber,'1'])
                    this.setState({
                        data:[
                            {title:"车架号",type:show,showValue:this.props.navigation.state.params.carFrameNumber,key:'vin'},
                            {title:'入库时间',type:date,showValue:"",placeholder:'请选择',key:'onstorge'},
                            {title:'录入时间',type:date,showValue:"",placeholder:'请选择',key:'oncard'},
                            {title:'车辆所有人',type:input,showValue:"",placeholder:'请输入车辆所有人',key:'owner'},
                            {title:['借款人','担保人','员工','未过户'], type:select,showValue:'1',key:'ownership'},
                            {title:['资料已收全','随车资料未收全'], type:select,showValue:'1',key:'allin'},
                            {title:['抵押监管','质押监管','过户监管'], type:select,showValue:'1',key:'rg_type'},
                            {title:'扫描登记证',type:click,showValue:"",placeholder:'请扫描登记证',key:'regbr'},
                            {title:'扫描行驶证',type:click,showValue:"",placeholder:'请扫描行驶证',key:'runbr'},
                            {title:'扫描身份证',type:click,showValue:"",placeholder:'请扫描身份证',key:'id_card'},
                            {title:['扫描标签','扫描OBD'],type:doubleClick,showValue:'',placeholder:'请扫描标签',key:'obd_numberrfid',selcetType:"1",
                                obd_number:"",rfid:""},
                        ],
                        renderModel:STATECODE.loadSuccess
                    })
                }else if(data.result.rows.length>0){
                    let cacheData = data.result.rows.item(0);
                    this.current_obd_rfid=cacheData.store_type;
                    this.setState({
                        data:[
                            {title:"车架号",type:show,showValue:this.props.navigation.state.params.carFrameNumber,key:'vin'},
                            {title:'入库时间',type:date,showValue:cacheData.onstorge,placeholder:'请选择',key:'onstorge'},
                            {title:'录入时间',type:date,showValue:cacheData.oncard,placeholder:'请选择',key:'oncard'},
                            {title:'车辆所有人',type:input,showValue:cacheData.owner,placeholder:'请输入车辆所有人',key:'owner'},
                            {title:['借款人','担保人','员工','未过户'], type:select,showValue:cacheData.ownership?cacheData.ownership:'1',key:'ownership'},
                            {title:['资料已收全','随车资料未收全'], type:select,showValue:cacheData.allin?cacheData.allin:'1',key:'allin'},
                            {title:['抵押监管','质押监管','过户监管'], type:select,showValue:cacheData.rg_type?cacheData.rg_type:'1',key:'rg_type'},
                            {title:'扫描登记证',type:click,showValue:cacheData.regbr,placeholder:'请扫描登记证',key:'regbr'},
                            {title:'扫描行驶证',type:click,showValue:cacheData.runbr,placeholder:'请扫描行驶证',key:'runbr'},
                            {title:'扫描身份证',type:click,showValue:cacheData.id_card,placeholder:'请扫描身份证',key:'id_card'},
                            {title:['扫描标签','扫描OBD'],type:doubleClick,showValue:'',placeholder:'请扫描标签',key:'obd_numberrfid',selcetType:cacheData.store_type,
                                obd_number:cacheData.obd_number,rfid:cacheData.rfid},
                        ],
                        renderModel:STATECODE.loadSuccess
                    })
                }



            }

        })
    }

    //日期
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
     _dateClick=(key)=>{

        this.tempTimeKeyType=key;
        this.setState({

            isdatePikershow:true
        })
    }



    _hideDateTimePicker=()=>{

        this.setState({
            isdatePikershow:false
        })

    }
    _selctIndex=(index,itemKey)=>{

        SQLite.changeData('UPDATE carCollectInfo SET '+itemKey+'=? WHERE vin=?',[index+1,this.props.navigation.state.params.carFrameNumber])
    }


    _markScan=()=>{

        SQLite.changeData('UPDATE carCollectInfo SET store_type=? WHERE vin=?',['2',this.props.navigation.state.params.carFrameNumber])
            this.toNextPage('BluetoothScene',{onReadData:()=>{},isConnection:()=>{},onBlueConnection:()=>{}})
    }
    _obdScan=()=>{


        SQLite.changeData('UPDATE carCollectInfo SET store_type=? WHERE vin=?',['1',this.props.navigation.state.params.carFrameNumber])
        NativeModules.DmsCustom.qrScan((info)=>{
            this.rfid._setTitle(info.suc)
            SQLite.changeData('UPDATE carCollectInfo SET obd_number=? WHERE vin=?',[info.suc,this.props.navigation.state.params.carFrameNumber])
        })
    }

    _scanItemClick=(key)=>{
//登记证
        if(key=='regbr'){

            NativeModules.DmsCustom.qrScan((info)=>{

                this.cttBlobs['regbr'].setTitle(info.suc)
                SQLite.changeData('UPDATE carCollectInfo SET regbr=? WHERE vin=?',[info.suc,this.props.navigation.state.params.carFrameNumber])
            })
        }
//行驶证
        else if(key=='runbr'){

            NativeModules.DmsCustom.scanVL((info)=>{

                this.cttBlobs['runbr'].setTitle(info.suc.carVl)
                SQLite.changeData('UPDATE carCollectInfo SET runbr=? WHERE vin=?',[info.suc.carVl,this.props.navigation.state.params.carFrameNumber])
            })

        }
//身份证
        else if(key=='id_card') {

            NativeModules.DmsCustom.scanID((info) => {
                this.cttBlobs['id_card'].setTitle(info.suc)
                SQLite.changeData('UPDATE carCollectInfo SET id_card=? WHERE vin=?',[info.suc,this.props.navigation.state.params.carFrameNumber])
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
                    this._scanItemClick(tempdata.key)
                    }
                }/>
             break;
            case select:
                return <CollectSelect titles={tempdata.title} selectedIndex={this._selctIndex} itemKey={tempdata.key} defaultSelct={tempdata.showValue}/>
                break;
            case doubleClick:
                return <CollectOBDRFID markScan={this._markScan} OBDScan={this._obdScan} ref={(c)=>{this.rfid=c} } selectType={tempdata.selcetType} obdNumber={tempdata.obd_number} rfid={tempdata.rfid}/>
                break;
        }

    }
    _renderFooter=()=>{return (<SeparatorComponent/>)}

    render(){

        if(this.state.renderModel==STATECODE.loading){

            return (
                <View style={commenStyle.commenPage}>
                    <AllNavigationView title={'收车'} backIconClick={() => {
                        this.backPage();
                    }} parentNavigation={this}/>
                </View>
            )
        }

        return(
            <View style={commenStyle.commenPage}>

                <View style={commenStyle.testUI}>

                    <FlatList
                        style={{height:height-getTopdistance()}}
                        data={this.state.data}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => item.key}
                        ListFooterComponent={this._renderFooter}
                        ItemSeparatorComponent={SeparatorComponent}
                        initialNumToRender={11}
                    />
                </View>
                <CollectNestTep onPress={()=>{

                    this.toNextPage('CollectCarPhoto',{'vin':this.props.navigation.state.params.carFrameNumber,baseID:this.props.navigation.state.params.baseID,
                        carId:this.props.navigation.state.params.carId,type:this.props.navigation.state.params.type});
                }}/>
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