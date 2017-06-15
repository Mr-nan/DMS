import React from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Dimensions
} from  'react-native';
import AllNavigationView from '../component/AllNavigationView';
import ImageViewer from 'react-native-image-zoom-viewer';
import BaseComponent from '../component/BaseComponent';
import * as fontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();

export default class BrowseImageView extends BaseComponent{

    render(){
        return(
                <View style={styles.rootContainer}>
                    <ImageViewer imageUrls={this.props.navigation.state.params.images}
                                 loadingRender={this.renderLoading}
                                 onCancel={this.onCancel}
                                 index={this.props.navigation.state.params.index}
                                 onClick={this.onCancel}
                                 saveToLocalByLongPress={false}
                    />
                    <AllNavigationView title={'图片浏览'} backIconClick={() => {
                        this.backPage();
                    }}/>
                </View>
        )
    }

    renderLoading = ()=> {
        return (
            <ActivityIndicator color='white' animating={true} size='large'/>
        )
    };
    onCancel=()=>{
        this.backPage();
    }

}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: fontAndColor.COLORA3,
        paddingTop: Pixel.getTitlePixel(64),
    },
    contaier:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    headView:{
        width:Dimensions.get('window').width,
        height:Pixel.getPixel(68),
        backgroundColor:fontAndColor.COLORB0,
    },
    backIcon: {
        marginLeft: Pixel.getPixel(12),
        height: Pixel.getPixel(20),
        width: Pixel.getPixel(20),
        backgroundColor:'yellow'
    },

});