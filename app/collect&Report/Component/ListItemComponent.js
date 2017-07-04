/**
 * Created by lcus on 2017/5/10.
 */
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native';
import  {PAGECOLOR,width,height,adapeSize,fontadapeSize} from './MethodComponet'


class CollectCustomerListItem extends PureComponent{

    _onclick=(componeyId)=>{

        const {customListItemClick,merge_id,legalcompany,carNum}=this.props;
        customListItemClick(merge_id,legalcompany,carNum);
    }
    render(){

        const {legalcompany,carNum} =this.props;

        return(
            <TouchableOpacity style={styles.ccListWarp} onPress={this._onclick}>

                <Text style={styles.ccListComponey}>{legalcompany}</Text>
                <View style={styles.ccListCarWarp}>
                    <Text style={styles.ccListCarWait}>{'待处理车辆 : '}</Text>
                    <Text style={styles.ccListCarNum}>{carNum}</Text>
                </View>
            </TouchableOpacity>
        )

    }
}
class CollectCarListItem extends PureComponent{

    _onclick=()=>{

        const {carListItemClick,carFrameNumber,type,base_id,carid}=this.props;
        carListItemClick(carFrameNumber,base_id,carid,type);
    }

    render(){

        const {carType,carDetailType,carFrameNumber,place,type} =this.props;

        return (
            <TouchableOpacity style={styles.ccListWarp} onPress={this._onclick}>
                <Text style={styles.cccCarType}>{carType}</Text>
                <Text style={styles.cccCardetailType}>{carDetailType}</Text>
                <View style={styles.carStateWarp}>
                    <Text style={styles.cccCarInfo}>{'车架号 ：'+carFrameNumber}</Text>
                    <View style={[styles.carStateTextWarp,type==4?null:{width:0}]}>
                        <Text style={styles.carStateText}>{'补充车辆资料'}</Text>
                    </View>

                </View>

                <Text style={styles.cccCarInfo}>{place}</Text>
            </TouchableOpacity>
        )
    }

}
class ReportCustomerListItem extends PureComponent{


    _onclick=()=>{

        const { merge_id,companyName,money,stateCode,repCustomItemClick} =this.props;
        repCustomItemClick(merge_id,companyName,money,stateCode);
    }

