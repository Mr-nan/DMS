/**
 * Created by lcus on 2017/5/17.
 */

import React, {Component} from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import BaseComponent from '../component/BaseComponent'
import * as apis from '../constant/appUrls'
import  {request} from '../utils/RequestUtil'
import {STATECODE} from './Component/MethodComponet'
import {commenStyle,repStyles} from './Component/PageStyleSheet'
import AllNavigationView from '../component/AllNavigationView';
import {RepDetailListHeader,RepListFootComponent} from './Component/ListItemComponent'
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'

const title =[

    {title:'商户在现在的品质情况以及日后发展预期',selectKey:'dr_quality'},
    {title:'商户在当地的声誉',selectKey:'dr_reputation'},
    {title:'借款人，实际控制人或股东重病或其他重大健康状况',selectKey:'dr_health'},
    {title:'借款人状态（精神状态以及发展思路是否清晰）',selectKey:'dr_mind'},
    {title:'借款人或实际控制人有多个身份证或身份信息',selectKey:'dr_mult_identity'},
    {title:'借款人，实际控制人或股东婚姻及家庭稳定性情况',selectKey:'dr_family'},
    {title:'借款人，实际控制人或股东存在吸毒，巨额赌博等嗜好',selectKey:'dr_hobby'},
    {title:'借款人，实际控制人或股东被国家行政机关处罚',selectKey:'dr_punishment'},
    {title:'借款人，实际控制人，股东或重要经营关键人物变更',selectKey:'dr_controller_change'},
    {title:'股权分割或股东变更；被收购，重组；股东间相处情况',selectKey:'dr_equity_change'},
    {title:'借款人或实际控制人取得外国国籍或者开设国外分支机构',selectKey:'dr_nationality_status'}
]
const itemoption= {

    dr_quality:['一级优秀','二级优良','三级普通'],
    dr_reputation:['良好','关注','风险预警'],
    dr_health:['无','关注','风险预警'],
    dr_mind:['无','关注','风险预警'],
    dr_mult_identity:['无','风险预警'],
    dr_family:['无','关注','风险预警'],
    dr_hobby:['无','风险预警'],
    dr_punishment:['无','关注','风险预警'],
    dr_controller_change:['无','关注','风险预警'],
    dr_equity_change:['无','关注','风险预警'],
    dr_nationality_status:['无','关注','风险预警'],

}


export default class ReporInfoPeople extends BaseComponent{


    _getProps=(showKey)=>{

        let temp =this.props.navigation.state.params;

        return temp[showKey];

    }

    _radioButtonClick=(groupIndex,radioIndex, value)=>{

        console.log(groupIndex+'==='+radioIndex+'----'+value)
    }

    _nextTepClick=()=>{

        this.toNextPage('ReporInfoFkong',
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
        let tempBlob =[];

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
                    selectedIndex={-1}
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
            <RepListFootComponent lTitle="下一步"rTitle="暂存"lOnPress={this._nextTepClick}rOnpress={this._temporaryClick}/>
        )
    }

    render(){

        return (
            <View style={commenStyle.commenPage}>
                <View style={commenStyle.testUI}>
                    <RepDetailListHeader
                        people={this._getProps('title')}
                        money={this._getProps('money')}
                        date={this._getProps('month')}
                        target="借款人指标"
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
