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
import {STATECODE} from './Component/MethodComponet'
import {commenStyle,repStyles} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';
import {RepDetailListHeader,RepListFootComponent,RepRateInput,RepBordeInput} from './Component/ListItemComponent'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'

const [option,input,optionInput,rateInput,rate]=['option','input','optionInput','rateInput','rate'];
const  title =[
    {title:'商户经营状态',selectKey:'biz_situation',type:option},
    {title:'经营场地是否整洁有序,经营所需环节正常齐备',selectKey:'place_status',type:option},
    {title:'商户主营业务是否为二手车，借款人，实际控制人或股东是否有涉及其他行业',selectKey:'main_biz_status',type:option},
    {title:'主力车型及价格区间的大致构成',selectKey:'main_price_range',type:option},
    {title:'批发或零售，具体占比',selectKey:"rate",type:rate},
    {title:'车源来源，是否有主要或重点合作方备注',selectKey:'main_supplier_note',type:optionInput},
    {title:'主要销售区域以及方式',selectKey:'rateInput',type:rateInput},
    {title:'展厅或市场的进店量',selectKey:'showroom_entering_status',type:option},
    {title:'收车是否过户，过户习惯',selectKey:'transfer_custom',type:option},
    {title:'平均周转天数',selectKey:'zhouzhuan',type:input},
    {title:'区域平均周转天数及商户周转天数对比',selectKey:'area_atd_compare',type:option},
    {title:'区域平均利润情况及商户利润情况对比',selectKey:'area_profit_compare',type:option},
    {title:'商户车辆的权属是否清晰，是否存在押车，合伙收车或寄售车辆是否存在一车多押等权属争议情况等',selectKey:'auto_ownership_status',type:option},
    {title:'商户车辆在我司的质押情况；商户车辆在其他机构的质押情况',selectKey:'auto_pledge_status',type:option},
    {title:'是否存在征信未体现的其他金融借款或民间借贷等负债情况',selectKey:'other_credit_status',type:option},
    {title:'是否正常发放薪资；工作氛围及员工精神状态',selectKey:'salary_payment_status',type:option},
    ];



const  itemoption ={
    biz_situation:['正常','关注','风险预警'],
    place_status:['正常( 整齐 )','关注( 杂乱 )','风险预警( 破损维修明显 )'],
    main_biz_status:['正常','风险预警'],
    main_price_range:['20万以下','20-50万','50-80万','80-100万','100万以上'],
    showroom_entering_status:['正常','较少（ 关注 ）'],
    transfer_custom:['正常','关注','风险预警'],
    area_atd_compare:['高','中','低'],
    area_profit_compare:['高','中','低'],
    auto_ownership_status:['正常','关注','风险预警'],
    auto_pledge_status:['正常','关注','风险预警'],
    other_credit_status:['正常','关注','风险预警'],
    salary_payment_status:['正常','关注','风险预警']
}



export default class ReportInfoManage extends BaseComponent{


    _getProps=(showKey)=>{

        let temp =this.props.navigation.state.params;

        return temp[showKey];

    }

    _radioButtonClick=(groupIndex,radioIndex, value)=>{

        console.log(groupIndex+'==='+radioIndex+'----'+value)
    }


    _nextTepClick=()=>{

        this.toNextPage('ReporInfoPeople',
            {merge_id:this._getProps('merge_id'),
                title:this._getProps('title'),
                money:this._getProps('money'),
                month:this._getProps('month')})
    }
    _temporaryClick=()=>{
        alert('暂存')
    }

    _renderItem=(data)=>{

        let tempData =itemoption[data.item.selectKey];

        if(data.item.type==rate){

            return (

                <View style={{marginLeft:10}}>
                    <Text>{data.index+1+'、'+data.item.title}</Text>
                    <RepRateInput typeName="批发"/>
                    <RepRateInput typeName="零售"/>
                </View>
            )

        }
        if(data.item.type==optionInput){

             return(

                 <View style={{marginLeft:10}}>
                     <Text>{data.index+1+'、'+data.item.title}</Text>
                     <RadioGroup color="black">
                         <RadioButton key={'yes'} value={'yes'}>
                             <Text style={{color:'gray'}}>{'是'}</Text>
                         </RadioButton>
                         <RadioButton key={'no'}value={'no'}>
                             <Text style={{color:'gray'}}>{'否'}</Text>
                         </RadioButton>
                     </RadioGroup>
                    <RepBordeInput width={120}/>
                 </View>
             )
        }
        if(data.item.type==rateInput){

            return (
                <View style={{marginLeft:10}}>
                    <Text>{data.index+1+'、'+data.item.title}</Text>
                    <RepRateInput typeName="批发"/>
                    <RepRateInput typeName="零售"/>
                    <RepBordeInput width={120}/>
                </View>

            )
        }
        if (data.item.type==input){

            return (
                <View style={{marginLeft:10}}>
                    <Text>{data.index+1+'、'+data.item.title}</Text>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:10}}>
                        <RepBordeInput width={100}/>
                        <Text style={{color:'gary',paddingBottom:8}}>{'天'}</Text>
                    </View>

                </View>
            )

        }
        let tempBlob =[];
        tempData.map((item, index) => {

            tempBlob.push(
                <RadioButton key={item+index}value={index}>
                    <Text style={{color:'gray'}}>{item}</Text>
                </RadioButton>
            )
        })
        return (
            <View>
                <Text style={{marginLeft:10}}>{data.index+1+'、'+data.item.title}</Text>
                <RadioGroup selectedIndex={-1} style={repStyles.radioGroup} color="black" onSelect={(index, value)=>{this._radioButtonClick(data.index,index,value)}}>
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

        return (
            <View style={commenStyle.commenPage}>
                <KeyboardAvoidingView behavior={'position'} style={commenStyle.testUI}>
                    <RepDetailListHeader
                        people={this._getProps('title')}
                        money={this._getProps('money')}
                        date={this._getProps('month')}
                        target="经营指标"
                    />
                    <FlatList
                        data={title}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => item.selectKey}
                        ListFooterComponent={this._renderFooter}
                    />
                </KeyboardAvoidingView>
                <AllNavigationView title={this._getProps('title')} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>
        )
    }

}
