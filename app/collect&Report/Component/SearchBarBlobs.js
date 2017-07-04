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
import  {PAGECOLOR,width,height,adapeSize,fontadapeSize,dateFormat} from './MethodComponet'
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

        const {placehoder,wLineStyle}=this.props;
        return (

            <View style={[styles.cListSarchWarp,wLineStyle]}>
                <TextInput style={styles.ccInptList} placeholder={placehoder} onChangeText={this._onTextChange} underlineColorAndroid='transparent'/>
                <TouchableOpacity style={styles.ccSearchButton} onPress={this._onSearchBarClick}>
                    <Image style={{width:adapeSize(20),height:adapeSize(20)}} source={require('../../../images/assessment_customer_find.png')} />
                </TouchableOpacity>


            </View>
        )
    }

}

class RepListSearch extends PureComponent{

    state={

        buttonText:dateFormat(new Date(),'yyyy-MM')
    }
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
    _timeButtonClick=()=>{

        const {timeButtonClick} =this.props;
        timeButtonClick&&timeButtonClick();

    }
    _setTimeValue=(time)=>{

       this.setState({
           buttonText:time
       })

    }


    render(){
        const {placehoder}=this.props;
        return(
            <View style={styles.reporSearchWap}>
                <View style={styles.reporSarchInputWarp}>
                    <TextInput underlineColorAndroid='transparent' style={styles.reporInput} placeholder={'客户姓名关键字'} onChangeText={this._onTextChange}/>
                    <TouchableOpacity style={styles.ccSearchButton} onPress={this._onSearchBarClick}>
                        <Image style={{width:adapeSize(20),height:adapeSize(20)}} source={require('../../../images/assessment_customer_find.png')} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.reporButtonWarp} onPress={this._timeButtonClick}>
                    <Text ref={(text)=>{this.buttonText=text}} style={{marginLeft:adapeSize(5),marginRight:adapeSize(5), fontSize:fontadapeSize(11)}}>{this.state.buttonText}</Text>
                </TouchableOpacity>
            </View>
        )


    }



}



export {CustomListSearch,RepListSearch}

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

    },

    reporSearchWap:{

        flexDirection:'row',
    },
    reporSarchInputWarp:{

        width:width-adapeSize(90),
        height:adapeSize(60),
        backgroundColor:PAGECOLOR.all_background,

    },
    reporButtonWarp:{

        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
        marginTop:adapeSize(18),
        marginBottom:adapeSize(18),
        paddingLeft:adapeSize(5),
        paddingLeft:adapeSize(5),
        backgroundColor:PAGECOLOR.esc_button,
    },

    reporInput:{

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
    }









})