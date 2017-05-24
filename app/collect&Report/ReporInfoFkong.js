/**
 * Created by lcus on 2017/5/17.
 */

import React, {Component} from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import BaseComponent from '../component/BaseComponent'
import * as apis from '../constant/appUrls'
import  {request} from '../utils/RequestUtil'
import {STATECODE,adapeSize,fontadapeSize,addition} from './Component/MethodComponet'
import {commenStyle,repStyles} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';
import {RepDetailListHeader,RepListFootComponent} from './Component/ListItemComponent'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
let repoData =require('./Component/RepData.json')
const title =[

    {title:'借款用途是否用于其主营业务',selectKey:'rc_loan_purposes'},
    {title:'是否存在涉及经营事故，泡水或其他违背市场行情车辆',selectKey:'rc_has_bad_auto'},
    {title:'检查时商户的车辆在库情况及日常车辆在库情况',selectKey:'rc_inv_status'},
    {title:'监管配合度',selectKey:'rc_cooperating_status'},
    {title:'是否存在捏造虚假信息借出借用相关监管要件',selectKey:'rc_illegal_borr_cert'},
    {title:'是否存在未经我司许可私自出售车辆且未按规定还款或置换',selectKey:'rc_illegal_sell'},
    {title:'是否存在未经我司许可擅自挪用或长期使用我司质押车辆',selectKey:'rc_illegal_diversion'},
    {title:'监管要件的借出超期或未按承诺使用',selectKey:'rc_borr_cert_overdue'},
    {title:'商户是否按时提交贷后报告，贷后报告真实性及规范度',selectKey:'rc_report_timely'},
    {title:'商户日常还款情况是否正常',selectKey:'rc_daily_repayment'},

]
const itemoption={

    rc_loan_purposes:['全部用在二手车经营','有资金外用情形或迹象','资金风险关注'],
    rc_has_bad_auto:['否','关注','风险预警'],
    rc_inv_status:['正常','关注','风险预警'],
    rc_cooperating_status:['良好','一般','差'],
    rc_illegal_borr_cert:['没有','存在极少数','关注风险'],
    rc_illegal_sell:['没有','存在极少数','关注风险'],
    rc_illegal_diversion:['没有','存在极少数','关注风险'],
    rc_borr_cert_overdue:['没有','存在极少数','关注风险'],
    rc_report_timely:['按时提报','贷后报告真实性存异','不配合提供'],
    rc_daily_repayment:['正常','能按时还需多次催促','关注风险'],
}

export default class ReporInfoFkong extends BaseComponent{

    state={

        renderPlaceholderOnly:STATECODE.loading,
    }
    fengKongData={

        rc_loan_purposes:'0',
        rc_has_bad_auto:'0',
        rc_inv_status:'0',
        rc_cooperating_status:'0',
        rc_illegal_borr_cert:'0',
        rc_illegal_sell:'0',
        rc_illegal_diversion:'0',
        rc_borr_cert_overdue:'0',
        rc_report_timely:'0',
        rc_daily_repayment:'0',
        rc_overview:'0'
    }



    initFinish(){

        let holeInfo=this._getProps('holeInfo');
        Object.keys(this.fengKongData).map((item)=>{this.fengKongData[item]=holeInfo[item]});
        this.setState({
            renderPlaceholderOnly:STATECODE.loadSuccess
        })
    }

    _getProps=(showKey)=>{

        let temp =this.props.navigation.state.params;

        return temp[showKey];

    }

    _radioButtonClick=(groupIndex,radioIndex, value)=>{
        let tempData=title[groupIndex].selectKey;
        this.fengKongData[tempData]=(value+1).toString();
    }

