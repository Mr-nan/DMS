/**
 * Created by lcus on 2017/5/20.
 */
import React, {Component} from 'react';
import {
    View,
    SectionList,
    Text
} from 'react-native';
import BaseComponent from '../component/BaseComponent'
import  {RepListSearch} from './Component/SearchBarBlobs'
import * as apis from '../constant/appUrls'
import  {request} from '../utils/RequestUtil'
import {toutalPage,STATECODE,width,PAGECOLOR,adapeSize} from './Component/MethodComponet'
import {RepDetailListHeader} from './Component/ListItemComponent'
import {commenStyle,repStyles} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';
let RepData =require('./Component/RepData.json')
export default class SubmitReporInfo extends BaseComponent{

   state={renderPlaceholderOnly:STATECODE.loading};
   showData=[
       {key:'经营指标',data: ['biz_situation','place_status',"main_biz_status","main_price_range",'rate','has_main_supplier','rateInput','showroom_entering_status','transfer_custom',
           'avg_turnover_days','area_atd_compare','area_profit_compare','auto_ownership_status','auto_pledge_status','other_credit_status','salary_payment_status'] },
       {key:'借款人指标',data:['dr_quality',"dr_reputation","dr_health",'dr_mind','dr_mult_identity','dr_family','dr_hobby','dr_punishment','dr_controller_change','dr_equity_change','dr_nationality_status']},
       {key:'风控指标',data: ['rc_loan_purposes','rc_has_bad_auto','rc_inv_status','rc_cooperating_status','rc_illegal_borr_cert','rc_illegal_sell','rc_illegal_diversion','rc_borr_cert_overdue',
           'rc_report_timely','rc_daily_repayment']},
       {key:"综合评价/风险关注信息", data:['rc_overview']}

   ]
   josnData={};

    initFinish(){
       this._getRepinfo()
    }
    _getRepinfo=()=>{

        let paramer ={
            merge_id:this._getProps('merge_id'),
            month:this._getProps('month')
        };
        request(apis.PATROLEVALGETMERGEPATROLEVALRESULT, 'Post', paramer)
            .then((response) => {
                    let tempJson=response.mjson.retdata;
                    this.josnData=tempJson;
                    this.setState({renderPlaceholderOnly:STATECODE.loadSuccess})
                },
                (error) => {


                });

    }


    _getProps=(showKey)=>{

        let temp =this.props.navigation.state.params;

        return temp[showKey];

    }
    _renderSectionHeader=(info)=> {

        return (
            <View style={{width:width,height:adapeSize(20),backgroundColor:PAGECOLOR.deapGray,justifyContent:'center'}}>
                <Text style={{marginLeft:adapeSize(10),color:'white'}}>{info.section.key}</Text>
            </View>
        )
    }

    _renderItem=(data)=>{

        let tempData = RepData.totulData[data.item];
        if(data.item!='rc_overview') {

            let selectIndex=this.josnData[data.item];
            if(data.item=='main_biz_status'||data.item=='dr_hobby'||data.item=='dr_mult_identity'){
                if (this.josnData[data.item]=='3'){
                    selectIndex=1;
                }else {
                    selectIndex=selectIndex-1;
                }
            }else {
                selectIndex=selectIndex-1;
            }
            if (tempData.type == 'option') {
                return (
                    <View style={repStyles.repToutal}>
                        <Text>{data.index+1+'、'+tempData.title}</Text>
                        <Text style={repStyles.repToutalText}>{tempData.option[selectIndex]}</Text>
                    </View>
                )
            }else if(tempData.type=='rate'){

                let subInfo=tempData['subinfo'];
                let tempsubInfos=[];
                subInfo.map((item)=>{tempsubInfos.push(
                    <Text key={item.key} style={repStyles.rateText}>{`${item.title}  ${this.josnData[item.key]}%`}</Text>
                )})
                return (
                    <View style={repStyles.repToutal}>
                        <Text>{data.index+1+'、'+tempData.title}</Text>
                        <View style={{flexDirection:'row'}}>
                            {tempsubInfos}
                        </View>
                    </View>
                )
            }
            else if(tempData.type == 'optionInput'){
                let selectIndex=this.josnData[data.item];

                return (
                    <View style={repStyles.repToutal}>
                        <Text>{data.index+1+'、'+tempData.title}</Text>
                        <Text style={repStyles.repToutalText}>{tempData.subinfo[selectIndex-1]}</Text>
                       <Text style={[repStyles.repToutalText,this.josnData['main_supplier_note']?null:{height:0}]}>{'备注 :'+this.josnData['main_supplier_note']}</Text>
                    </View>
                )
            }else if(tempData.type=='rateInput'){

                let subInfo=tempData['subinfo'];
                let tempsubInfos=[];
                subInfo.map((item)=>{tempsubInfos.push(
                    <Text key={item.key} style={repStyles.rateText}>{`${item.title}  ${this.josnData[item.key]}%`}</Text>
                )})
                return (
                    <View style={repStyles.repToutal}>
                        <Text>{data.index+1+'、'+tempData.title}</Text>
                        <View style={{flexDirection:'row'}}>
                            {tempsubInfos}
                        </View>
                        <Text style={[repStyles.repToutalText,this.josnData['msa_note']?null:{height:0}]}>{'备注 :'+this.josnData['msa_note']}</Text>
                    </View>
                )
            }else if(tempData.type='input'){

                    return (
                        <View>
                            <View style={repStyles.repToutal}>
                                <Text>{data.index+1+'、'+tempData.title}</Text>
                                <Text style={repStyles.repToutalText}>{this.josnData[data.item]+'天'}</Text>
                            </View>

                        </View>
                    )
            }


        }
        //
        return(
            <View style={repStyles.repToutal}>
                <Text style={repStyles.repToutalText}>{this.josnData[data.item]}</Text>
            </View>
        )
    }

    _headerComponent=()=>{

       return (
           <RepDetailListHeader
               people={this._getProps('title')}
               money={this._getProps('money')}
               date={this._getProps('month')}
               target=""
           />
       )
    }

   render(){

       if(this.state.renderPlaceholderOnly!=STATECODE.loadSuccess){
           return (

               <View style={commenStyle.commenPage}>

                   <AllNavigationView title={'巡查报告'} backIconClick={() => {
                       this.backPage();
                   }} parentNavigation={this}/>
               </View>
           )

       }
       return (
           <View style={commenStyle.commenPage}>
               <View style={commenStyle.testUI}>

                   <SectionList
                       sections={this.showData}
                       renderItem={this._renderItem}
                       keyExtractor={(item, index) => index}
                       renderSectionHeader={this._renderSectionHeader}
                       ListHeaderComponent={this._headerComponent}
                   />
               </View>
               <AllNavigationView title={'巡查报告'} backIconClick={() => {
                   this.backPage();
               }} parentNavigation={this}/>
           </View>
       )

}}