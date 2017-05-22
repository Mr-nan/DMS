/**
 * Created by lcus on 2017/5/10.
 */
import React, {Component} from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import BaseComponent from '../component/BaseComponent'
import * as apis from '../constant/appUrls'
import  {request} from '../utils/RequestUtil'
import {STATECODE,addition,getDefaultValue} from './Component/MethodComponet'
import {commenStyle,repStyles} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';
import {RepDetailListHeader,RepListFootComponent,RepRateInput,RepBordeInput} from './Component/ListItemComponent'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'

const [option,input,optionInput,rateInput,rate]=['option','input','optionInput','rateInput','rate'];
let repoData =require('./Component/RepData.json')

let allKeys=['biz_situation','place_status','main_biz_status','main_price_range',"rate",
    'has_main_supplier','rateInput','showroom_entering_status','transfer_custom','avg_turnover_days',
    'area_atd_compare','area_profit_compare','auto_ownership_status','auto_pledge_status','other_credit_status','salary_payment_status'];

export default class ReportInfoManage extends BaseComponent{

        state = {

            renderPlaceholderOnly:STATECODE.loading,
        };
        PostData={
            biz_situation: '0',
            place_status: '0',
            main_biz_status: '0',
            main_price_range: '0',
            showroom_entering_status: '0',
            transfer_custom: '0',
            area_atd_compare: '0',
            area_profit_compare: '0',
            auto_ownership_status: '0',
            auto_pledge_status: '0',
            other_credit_status: '0',
            salary_payment_status: '0',
            sub_status: "0",
            credit_line: '0',
            loan_balance: '0',
            reg_auto_num: '0',
            reg_auto_sum: '0',
            sub_user_id: '0',
            wholesale_rate: '0',//批发占比
            retail_rate: '0',//零售占比
            msa_wholesale_rate: '0',//主要销售区域批发占比
            msa_retail_rate: '0',//主要销售区域零售占比
            main_supplier_note: '0',//车辆来源备注
            msa_note: '0',//主要的销售区域及方式备注
            avg_turnover_days: '0',//平均周转天数
            has_main_supplier:'0',//车辆来源
    }
     tempResult={}
     dataSource=[];



    initFinish(){

        let tempDataSource=[];
        allKeys.map((item,index)=>{tempDataSource.push(repoData.totulData[item])})
        this.dataSource=tempDataSource;
        this._getRepinfo();
    }



    _getRepinfo=()=>{

        let paramer ={
            merge_id:this._getProps('merge_id'),
            month:this._getProps('month')
        };
        request(apis.PATROLEVALGETMERGEPATROLEVALRESULT, 'Post', paramer)
            .then((response) => {

                    let tempJson=response.mjson.retdata;
                    this.tempResult=tempJson;
                    let allKes=Object.keys(this.PostData);
                    allKes.map((item,index)=>{

                        this.PostData[item]=tempJson[item];
                    })
                    this.setState({
                        renderPlaceholderOnly:STATECODE.loadSuccess
                    })

                },
                (error) => {

                });

    }

    _getProps=(showKey)=>{

        let temp =this.props.navigation.state.params;

        return temp[showKey];

    }
    _radioButtonClick=(groupIndex,radioIndex, value)=>{
        let tempData=allKeys[groupIndex]
        if(tempData=="main_biz_status"){

            if(value==1){
               this.PostData[tempData]='3';
            }else {
                this.PostData[tempData]=value+1;
            }
        }else {
            this.PostData[tempData]=value+1;
        }

    }

    //下一步
    _nextTepClick=()=>{

        console.log('传递参数'+this.PostData);
        this.toNextPage('ReporInfoPeople',
            {merge_id:this._getProps('merge_id'),
                title:this._getProps('title'),
                money:this._getProps('money'),
                month:this._getProps('month'),
                holeInfo:this.tempResult,
                currentPageInfo:this.PostData,
            })

    }
    //暂存
    _temporaryClick=()=>{

        this.props.screenProps.showModal(true);
        let paramer ={merge_id:this._getProps('merge_id'),month:this._getProps('month')};
        Object.assign(paramer,this.PostData);
        paramer.wholesale_rate=addition(paramer.wholesale_rate,100);
        paramer.retail_rate=addition(paramer.retail_rate,100);
        paramer.msa_wholesale_rate=addition(paramer.msa_wholesale_rate,100);
        paramer.msa_retail_rate=addition(paramer.msa_retail_rate,100);

        console.log('暂存的参数'+paramer);

        request(apis.PATROLEVALSAVEUPDATEPATROLEVAL, 'Post', paramer)
            .then((response) => {
                    this.props.screenProps.showToast('保存成功');
                },
                (error) => {
                    this.props.screenProps.showToast('保存失败');
                });
    }

