/**
 * Created by zhengnan on 17/2/14.
 */
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';

import * as fontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();

export default class AllTitleNavigationView extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const {title, backIconClick, rightFootClick} = this.props;
        return (
            <View style={styles.navigation}>
                <View style={styles.content}>
                    <TouchableOpacity
                        style={styles.backContainer}
                        onPress={backIconClick}>
                        {
                            backIconClick &&
                            <Image style={styles.backIcon} source={require('../../images/navigatorBack.png')}/>
                        }
                    </TouchableOpacity>
                    <Text style={styles.titleText}>{title}</Text>
                    <TouchableOpacity
                        style={styles.imageFoot}
                        onPress={rightFootClick}>
                        {
                            rightFootClick &&
                            <Image style={styles.backIcon} source={require('../../images/title_setting.png')}/>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        marginTop: Pixel.getTitlePixel(20),
        height: Pixel.getPixel(48),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backContainer: {
        marginLeft: Pixel.getPixel(15),
        width: Pixel.getPixel(60),
        height: Pixel.getPixel(48),
        justifyContent: 'center'
    },
    backIcon: {
        height: Pixel.getPixel(22),
        width: Pixel.getPixel(22),
    },
    titleText: {
        color: 'white',
        fontSize: Pixel.getFontPixel(fontAndColor.NAVIGATORFONT34),
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
    imageFoot: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: Pixel.getPixel(60),
        marginRight: Pixel.getPixel(15),
    },
    navigation: {
        height: Pixel.getTitlePixel(68),
        backgroundColor: fontAndColor.all_blue,
        left: 0,
        right: 0,
        position: 'absolute',
        flex: 1
    }
});