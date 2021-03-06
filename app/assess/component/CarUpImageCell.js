import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    NativeModules,
    Platform
} from 'react-native';
//图片加文字
const {width, height} = Dimensions.get('window');
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();
import * as fontAndColor from '../../constant/fontAndColor';
import StorageUtil from '../../utils/StorageUtil';
import * as StorageKeyNames from '../../constant/storageKeyNames';
import  CarImagePickerItem from './CarImagePickerItem';
import ImagePicker from "react-native-image-picker";
import * as Net from '../../utils/UpLoadFileUtil';
const IS_ANDROID = Platform.OS === 'android';

export  default class CarUpImageCell extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            childMovie: this.props.childList
        };
    }

    render() {
        console.log('results',this.props.results);
        let movie = this.props.items;
        let imageNumber = movie.number;
        let movieItems = [];
        if (this.state.childMovie.length > 0) {
            let length = 0;
            if (this.state.childMovie.length < imageNumber) {
                length = this.state.childMovie.length + 1;
            } else {
                length = this.state.childMovie.length;
            }
            for (let i = 0; i < length; i++) {

                movieItems.push(
                    <CarImagePickerItem
                        fileId={this.state.childMovie[i]}
                        imgUrl={this.state.childMovie[i]}
                        showOnPress={(imgUrl) => {
                            this.props.toNextPage('CarZoomImagScene',{
                                images:[{url:imgUrl}],
                                index:0
                            });
                        }}
                        deleteOnPress={(index, fileId) => {
                            let news = [];
                            news.push(...this.state.childMovie);
                            news.splice(index, 1);
                            for (let i = 0; i <= this.props.results.length; i++) {
                                if (this.props.results[i].file_id == fileId) {
                                    this.props.results.splice(i, 1);
                                    break;
                                }
                            }
                            this.props.retureSaveAction('0',fileId);
                            this.setState({childMovie: news});
                        }}
                        allLength={this.state.childMovie.length} key={i} index={i}
                        mOnPress={(index) => {
                            if (this.state.childMovie.length < imageNumber) {
                                this.selectPhotoTapped(movie.code)
                            }
                        }}/>)
            }
        } else {
            movieItems.push(<CarImagePickerItem allLength={this.state.childMovie.length} key={0} index={0}
                                                mOnPress={(index) => {
                                                    this.selectPhotoTapped(movie.code)
                                                }}/>)
        }

        return (
            <View style={styles.parentView}>
                <View style={{width: width, marginTop: Pixel.getPixel(15), flexDirection: 'row'}}>
                    {movie.explain == '1' ?
                        <Text style={{fontSize: fontAndColor.BUTTONFONT30, color: fontAndColor.COLORB2}}>*</Text> :
                        <View/>}
                    <Text style={{fontSize: fontAndColor.BUTTONFONT30, color: fontAndColor.COLORA0}}>{movie.name}</Text>
                    <Text style={{
                        fontSize: fontAndColor.BUTTONFONT30,
                        color: fontAndColor.COLORA1
                    }}>({movie.subTitle})</Text>
                </View>
                <View style={{width: width, marginTop: Pixel.getPixel(7), flexDirection: 'row', flexWrap: 'wrap'}}>
                    {movieItems}
                </View>
            </View>
        );
    }

    selectPhotoTapped = (id) => {
        if(IS_ANDROID === true){
            StorageUtil.mGetItem(StorageKeyNames.CAMERA_CUSTOM, (data) => {
                if (data.code == 1) {
                    if(data.result === '0' ){
                        //使用自定义相机
                        this.customeCamera(id);
                    }else if(data.result === '1' || data.result == null){
                        //使用系统相机
                        this.systemCamera(id);
                    }
                }
            });
        }else{
            this.systemCamera(id);
        }


    };

    systemCamera = (id) => {
        const options = {
            //弹出框选项
            title: '请选择',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            allowsEditing: true,
            noData: true,
            quality: 0.4,
            maxWidth: 480,
            maxHeight: 800,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            }
        };
        ImagePicker.launchCamera(options, (responsesss) => {
            if (responsesss.didCancel) {
            }
            else if (responsesss.error) {
            }
            else if (responsesss.customButton) {
            }
            else {
                this.props.showModal(true);

                Net.request(responsesss.uri).then(
                    (response)=>{
                        this.props.showModal(false);
                        this._delayShowHint('上传成功');
                        let news =[];
                        let rep = response.mjson;
                        news.push(...this.state.childMovie);
                        news.push({
                            file_url: rep.retdata[0].file_url,
                            file_id:rep.retdata[0].file_id
                        });
                        this.props.results.push({file_url: rep.retdata[0].file_url,
                            file_id:rep.retdata[0].file_id,syscodedata_id:this.props.items.syscodedata_id});
                        this.props.retureSaveAction('1',rep.retdata[0].file_id,rep.retdata[0].file_url);
                        this.setState({
                            childMovie:news,
                        });
                        if(IS_ANDROID === true){
                            console.log('file path',responsesss.path);
                            NativeModules.DmsCustom.deleteImageFile(responsesss.path);
                        }else{

                        }
                    },
                    (error)=>{
                        this.props.showModal(false);
                        this._delayShowHint('上传失败');
                    });

                // StorageUtil.mGetItem(StorageKeyNames.TOKEN, (data) => {
                //     if (data.code === 1) {
                //         let token = data.result;
                //         NativeModules.DmsCustom.uploadFile(appUrls.FILEUPLOAD, token, response.path,
                //             (response) => {
                //
                //                 this.props.showModal(false);
                //                 let rep = JSON.parse(response);
                //                 console.log('success', rep.retdata);
                //                 if(rep.retcode === 1){
                //                     this.props.showToast('上传成功');
                //                     let news =[];
                //                     news.push(...this.state.childMovie);
                //                     news.push({
                //                         file_url: rep.retdata[0].file_url,
                //                         file_id:rep.retdata[0].file_id
                //                     });
                //                     this.props.results.push({file_url: rep.retdata[0].file_url,
                //                         file_id:rep.retdata[0].file_id,syscodedata_id:this.props.items.syscodedata_id});
                //                     this.props.retureSaveAction('1',rep.retdata[0].file_id,rep.retdata[0].file_url);
                //                     this.setState({
                //                         childMovie:news,
                //                     });
                //                 }else{
                //                     this.props.showToast('上传失败');
                //                 }
                //
                //             }, (error) => {
                //                 this.props.showModal(false);
                //                 this.props.showToast('上传失败');
                //             });
                //     }
                // });
            }
        });
    };

    customeCamera = (id)=>{
        NativeModules.DmsCustom.customCamera(60,
            (success) => {
                this.props.showModal(true);
                Net.request(success.uri).then(
                    (response)=>{
                        this.props.showModal(false);
                        this._delayShowHint('上传成功');
                        let news =[];
                        let rep = response.mjson;
                        news.push(...this.state.childMovie);
                        news.push({
                            file_url: rep.retdata[0].file_url,
                            file_id:rep.retdata[0].file_id
                        });
                        this.props.results.push({file_url: rep.retdata[0].file_url,
                            file_id:rep.retdata[0].file_id,syscodedata_id:this.props.items.syscodedata_id});
                        this.props.retureSaveAction('1',rep.retdata[0].file_id,rep.retdata[0].file_url);
                        this.setState({
                            childMovie:news,
                        });
                        if(IS_ANDROID === true){
                            console.log('file path',success.path);
                            NativeModules.DmsCustom.deleteImageFile(success.path);
                        }else{

                        }
                    },
                    (error)=>{
                        this.props.showModal(false);
                        this._delayShowHint('上传失败');
                    });


            }, (error) => {
                this.props.showModal(false);
                this._delayShowHint(error);
            });
    };

    _delayShowHint = (hint) => {
        if(IS_ANDROID === true){
            this.props.showToast(hint);
        }else {
            this.timer = setTimeout(
                () => { this.props.showToast(hint); },
                500
            );
        }
    };

}
const styles = StyleSheet.create({
    parentView: {
        width: width,
        backgroundColor: '#ffffff',
        paddingLeft: Pixel.getPixel(15),
        paddingRight: Pixel.getPixel(15),
        paddingBottom: Pixel.getPixel(10)
    }
});