    _onSubMit=()=> {

        let parmer = {merge_id: this._getProps('merge_id'), month: this._getProps('month')};
        Object.assign(parmer, this.fengKongData);
        let lastPageInfo = this._getProps('currentInfo');
        Object.assign(lastPageInfo, parmer);
        let total = this._getProps('lastInfo')
        Object.assign(total, lastPageInfo);

        if(!this._getProps('save')){
            total.wholesale_rate = addition(total.wholesale_rate, 100);
            total.retail_rate = addition(total.retail_rate, 100);
            total.msa_wholesale_rate = addition(total.msa_wholesale_rate, 100);
            total.msa_retail_rate = addition(total.msa_retail_rate, 100);
        }

        let allkeys = Object.keys(total);
        let isall = true;

        for(temp of allkeys){



            if (total[temp]==0&&temp!='credit_line'&&temp!='sub_status'&&temp!='sub_user_id'&&temp!='reg_auto_num'&&temp!='loan_balance'&&temp!='reg_auto_sum') {
                console.log(temp);
                isall = false;



                let temptitle=repoData.totulData[temp];
                 if(temptitle){

                    this.props.screenProps.showToast(temptitle['title']);
                }
                else {

                    let temptitle=repoData.special[temp]
                    this.props.screenProps.showToast(temptitle);
                }
                break;
        }

        }
        if(isall){
            request(apis.PATROLEVALSAVEUPDATEPATROLEVAL, 'Post', total)
                .then((response) => {
                        this.props.screenProps.showToast('提交成功');
                    },
                    (error) => {
                        this.props.screenProps.showToast('提交失败');

                    });


    }}


    _temporaryClick=()=>{

        let parmer ={merge_id:this._getProps('merge_id'),month:this._getProps('month')};
        Object.assign(parmer,this.fengKongData);
        let lastPageInfo =this._getProps('currentInfo');
        Object.assign(lastPageInfo,parmer);
        let total =this._getProps('lastInfo')
        Object.assign(total,lastPageInfo);
        total.wholesale_rate = addition(total.wholesale_rate, 100);
        total.retail_rate = addition(total.retail_rate, 100);
        total.msa_wholesale_rate = addition(total.msa_wholesale_rate, 100);
        total.msa_retail_rate = addition(total.msa_retail_rate, 100);


        request(apis.PATROLEVALSAVEUPDATEPATROLEVAL, 'Post', total)
            .then((response) => {
                    this.props.screenProps.showToast('保存成功');
                },
                (error) => {
                    this.props.screenProps.showToast('保存失败');

                });
    }

    _renderItem=(data)=>{

        let tempData =itemoption[data.item.selectKey];
        let tempBlob =[];
        let tempSelect=Number(this.fengKongData[data.item.selectKey]);
        tempData.map((item, index) => {

            tempBlob.push(
                <RadioButton key={item+index} value={index}>
                    <Text style={{color:'gray'}}>{item}</Text>
                </RadioButton>
            )
        })
        return (
            <View>
                <Text style={{marginLeft:10}}>{data.index+1+'、'+data.item.title}</Text>
                <RadioGroup
                    selectedIndex={tempSelect-1}
                    style={repStyles.radioGroup}
                    color="black"
                    onSelect={(index, value)=>{this._radioButtonClick(data.index,index,value)}}>
                    {tempBlob}
                </RadioGroup>
            </View>
        )

    }
    _renderFooter=()=>{

         return (
            <View>
            <Text style={{marginLeft:adapeSize(10),fontSize:fontadapeSize(14)}}>{'综合评价/风险关注信息'}</Text>
            <TextInput onChangeText={(text)=>{this.fengKongData.rc_overview=text}}
                       multiline={true}
                       style={{borderColor:'black',borderWidth:0.5,borderRadius:5, margin:adapeSize(10),height:adapeSize(60)}}
                       defaultValue={this.fengKongData.rc_overview!='0'?this.fengKongData.rc_overview:null}
            />
            <RepListFootComponent lTitle="提交"rTitle="暂存"lOnPress={this._onSubMit}rOnpress={this._temporaryClick}/>

        </View>


        )
    }

    render(){

        if(this.state.renderPlaceholderOnly==STATECODE.loading){
            return (
                <View style={commenStyle.commenPage}>
                    <View style={commenStyle.testUI}>
                        <RepDetailListHeader
                            people={this._getProps('title')}
                            money={this._getProps('money')}
                            date={this._getProps('month')}
                            target="风控指标"
                        />
                    </View>
                    <AllNavigationView title={this._getProps('title')} backIconClick={() => {
                        this.backPage();
                    }} parentNavigation={this}/>
                </View>
            )
        }

        return (
            <View style={commenStyle.commenPage}>
                <View style={commenStyle.testUI}>
                    <RepDetailListHeader
                        people={this._getProps('title')}
                        money={this._getProps('money')}
                        date={this._getProps('month')}
                        target="风控指标"
                    />
                    <FlatList
                        data={title}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => item.selectKey}
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
