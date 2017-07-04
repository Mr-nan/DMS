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
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import  {PAGECOLOR,width,height,adapeSize,fontadapeSize,getCellHeight} from './MethodComponet'



class CustomButton extends  PureComponent{

    state={

        isSelected:false,
        disabled:false,
    }

    setSelected=(state)=>{


        this.setState({
            isSelected:state,
        })

    }

    render(){

        const {title, onPress}=this.props;
        return(
            <TouchableOpacity disabled={this.state.disabled}style={[styles.selectItem,this.state.isSelected&&{borderColor:PAGECOLOR.all_blue}]} onPress={onPress}>
                <Text style={[styles.selctItemText,this.state.isSelected&&{color:PAGECOLOR.all_blue}]}>{title}</Text>
            </TouchableOpacity>
            )
    }
}
class RfIdButton extends  PureComponent{

    state={

        isSelected:false,
    }
    setSelected=(state)=>{

        const {onPress}=this.props;
        this.setState({
            isSelected:state
        })
    }

    render(){

        const {onPress,title}=this.props;
        return(
            <TouchableOpacity activeOpacity={0.1} style={[styles.rfidWarp,this.state.isSelected&&{backgroundColor:PAGECOLOR.all_blue}]} onPress={onPress}>
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


    setText=(text)=>{

        this.input.setNativeProps({

            text:text
        })
    }

    render(){

        const {title,value, onPress, placeholder}=this.props;
        return(
            <View style={styles.titleWarp}>
                <Text style={styles.textleft}>{title}</Text>
                <TouchableOpacity style={styles.textinptuWarp} onPress={onPress}>
                    <TextInput underlineColorAndroid={'transparent'} ref={(ti)=>{this.input=ti}} editable={false} style={[styles.textRight,styles.tintput]} placeholder={placeholder} defaultValue={value}/>
                </TouchableOpacity>
            </View>
        )
    }
}

 class CollectTitelInput extends PureComponent{

    render(){

        const {title,value, placeholder, onEndEditing}=this.props;
        return(
            <View style={styles.titleWarp}>
                <Text style={styles.textleft}>{title}</Text>
                <View style={styles.textinptuWarp}>
                    <TextInput underlineColorAndroid={'transparent'} onEndEditing={onEndEditing} style={[styles.textRight,styles.tintput,]} placeholder={placeholder} defaultValue={value}/>
                </View>

            </View>
        )
    }

}


 class CollectButtonInput extends PureComponent{


    setTitle=(text)=>{

        this.input.setNativeProps({

            text:text
        })
    }

    render(){

        const {title,value, onPress, placeholder}=this.props;
        return(
            <View style={styles.titleWarp}>
                <TouchableOpacity style={styles.buttonWarp} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
                </TouchableOpacity>
                <View style={styles.textinptuWarp}>
                    <TextInput underlineColorAndroid={'transparent'} ref={(inpt)=>{this.input=inpt}}  style={[styles.textRight,styles.tintput]} placeholder={placeholder} defaultValue={value}/>
                </View>

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
     _selectButtonClick=(index,itemKey)=>{
         const {selectedIndex}=this.props;

         this.tempref.setSelected(false);
         let tempref=this.refBlobs[index];
         tempref.setSelected(true);
         this.tempref=tempref;
         selectedIndex(index,itemKey)
     }

    render(){
        const {titles,itemKey,defaultSelct}=this.props;
        let tempBlobs=[];
        titles.map((item,index)=>{

            let tempitem = <CustomButton ref={(cus)=>{this.refBlobs[index]=cus}} key={index} title={item} index={index} onPress={()=>{this._selectButtonClick(index,itemKey)}}/>
            tempBlobs.push(tempitem)
        })
        this.selectedIndex=defaultSelct-1;
        return(
            <View style={styles.selectStyle}>{tempBlobs}</View>
        )
    }


}

class CollectOBDRFID extends PureComponent{


    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {

            editAble:false
        };
      }
    componentDidMount() {

        const {selectType}=this.props;
        if(selectType==1){
            this._setStateScan()
        }else {
           this._setStateMark();
        }
    }
    _setTitle=(title)=>{

        this.input.setNativeProps({
            text:title
        })
    }
    _setStateMark =()=>{

        const {rfid,obdNumber}=this.props;

        this.bq.setSelected(true);
        this.obd.setSelected(false);
        this.input.setNativeProps({
            placeholder:'请扫描标签',
            text:rfid
        })
            this.setState({
                editAble:true
            })


    }
    _setStateScan=()=>{
        const {rfid,obdNumber}=this.props
        this.bq.setSelected(false);
        this.obd.setSelected(true);
        this.input.setNativeProps({
            placeholder:'请扫描OBD',
            text:obdNumber,
        })

        this.setState({
                editAble:false
            })
    }

    _bqClick=()=>{
       const {markScan}=this.props;
       this._setStateMark();
       markScan();
    }
    _obdClick=()=>{
        const {OBDScan}=this.props;
        this._setStateScan();
        OBDScan();
    }
    render(){
        return(
            <View style={styles.selectStyle}>

                <RfIdButton ref={(biaoqian)=>{this.bq=biaoqian}} onPress={this._bqClick} title={'扫描标签'}/>
                <RfIdButton ref={(obd)=>{this.obd=obd}}  onPress={this._obdClick} title={'扫描OBD'}/>
                <TextInput underlineColorAndroid={'transparent'} ref={(ip)=>{this.input=ip}} editable={this.state.editAble} style={[styles.tintput,{height:adapeSize(40),marginTop:adapeSize(3),textAlign:'right'}]}  placeholder={'请选择'}/>

            </View>
        )
    }

}
class CollectNestTep extends PureComponent{

    render(){

        const {onPress,title}=this.props;
        return (
            <TouchableOpacity style={{width:width,height:adapeSize(40),bottom:0,backgroundColor:PAGECOLOR.all_blue,justifyContent:'center',position: 'absolute',}}
                              onPress={onPress}>
                <Text style={styles.netTepText}>{title?title:'下一步'}</Text>
            </TouchableOpacity>
        )

    }

}

class NetWorkingImage extends PureComponent{

    state={
        error: false,
        loading: false,
        progress: 0
    }
// <Text>{this.state.progress}%</Text>
    render(){

        let loader=this.state.loading?
            <View>
                <ActivityIndicator style={{marginLeft:5}} />
            </View>:null;
       return this.state.error?<Text>{this.state.error}</Text>:
           <View>

               <TouchableOpacity onPress={this.props.imagePress}>
                   <Image
                       source={this.props.source}
                       style={[photoStyles.imagadd]}
                       onLoadStart={(e) => this.setState({loading: true})}
                       onError={(e) => this.setState({error: e.nativeEvent.error, loading: false})}
                       onProgress={(e) => this.setState({progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total)})}
                       onLoad={() => this.setState({loading: false, error: false})}>
                       {loader}
                   </Image>
               </TouchableOpacity>
               <TouchableOpacity style={photoStyles.deleteWarp} onPress={this.props.deleteOnpress}>
                   <Image
                       source={require('../../../images/deleteIcon.png')}
                       style={photoStyles.imageDelet}
                   />
               </TouchableOpacity>
           </View>

    }
}





 class   CollectPhotoSelect extends PureComponent{


    state={
        photoItem:this.props.cacheRows,
    }

     _setPhphoto=(data)=>{

            this.setState({
                photoItem:data
            })
 }
     onclick=()=>{
        const {addCarClick,index}=this.props;
        addCarClick(this.state.photoItem,index);
     }

     imagePress=(url)=>{
        const {imagePress}=this.props;
        imagePress(url.file_url);
     }


     deleteIndex=(itemindex,file_id)=>{

        const {imageDetele,index}=this.props;
        imageDetele(this.state.photoItem,file_id,index,itemindex)
     }

    render(){

        const {title}=this.props;
        let temp=[]
        this.state.photoItem.map((item,index)=>{

            temp.push(<NetWorkingImage key={index} source={{uri:item.file_url}} imagePress={()=>{this.imagePress(item)}} deleteOnpress={()=>{this.deleteIndex(index,item.file_id)}}/>)
        })

        const {addCarClick}=this.props;
        return(


            <View style={photoStyles.warp}>
                <Text style={photoStyles.photoText}>{title}</Text>
                <View style={photoStyles.photosWarp}>

                    <View style={photoStyles.uploaposWarp}>
                        {temp}
                    </View>
                    <TouchableOpacity style={photoStyles.imagadd} onPress={this.onclick}>
                        <Image style={[photoStyles.imagadd,{marginLeft:0}]} source={require('../../../images/carAdd.jpg')}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

export {CollectButtonInput,CollectDate,CollectTitelInput,CollectTitle,CollectSelect,CollectOBDRFID,CollectNestTep,CollectPhotoSelect}


const styles=StyleSheet.create({

    textinptuWarp:{

        flex:1,
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
        height:getCellHeight()
    },
    titleWarp:{

        flexDirection:'row',
        justifyContent:'space-between',
        marginLeft:adapeSize(10),
        marginRight:adapeSize(10),
        alignItems:'center',
        height:getCellHeight()
    },
    textleft:{

        textAlign:'left',
        marginTop:adapeSize(10),
        marginBottom:adapeSize(10),
        fontSize:fontadapeSize(14)
    },
    textRight:{

        textAlign:'right',

    },

    tintput:{
        width:adapeSize(160),

        fontSize:adapeSize(14)

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
        marginRight:adapeSize(10),
        height:getCellHeight()
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
        backgroundColor:'gray',
        borderRadius:adapeSize(5),
        marginTop:adapeSize(3),
        marginBottom:adapeSize(3),
        marginRight:adapeSize(10)
    }


})

const photoStyles=StyleSheet.create({

    warp:{
     marginLeft:adapeSize(10),
     marginRight:adapeSize(10),
    },
    photoText:{
        marginTop:adapeSize(5),
        marginBottom:adapeSize(5)
    },
    photosWarp:{

        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
        marginTop:adapeSize(5),
        marginBottom:adapeSize(10),
        width:width-adapeSize(20),
        height:(width-adapeSize(70))/5,
    },
    imagadd:{

        width:(width-adapeSize(70))/5,
        height:(width-adapeSize(70))/5,
        marginLeft:adapeSize(10)

    },
    imageDelet:{

        width:adapeSize(20),
        height:adapeSize(20),

    },
    deleteWarp:{
        position:'absolute',
        top:-5,

    },
    uploaposWarp:{
        flex:1,
        marginRight:adapeSize(10),
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    progress: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        width: 100
    },

})