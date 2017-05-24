/**
 * Created by lcus on 2017/5/17.
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




class CustomButton extends  PureComponent{

    state={

        isSelected:false,
    }

    setSelected=(state)=>{

        this.setState({
            isSelected:state
            })
    }
    // _itemOnClick=()=>{
    //
    //     const {onPress}=this.props;
    //     onPress(this.setSelected)
    //
    // }

    render(){

        const {title, onPress}=this.props;
        return(
            <TouchableOpacity style={[styles.selectItem,this.state.isSelected&&{borderColor:PAGECOLOR.all_blue}]} onPress={onPress}>
                <Text style={[styles.selctItemText,this.state.isSelected&&{color:PAGECOLOR.all_blue}]}>{title}</Text>
            </TouchableOpacity>
            )
    }
}
class RfIdButton extends  PureComponent{

    state={

        isSelected:false,
    }
    setSelected=()=>{

        this.setState({
            isSelected:!this.state.isSelected
        })
    }

    render(){

        const {onPress,title}=this.props;
        return(
            <TouchableOpacity style={styles.rfidWarp} onPress={this.setSelected}>
                <Text style={[styles.selctItemText,{color:"white", fontSize:adapeSize(14)}]}>{title}</Text>
            </TouchableOpacity>
        )
    }

}


class CollectTitle extends  PureComponent{

    render(){

        const {title,value}=this.props;
        return(
            <View style={styles.titleWarp}>
                <Text style={styles.textleft}>{title}</Text>
                <Text style={styles.textRight}>{value}</Text>
            </View>
        )
    }
}
 class CollectDate extends PureComponent{

    render(){

        const {title,value, onPress, placeholder}=this.props;
        return(
            <View style={styles.titleWarp}>
                <Text style={styles.textleft}>{title}</Text>
                <TouchableOpacity style={{justifyContent:'center'}} onPress={onPress}>
                    <TextInput editable={false} style={[styles.textRight,styles.tintput]} placeholder={placeholder}/>
                </TouchableOpacity>
            </View>
        )
    }
}

 class CollectTitelInput extends PureComponent{

    render(){

        const {title,value, placeholder}=this.props;
        return(
            <View style={styles.titleWarp}>
                <Text style={styles.textleft}>{title}</Text>
                <TextInput  style={[styles.textRight,styles.tintput]} placeholder={placeholder}/>
            </View>
        )
    }

}


 class CollectButtonInput extends PureComponent{


    render(){

        const {title,value, onPress, placeholder}=this.props;
        return(
            <View style={styles.titleWarp}>
                <TouchableOpacity style={styles.buttonWarp} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
                </TouchableOpacity>
                <TextInput  style={[styles.textRight,styles.tintput]} placeholder={placeholder} defaultValue={value}/>
            </View>
        )
    }

}


 class CollectSelect extends PureComponent{

    refBlobs=[]
    selectedIndex='0';
    tempref;

     componentDidMount() {

         this.tempref=this.refBlobs[this.selectedIndex];
         this.tempref.setSelected(true)
     }
     _selectButtonClick=(index)=>{
         this.tempref.setSelected(false);
         let tempref=this.refBlobs[index];
         tempref.setSelected(true);
         this.tempref=tempref;

     }

    render(){
        const {titles}=this.props;
        let tempBlobs=[];
        titles.map((item,index)=>{

            let tempitem = <CustomButton ref={(cus)=>{this.refBlobs[index]=cus}} key={index} title={item} index={index} onPress={()=>{this._selectButtonClick(index)}}/>
            tempBlobs.push(tempitem)
        })
        this.selectedIndex='1';
        return(
            <View style={styles.selectStyle}>{tempBlobs}</View>
        )
    }


}

class CollectOBDRFID extends PureComponent{


    render(){

        return(
            <View style={styles.selectStyle}>

                <RfIdButton title={'扫描标签'}/>
                <RfIdButton title={'扫描OBD'}/>
                <TextInput style={[styles.tintput,{height:adapeSize(40),marginTop:adapeSize(3),textAlign:'right'}]} placeholder={'请选择'}/>

            </View>
        )
    }

}

class CollectNestTep extends PureComponent{

    render(){

        return (

            <TouchableOpacity style={{width:width,height:adapeSize(40),bottom:0,backgroundColor:PAGECOLOR.all_blue,justifyContent:'center',position: 'absolute',}}>
                <Text style={styles.netTepText}>{'下一步'}</Text>
            </TouchableOpacity>
        )

    }

}
//  class  CollectPhotoSelect extends PureComponent{
//
//
//
// }

export {CollectButtonInput,CollectDate,CollectTitelInput,CollectTitle,CollectSelect,CollectOBDRFID,CollectNestTep}


const styles=StyleSheet.create({

    titleWarp:{

        flexDirection:'row',
        justifyContent:'space-between',
        marginLeft:adapeSize(10),
        marginRight:adapeSize(10),
        alignItems:'center'
    },
    textleft:{

        textAlign:'left',
        marginTop:adapeSize(10),
        marginBottom:adapeSize(10),
        fontSize:fontadapeSize(14)
    },
    textRight:{

        textAlign:'right',
        marginTop:adapeSize(10),
        marginBottom:adapeSize(10),
    },
    tintput:{
        width:adapeSize(160),
        height:adapeSize(20),
        fontSize:adapeSize(12)

    },
    buttonWarp:{
        backgroundColor:PAGECOLOR.all_blue,
        borderRadius:adapeSize(5),
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText:{

        marginBottom:adapeSize(10),
        marginTop:adapeSize(10),
        marginLeft:adapeSize(5),
        marginRight:adapeSize(5),
        textAlign:'center',
        color:PAGECOLOR.white,
        fontSize:fontadapeSize(14)
    },
    selectStyle:{

        flexDirection:'row',
        alignItems:'center',
        marginLeft:adapeSize(10),
        marginRight:adapeSize(10)
    },
    selectItem:{
        borderRadius:adapeSize(5),
        borderColor:'gray',
        borderWidth:1,
        marginLeft:adapeSize(10),
        marginRight:adapeSize(10),
        marginTop:adapeSize(3),
        marginBottom:adapeSize(3)
    },


    selctItemText:{

        color:'gray',
        marginBottom:adapeSize(10),
        marginTop:adapeSize(10),
        marginLeft:adapeSize(5),
        marginRight:adapeSize(5),
    },
    netTepText:{

        marginBottom:adapeSize(5),
        marginTop:adapeSize(5),
        marginLeft:adapeSize(10),
        marginRight:adapeSize(10),
        textAlign:'center',
        color:'white',
        fontSize:adapeSize(18)

    },
    rfidWarp:{

       width:adapeSize(80),
       height:adapeSize(40),
       justifyContent:'center',
        alignItems:'center',
        backgroundColor:PAGECOLOR.all_blue,
        borderRadius:adapeSize(5),
        marginTop:adapeSize(3),
        marginBottom:adapeSize(3),
        marginRight:adapeSize(10)
    }


})