    render(){

        const {companyName,money,state} =this.props;
        return(
            <TouchableOpacity style={styles.ccListWarp} onPress={this._onclick}>
                <Text style={styles.ccListComponey}>{companyName}</Text>
                <View style={styles.ccListCarWarp}>
                    <Text style={styles.cccCarInfo}>{money}</Text>
                    <View style={{flexDirection:'row',marginBottom:adapeSize(8),marginLeft:adapeSize(20)}}>
                        <Text style={styles.cccCarInfo}>{'状态 ：'}</Text>
                        <Text style={[styles.ccListCarNum,state=='已提交'?{color:'green'}:null]}>{state}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


}

class RepDetailListHeader extends PureComponent{

    render(){
        const {people,money,date,target}=this.props;

        return (
        <View>
            <View style={styles.repHeadWarp}>
                <Text style={styles.repPeopleInf}>{people}</Text>
                <View style={styles.repInfoWap}>
                    <Text style={styles.money}>{money}</Text>
                    <Text style={styles.dateF}>{date}</Text>
                </View>
            </View>
                <View style={[styles.targetWarp,target==''?{height:0}:null]}>
                    <Text style={styles.targeText}>{target}</Text>
                </View>
        </View>




        )
    }
}
class CustomButton extends PureComponent{

    render(){
        const {title, onPress}=this.props;

        return (
            <TouchableOpacity style={styles.customButtonWarp}  onPress={onPress}>
                <Text style={styles.customButtonText}>{title}</Text>
            </TouchableOpacity>
        )
    }

}

class RepListFootComponent extends PureComponent{

    render(){

        const {lTitle,rTitle,lOnPress,rOnpress}=this.props;
        return(

            <View style={styles.footViewWarp}>
                <CustomButton title={lTitle} onPress={lOnPress}/>
                <CustomButton title={rTitle} onPress={rOnpress}/>
            </View>
        )
    }
}

class ListHeadComponent extends PureComponent{

    render(){

        return (
            <View style={{width:width,height:adapeSize(10)}}>

            </View>
        )

    }
}
class SeparatorComponent extends PureComponent{

    render(){

        return (
            <View style={{width:width-adapeSize(20),height:0.5,backgroundColor:'lightgray',marginLeft:adapeSize(10),marginRight:adapeSize(10)}}>

            </View>
        )

    }
}
class ListFootComponent extends PureComponent{

    render(){
        const {info}=this.props

        return (
            <View style={styles.listFootWarp}>
                <Text style={styles.listFootText}>{info}</Text>
            </View>
        )
    }

}

class ListFootComponentMore extends PureComponent{

    render(){
            return (
                <View style={styles.listFootWarp}>
                    <Text style={styles.listFootText}>{'加载更多。。。'}</Text>
                </View>
            )
        }
}
class ListFootComponentNorMore extends PureComponent{

    render(){

        return (
            <View style={styles.listFootWarp}>
                <Text style={styles.listFootText}>{'没有更多的数据'}</Text>
            </View>
        )
    }

}

class RepRateInput extends PureComponent{




    render(){

        const {typeName, onChangeText, defaultValue}=this.props;
        return (
            <View style={repStyles.rateInputWarp}>
                <Text style={{color:'gray'}}>{typeName}</Text>
                <TextInput ref={(inpt)=>{this.input=inpt}} defaultValue={defaultValue} onChangeText={onChangeText} underlineColorAndroid='transparent' keyboardType={'decimal-pad'} style={repStyles.rateinputstyle}/>
                <Text style={{color:'gray'}}>{'%'}</Text>
            </View>

        )
    }

}

class RepBordeInput extends PureComponent{

    render(){

        const {width,onChangeText,keyboardType,defaultValue}=this.props;
        return(
            <TextInput defaultValue={defaultValue} keyboardType={keyboardType} onChangeText={onChangeText} underlineColorAndroid='transparent' style={[repStyles.rateinputstyle,{width:width,marginLeft:adapeSize(10),marginBottom:adapeSize(10)}]}/>
        )

    }

}

export {ListFootComponent,CollectCustomerListItem,CollectCarListItem,ReportCustomerListItem,
    ListHeadComponent,SeparatorComponent,ListFootComponentMore,ListFootComponentNorMore,
    RepDetailListHeader,RepListFootComponent,RepRateInput,RepBordeInput
}


const styles=StyleSheet.create({

    ccListWarp:{
        backgroundColor:PAGECOLOR.white,
        padding:adapeSize(8),
        marginTop:adapeSize(10),
        marginLeft:adapeSize(10),
        marginRight:adapeSize(10)
    },
    ccListComponey:{

        fontSize:fontadapeSize(16),

    },
    ccListCarWarp:{
        flexDirection:'row',
        marginTop:adapeSize(16),
        marginBottom:adapeSize(4),
    },
    ccListCarWait:{

        fontSize:adapeSize(12)
    },

    ccListCarNum:{
        fontSize:adapeSize(12),
        color:'red'
    },
    cccCarType:{
       fontSize:adapeSize(16),
       marginTop:adapeSize(10),
       marginBottom:adapeSize(10),
    },
    cccCardetailType:{

        fontSize:adapeSize(16),
        color:PAGECOLOR.all_blue,
        marginBottom:adapeSize(8)
    },
    cccCarInfo:{
        fontSize:adapeSize(12),
        color:'gray',
        marginBottom:adapeSize(8),
    },
    listFootWarp:{

        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'

    },
    listFootText:{

        paddingTop:adapeSize(10),
        paddingBottom:adapeSize(10),

    },
    carStateWarp:{

        flexDirection:'row',
        justifyContent:'space-between'
    },
    carStateTextWarp:{
        backgroundColor:PAGECOLOR.all_blue,
        borderRadius:adapeSize(5)
    },
    carStateText:{
        margin:adapeSize(5),
        color:'white',

    },
    repHeadWarp:{
        backgroundColor:PAGECOLOR.white,
        paddingLeft:adapeSize(10),
        paddingRight:adapeSize(10),
    },
    repPeopleInf:{

        fontSize:fontadapeSize(14),
        marginTop:adapeSize(10),
        marginBottom:adapeSize(10),
    },
    repInfoWap:{

        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:adapeSize(10),
        marginBottom:adapeSize(5)
    },
    money:{

        color:'gray'

    },
    dateF:{
        color:'gray'
    },
    targetWarp:{

        backgroundColor:PAGECOLOR.deapGray,
        marginBottom:adapeSize(5)
    },
    targeText:{
        marginLeft:adapeSize(10),
        fontSize:adapeSize(14),
        color:PAGECOLOR.white,
        marginTop:adapeSize(5),
        marginBottom:adapeSize(5)
    },
    customButtonWarp:{

        backgroundColor:PAGECOLOR.all_blue,
        borderRadius:adapeSize(5),
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:adapeSize(10),
        marginRight:adapeSize(10)
    },

    customButtonText:{

        fontSize:adapeSize(18),
        color:PAGECOLOR.white,
        marginTop:adapeSize(10),
        marginBottom:adapeSize(10),

    },
    footViewWarp:{

        flexDirection:'row',
        marginTop:adapeSize(10),
        marginBottom:adapeSize(10)
    }


})

const repStyles=StyleSheet.create({

    rateInputWarp:{
        flexDirection:'row',
        marginLeft:adapeSize(10),
        marginTop:adapeSize(10),
        marginBottom:adapeSize(5),
    },
    rateinputstyle:{
        borderColor:PAGECOLOR.esc_button,
        borderWidth:0.5,
        borderRadius:adapeSize(4),
        height:adapeSize(20),
        width:adapeSize(80),
        marginLeft:adapeSize(20),
        marginRight:adapeSize(10),
        textAlign:'center'
    },


})