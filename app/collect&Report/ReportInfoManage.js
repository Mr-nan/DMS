/**
 * Created by lcus on 2017/5/10.
 */
import React, {Component} from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text
} from 'react-native';
import BaseComponent from '../component/BaseComponent'
import * as apis from '../constant/appUrls'
import  {request} from '../utils/RequestUtil'
import {STATECODE} from './Component/MethodComponet'
import {commenStyle} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';

const [option,input,optionInput,rateInput]=['option','input','optionInput','rateInput'];
const  title =[
    {title:'商户经营状态',selectKey:'biz_situation',type:option},
    {title:'经营场地是否整洁有序,经营所需环节正常齐备',selectKey:'place_status',type:option},
    // {title:'商户主营业务是否为二手车，借款人，实际控制人或股东是否有涉及其他行业',selectKey:'main_biz_status',type:option},
    // {title:'主力车型及价格区间的大致构成',selectKey:'main_price_range',type:option},
    // {title:'批发或零售，具体占比',selectKey:"rate",type:rateInput},
    // {title:'车源来源，是否有主要或重点合作方备注',selectKey:'main_supplier_note',type:optionInput},
    // {title:'主要销售区域以及方式',selectKey},
    // {title:'展厅或市场的进店量'},
    // {title:'收车是否过户，过户习惯'},
    // {title:'平均周转天数'},
    // {title:'区域平均周转天数及商户周转天数对比'},
    // {title:'区域平均利润情况及商户利润情况对比'},
    // {title:'商户车辆的权属是否清晰，是否存在押车，合伙收车或寄售车辆是否存在一车多押等权属争议情况等'},
    // {title:'商户车辆在我司的质押情况；商户车辆在其他机构的质押情况'},
    // {title:'是否存在征信未体现的其他金融借款或民间借贷等负债情况'},
    // {title:'是否正常发放薪资；工作氛围及员工精神状态'}
    ];



const  itemoption ={
    biz_situation:['正常','关注','风险预警'],
    place_status:['正常( 整齐 )','关注( 杂乱 )','风险预警( 破损维修明显 )'],
}

export default class ReportInfoManage extends BaseComponent{

    render(){

        return (
            <View>
                <View>
                    
                </View>
                <AllNavigationView title={'关于版本'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
            </View>
        )
    }

}
