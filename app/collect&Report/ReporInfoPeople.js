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
import {STATECODE,addition} from './Component/MethodComponet'
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


    state={

        renderPlaceholderOnly:STATECODE.loading,

    }
    peoplePostData={
        dr_quality: '0',
        dr_reputation: '0',
        dr_health: '0',
        dr_mind: '0',
        dr_mult_identity: '0',
        dr_family: '0',
        dr_hobby: '0',
        dr_punishment: '0',
        dr_controller_change: '0',
        dr_equity_change: '0',
        dr_nationality_status: '0'
    }


    initFinish(){

        let holeInfo=this._getProps('holeInfo');
        Object.keys(this.peoplePostData).map((item)=>{this.peoplePostData[item]=holeInfo[item]});
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
        if(tempData =='dr_hobby'||tempData=='dr_mult_identity'){

            this.peoplePostData[tempData]=value=='1'?'3':(value+1).toString();
        }else {
            this.peoplePostData[tempData]=(value+1).toString();
        }


    }

    _nextTepClick=()=>{

        this.toNextPage('ReporInfoFkong',
            {merge_id:this._getProps('merge_id'),
                title:this._getProps('title'),
                money:this._getProps('money'),
                month:this._getProps('month'),
                holeInfo:this._getProps('holeInfo'),
                lastInfo:this._getProps('currentPageInfo'),
                currentInfo:this.peoplePostData,
            })
    }
    _temporaryClick=()=>{

        let parmer ={merge_id:this._getProps('merge_id'),month:this._getProps('month')};
        Object.assign(parmer,this.peoplePostData);
        let lastPageInfo =this._getProps('currentPageInfo');
        Object.assign(lastPageInfo,parmer);
         lastPageInfo.wholesale_rate=addition(lastPageInfo.wholesale_rate,100);
         lastPageInfo.retail_rate=addition(lastPageInfo.retail_rate,100);
         lastPageInfo.msa_wholesale_rate=addition(lastPageInfo.msa_wholesale_rate,100);
         lastPageInfo.msa_retail_rate=addition(lastPageInfo.msa_retail_rate,100);


        request(apis.PATROLEVALSAVEUPDATEPATROLEVAL, 'Post', lastPageInfo)
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
        let tempSelect= Number(this.peoplePostData[data.item.selectKey]);
        let selcted =tempSelect;
        if(data.item.selectKey =='dr_hobby'||data.item.selectKey=='dr_mult_identity'){

            if(tempSelect=='3'){
                selcted=1;
            }else {
                selcted=tempSelect-1;
            }
        }else {

            selcted=tempSelect-1;
        }


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
                    selectedIndex={selcted}
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

        if(this.state.renderPlaceholderOnly!=STATECODE.loadSuccess){

            return (

                <View style={commenStyle.commenPage}>
                    <View style={commenStyle.testUI}>
                        <RepDetailListHeader
                            people={this._getProps('title')}
                            money={this._getProps('money')}
                            date={this._getProps('month')}
                            target="借款人指标"
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
