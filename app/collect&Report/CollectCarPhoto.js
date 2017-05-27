/**
 * Created by lcus on 2017/5/11.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    FlatList,
    KeyboardAvoidingView,
    NativeModules
} from 'react-native';
import BaseComponent from '../component/BaseComponent'
import {CollectPhotoSelect} from './Component/CollectCarListComponent'
import * as apis from '../constant/appUrls'
import  {request} from '../utils/RequestUtil'
import {getTopdistance,STATECODE,height,adapeSize,dateFormat} from './Component/MethodComponet'
import {SeparatorComponent} from './Component/ListItemComponent'
import {commenStyle} from './Component/PageStyleSheet'
import ImagePicker from "react-native-image-picker";
import AllNavigationView from '../component/AllNavigationView';
import StorageUtil from '../utils/StorageUtil'
import * as StorageKeyNames from '../constant/storageKeyNames'

import SQLiteUtil from '../utils/SQLiteUtil';
const SQLite = new SQLiteUtil();

export default class CollectCarPhoto extends BaseComponent{

   state={data:[], vin:this.props.navigation.state.params.vin}
   tempCellBlobs={};


    initFinish(){
        let dataS = [
            {title: '车辆照片（体现防伪标签和车架号）', key: 'vin', default: []},
            {title: '登记证', key: 'dengji', default: []},
            {title: '行驶证', key: 'xingshi', default: []},
            {title: '钥匙', key: 'key', default: []},
            {title: '车主身份证', key: 'idcard', default: []},
            {title: '车辆权属声明', key: 'sm', default: []},
            {title: '保单', key: 'bd', default: []},
            {title: '预审单', key: 'ysd', default: []},
            {title: '行驶证', key: 'xsz', default: []},
            {title: '委托书', key: 'wts', default: []},
            {title: '买卖合同', key: 'ht', default: []},
            {title: '其他', key: 'other', default: []}]
            SQLite.selectData('SELECT * FROM carImageInfo WHERE vin= ?',[this.state.vin],
                (data)=>{

                    if(data.code==1){
                        let temp =data.result.rows.length;
                        if (temp>0){

                          for(let i=0;i<temp;i++){

                              let cacheRow=data.result.rows.item(i);

                              dataS.map((item)=>{

                                  if(item.key==cacheRow.syscodedata_id){
                                      item.default.push(cacheRow.file_url);
                                  }
                              })

                          }

                        }}
                    this.setState({
                        data:dataS,

                    })
                })

    }
    _addImagePiker=(dataSource,index)=>{


        let tempDataSource=[...dataSource];
        if(tempDataSource.length<4){
            const options = {
                //弹出框选项
                title: '请选择',
                cancelButtonTitle: '取消',
                takePhotoButtonTitle: '拍照',
                chooseFromLibraryButtonTitle: '选择相册',
                allowsEditing: false,
                noData: false,
                quality: 1.0,
                maxWidth: 480,
                maxHeight: 800,
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                }};
            ImagePicker.showImagePicker(options, (response) => {
                if (response.didCancel) {}
                else if (response.error) {}
                else if (response.customButton) {}
                else {
                    this._uploadPicture(response,index,tempDataSource);
                }
            });
        }else {

            alert('最多可以传4张照片')
        }



    }
    _uploadPicture=(response,index, dataSource)=>{
        this.props.screenProps.showModal(true);
        StorageUtil.mGetItem(StorageKeyNames.TOKEN, (data) => {
            if (data.code === 1) {

                let fileName =Date.parse(new Date());
                let token = data.result;
                let formData = new FormData();
                let file = {uri:response.uri, type: 'multipart/form-data', name:`${fileName}.png`};
                formData.append("reqtoken",token)
                formData.append("device_code","dycd_dms_manage_android")
                formData.append('file',file)

                fetch(apis.FILEUPLOAD,{
                    method:'POST',
                    headers:{
                        'Content-Disposition':'multipart/form-data',
                        'name':'another',
                        'filename':`${fileName}.png`,
                    },
                    body:formData,
                })
                    .then((response) => response.json())
                    .then((responseData)=>{
                        this.props.screenProps.showModal(false);
                    let tempdata=responseData.retdata[0];
                        dataSource.push(tempdata.file_url);

                        SQLite.changeData('INSERT INTO carImageInfo (vin,syscodedata_id,file_url,file_id) VALUES(?,?,?,?)',
                            [this.state.vin,this.state.data[index].key,tempdata.file_url,tempdata.file_id])

                        this.tempCellBlobs[index]._setPhphoto(dataSource);

                    })
                    .catch((error)=>{
                    console.error('error',error)
                        this.props.screenProps.showModal(false);
                });
            }})
        let data = new FormData()

    }



    _renderItem=(data)=>{

        return <CollectPhotoSelect ref={(photo)=>{this.tempCellBlobs[data.index]=photo}} index={data.index} addCarClick={this._addImagePiker}title={data.item.title} cacheRows={data.item.default}/>
    }
    render(){


        return(
            <View style={commenStyle.commenPage}>
                <View style={commenStyle.testUI}>
                <FlatList
                    data={this.state.data}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => item.key}
                    ItemSeparatorComponent={SeparatorComponent}
                    getItemLayout={(data, index) => (
                        {length: 40, offset: 40 * index, index}
                    )}
                />
                </View>
                <AllNavigationView title={'收车'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>

            </View>
        )


    }

}
