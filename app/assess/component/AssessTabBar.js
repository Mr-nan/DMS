/**
 * Created by Administrator on 2017/5/17.
 */
import React,{PureComponent} from 'react';
const {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated
} = ReactNative;

import * as FontAndColor from '../../constant/fontAndColor';
import PixelUtil from '../../utils/PixelUtil';
const Pixel = new PixelUtil();

export default class AssessTabBar extends PureComponent{

    renderTab(name, page, isTabActive, onPressHandler) {
        const activeTextColor = FontAndColor.black;
        const inactiveTextColor = FontAndColor.txt_gray;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;

        return <TouchableOpacity
            style={{flex: 1, }}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
        >
            <View style={[styles.tab ]}>
                <Text style={[{color: textColor }]}>
                    {name}
                </Text>
            </View>
        </TouchableOpacity>;
    }

    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: Pixel.getPixel(2),
            backgroundColor: FontAndColor.all_blue,
            bottom: 0,
        };

        const left = this.props.scrollValue.interpolate({
            inputRange: [0, 1, ], outputRange: [0,  containerWidth / numberOfTabs, ],
        });
        return (
            <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
                {this.props.tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    const renderTab = this.props.renderTab || this.renderTab;
                    return renderTab(name, page, isTabActive, this.props.goToPage);
                })}
                <Animated.View style={[tabUnderlineStyle, { left, }, this.props.underlineStyle, ]} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabs: {
        height: Pixel.getPixel(40),
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
});

