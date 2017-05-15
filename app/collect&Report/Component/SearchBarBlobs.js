/**
 * Created by lcus on 2017/5/11.
 */
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import  {PAGECOLOR,width,height,adapeSize,fontadapeSize} from './MethodComponet'
import  {addTextValue} from './DecoratorBlobs'


const tempValue ={

    ccLsTempValue:''

}

class CustomListSearch extends PureComponent{

    componentWillMount() {
        tempValue.ccLsTempValue='';
    }
    _onTextChange=(text)=>{

        tempValue.ccLsTempValue=text;
    }
    _onSearchBarClick=()=>{

        const {onPress} =this.props;

        tempValue.ccLsTempValue&&onPress(tempValue.ccLsTempValue);
    }


    render(){

        return (

            <View style={styles.cListSarchWarp}>
                <TextInput style={styles.ccInptList} placeholder={'客户姓名关键字'} onChangeText={this._onTextChange}/>
                <TouchableOpacity style={styles.ccSearchButton} onPress={this._onSearchBarClick}>
                    <Image style={{width:adapeSize(20),height:adapeSize(20)}} source={require('../../../images/assessment_customer_find.png')} />
                </TouchableOpacity>


            </View>
        )
    }

}
export {CustomListSearch}

const  styles =StyleSheet.create({


    cListSarchWarp:{

        backgroundColor:PAGECOLOR.all_background,
        width:width,
        height:adapeSize(60),
        flexDirection:'row',
        alignItems:'flex-start',

    },
    ccInptList:{

        borderWidth:1,
        borderColor:PAGECOLOR.all_background,
        borderRadius:adapeSize(20),
        backgroundColor:PAGECOLOR.white,
        marginLeft:adapeSize(14),
        marginRight:adapeSize(14),
        paddingLeft:adapeSize(15),
        flex:1,
        marginTop:adapeSize(10),
        marginBottom:adapeSize(10),
    },
    ccSearchButton:{

        width:adapeSize(20),
        height:adapeSize(20),
        right:adapeSize(30),
        top:adapeSize(20),
        position:'absolute'

    }








})