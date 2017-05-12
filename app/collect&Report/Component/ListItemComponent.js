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

        const {customListItemClick}=this.props;
        customListItemClick(componeyId);
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

}
class SeparatorComponent extends PureComponent{


}

export {CollectCustomerListItem,CollectCarListItem,ReportCustomerListItem,ListHeadComponent,SeparatorComponent}


const styles=StyleSheet.create({

    ccListWarp:{
        backgroundColor:PAGECOLOR.white,
        marginLeft:adapeSize(10),
        marginBottom:adapeSize(10),
        paddingLeft:adapeSize(5),
        paddingRight:adapeSize(5),
    },
    ccListComponey:{

        fontsize:fontadapeSize(16),

    },
    ccListCarWarp:{
        flexDirection:'row',
        marginTop:adapeSize(10),
        marginBottom:adapeSize(10),
    },
    ccListCarWait:{

        fontSize:adapeSize(12)
    },

    ccListCarNum:{
        fontSize:adapeSize(12),
        color:'red'
    },
    cccCarType:{
       fontsize:adapeSize(16)
    },
    cccCardetailType:{

        fontSize:adapeSize(16),
        color:'red',
    },
    cccCarInfo:{
        fontSize:adapeSize(12),
        color:'gray',
    }

})