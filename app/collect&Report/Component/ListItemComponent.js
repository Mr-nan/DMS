/**
 * Created by lcus on 2017/5/10.
 */
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import  {PAGECOLOR,width,height,adapeSize,fontadapeSize} from './MethodComponet'


class CollectCustomerListItem extends PureComponent{

    _onclick=(componeyId)=>{

        const {customListItemClick,merge_id}=this.props;
        customListItemClick(merge_id);
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

    _onclick=(carId)=>{

        const {carListItemClick}=this.props;
        carListItemClick(carId);
    }

    render(){

        const {carType,carDetailType,carFrameNumber,place} =this.props;

        return (
            <TouchableOpacity style={styles.ccListWarp} onPress={this._onclick}>
                <Text style={styles.cccCarType}>{carType}</Text>
                <Text style={styles.cccCardetailType}>{carDetailType}</Text>
                <Text style={styles.cccCarInfo}>{carFrameNumber}</Text>
                <Text style={styles.cccCarInfo}>{place}</Text>
            </TouchableOpacity>
        )
    }

}
class ReportCustomerListItem extends PureComponent{

    _onclick=(componeyId)=>{

        const {repCustomItemClick}=this.props;
        repCustomItemClick(componeyId);
    }

    render(){

        const {companyName,money,state} =this.props;
        return(
            <TouchableOpacity style={styles.ccListWarp} onPress={this._onclick}>
                <Text style={styles.ccListComponey}>{companyName}</Text>
                <View style={styles.ccListCarWarp}>
                    <Text style={styles.cccCarInfo}>{money}</Text>
                    <View>
                        <Text style={styles.cccCarInfo}>{'状态'}</Text>
                        <Text style={styles.ccListCarNum}>{state}</Text>
                    </View>
                </View>
            </TouchableOpacity>
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
            <View style={{width:width,height:adapeSize(4),backgroundColor:PAGECOLOR.all_background}}>

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

export {CollectCustomerListItem,CollectCarListItem,ReportCustomerListItem,ListHeadComponent,SeparatorComponent,ListFootComponentMore,ListFootComponentNorMore}


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
       fontSize:adapeSize(16)
    },
    cccCardetailType:{

        fontSize:adapeSize(16),
        color:'red',
    },
    cccCarInfo:{
        fontSize:adapeSize(12),
        color:'gray',
    },
    listFootWarp:{

        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'

    },
    listFootText:{

        paddingTop:adapeSize(10),
        paddingBottom:adapeSize(10),

    }


})