    _renderItem=(data)=>{

        if(data.item.type==rate){

            return (

                <View style={{marginLeft:10}}>
                    <Text>{data.index+1+'、'+data.item.title}</Text>
                    <RepRateInput typeName="批发" onChangeText={(text)=>{this.PostData.wholesale_rate=text}} defaultValue={getDefaultValue(this.PostData.wholesale_rate)}/>
                    <RepRateInput typeName="零售" onChangeText={(text)=>{this.PostData.retail_rate=text}} defaultValue={getDefaultValue(this.PostData.retail_rate)}/>
                </View>
            )
        }
        if(data.item.type==optionInput){
             return(
                 <View style={{marginLeft:10}}>
                     <Text>{data.index+1+'、'+data.item.title}</Text>
                     <RadioGroup selectedIndex={this.PostData[allKeys[data.index]]-1} color="black" onSelect={(index,value)=>{this.PostData[value]=index+1}}>
                         <RadioButton key={'yes'} value={allKeys[data.index]}>
                             <Text style={{color:'gray'}}>{'是'}</Text>
                         </RadioButton>
                         <RadioButton key={'no'}value={allKeys[data.index]}>
                             <Text style={{color:'gray'}}>{'否'}</Text>
                         </RadioButton>
                     </RadioGroup>
                    <RepBordeInput width={120} onChangeText={(text)=>{this.PostData.main_supplier_note=text}} defaultValue={getDefaultValue(this.PostData.main_supplier_note)}/>
                 </View>
             )
        }
        if(data.item.type==rateInput){

            return (
                <View style={{marginLeft:10}}>
                    <Text>{data.index+1+'、'+data.item.title}</Text>
                    <RepRateInput typeName="批发" onChangeText={(text)=>{this.PostData.msa_wholesale_rate=text}} defaultValue={getDefaultValue(this.PostData.msa_wholesale_rate)}/>
                    <RepRateInput typeName="零售" onChangeText={(text)=>{this.PostData.msa_retail_rate=text}}defaultValue={getDefaultValue(this.PostData.msa_retail_rate)}/>
                    <RepBordeInput width={140} onChangeText={(text)=>{this.PostData.msa_note=text}} defaultValue={getDefaultValue(this.PostData.msa_note)}/>
                </View>

            )
        }
        if (data.item.type==input){

            return (
                <View style={{marginLeft:10}}>
                    <Text>{data.index+1+'、'+data.item.title}</Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:10}}>
                        <RepBordeInput keyboardType='decimal-pad' width={100}
                                       onChangeText={(text)=>{this.PostData.avg_turnover_days=text}}
                                       defaultValue={getDefaultValue(this.PostData.avg_turnover_days)}/>
                        <Text style={{color:'gray',paddingBottom:8}}>{'天'}</Text>
                    </View>

                </View>
            )

        }
        let tempBlob =[];
        let selcted =this.PostData[allKeys[data.index]];

        if(allKeys[data.index]=="main_biz_status"){
            if(selcted=='3'){
                selcted='2';
            }
        }
        data.item.option.map((item, index) => {
            tempBlob.push(
                <RadioButton key ={data.item.title+index} value={index}>
                    <Text style={{color:'gray'}}>{item}</Text>
                </RadioButton>
            )
        })
        return (
            <View>
                <Text style={{marginLeft:10}}>{data.index+1+'、'+data.item.title}</Text>
                <RadioGroup selectedIndex={selcted-1} style={repStyles.radioGroup} color="black" onSelect={(index, value)=>{this._radioButtonClick(data.index,index,value)}}>
                    {tempBlob}
                </RadioGroup>
            </View>
        )
    }
    _renderFooter=()=>{

        return (
            <RepListFootComponent lTitle="下一步"rTitle="暂存"lOnPress={this._nextTepClick}rOnpress={this._temporaryClick}/>
        )
    }
    render(){


        if(this.state.renderPlaceholderOnly!=STATECODE.loadSuccess){

            return(
                <View style={commenStyle.commenPage}>
                <AllNavigationView title={this._getProps('title')} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>)

        }
        return (
            <View style={commenStyle.commenPage}>
                <View style={commenStyle.testUI}>
                    <RepDetailListHeader
                        people={this._getProps('title')}
                        money={this._getProps('money')}
                        date={this._getProps('month')}
                        target="经营指标"
                    />
                    <FlatList
                        data={this.dataSource}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => item.title}
                        ListFooterComponent={this._renderFooter}
                    />

                </View>

                <AllNavigationView title={this._getProps('title')} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>
        )
    }

}
