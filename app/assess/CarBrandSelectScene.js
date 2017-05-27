/**
 * Created by Administrator on 2017/5/20.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    ListView,
    Dimensions,
    Animated,
    TouchableOpacity
}from 'react-native';

import BaseComponent from '../component/BaseComponent';
import AllNavigationView from '../component/AllNavigationView';
import * as FontAndColor from '../constant/fontAndColor';
import PixelUtil from '../utils/PixelUtil';
const Pixel = new PixelUtil();
const {width} = Dimensions.get('window');
import * as Net from '../utils/RequestUtil';
import * as appUrls from '../constant/appUrls';

const car_icon_default = require('../../images/car_icon_default.png');

let carObject = {
    brand_id: '0',
    brand_icon: '',
    brand_name: '0',
    series_id: '0',
    series_name: '0',
    model_id: '0',
    model_name: '0'
};

export default class CarBrandSelectScene extends BaseComponent {

    constructor(props) {
        super(props);

        let getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        let getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ":" + rowID];
        };

        const dataSource = new ListView.DataSource({
            getSectionData: getSectionData,
            getRowData: getRowData,
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            dataSource: dataSource,
            sectionTitleArray: [],
            isHideCarSubBrand: true,
            isHideCarModel: true,
        };
    }

    initFinish = () => {
        this._showLoadingModal();
        Net.request(appUrls.AUTOGETBRANDLIST, 'post', {}).then(
            (response) => {
                let rb = response.mjson.retdata;
                this._setBrandList(rb);
            },
            (error) => {
                this._closeLoadingModal();
            }
        )
    };

    _showLoadingModal = () => {
        this.props.screenProps.showModal(true);
    };

    _closeLoadingModal = () => {
        this.props.screenProps.showModal(false);
    };

    _showHint = (hint) => {
        this.props.screenProps.showToast(hint);
    };

    _setBrandList = (rb) => {

        //按字母排序
        let iChars = [];
        let groups = [];
        rb.map((r) => {
            let flag = true;
            iChars.map((c) => {
                if (c === r.brand_initial) {
                    flag = false;
                }
            });
            if (flag) iChars.push(r.brand_initial);
        });

        iChars.sort();
        iChars.map((ic) => {
            let cars = [];
            rb.map((r) => {
                if (r.brand_initial === ic) {
                    cars.push(r);
                }
            });
            groups.push({
                title: ic,
                car: cars
            });
        });


        //生成ListView数据源
        this.carData = groups;
        let dataBlob = {}, sectionIDs = [], rowIDs = [], cars = [], sectionTitleArray = [];
        for (var i = 0; i < groups.length; i++) {
            //把组号放入sectionIDs数组中
            sectionIDs.push(i);
            //把组中内容放入dataBlob对象中
            dataBlob[i] = groups[i].title;
            sectionTitleArray.push(groups[i].title);
            //把组中的每行数据的数组放入cars
            cars = groups[i].car;
            //先确定rowIDs的第一维
            rowIDs[i] = [];
            //遍历cars数组,确定rowIDs的第二维
            for (var j = 0; j < cars.length; j++) {
                rowIDs[i].push(j);
                //把每一行中的内容放入dataBlob对象中
                dataBlob[i + ':' + j] = cars[j];
            }

        }

        this._closeLoadingModal();
        this.carData = groups;
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
            sectionTitleArray: sectionTitleArray,
        });

    };

    _indexAndScrollClick = (index) => {

        let scrollY = index * Pixel.getPixel(40);
        for (let i = 0; i < index; i++) {
            let rowIndex = this.carData[i].car.length;
            scrollY += +rowIndex * Pixel.getPixel(44);
        }
        this.listView.scrollTo({x: 0, y: scrollY, animated: true});


    };

    _checkedCarModel = (series_id) => {

        carObject.series_id = series_id;
        if (this.state.isHideCarModel) {


            this.setState({
                isHideCarModel: false,
            });

        } else {

            this.carModelList.loadCarModelsData(series_id);
        }

    };

    // 选择参数回传
    _checkedCarClick = (dt) => {

        this.props.navigation.state.params.checkedCarClick(dt);
        this.backPage();

    };

    // 每一组对应的数据
    renderSectionHeader = (sectionData, sectionId) => {

        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionText}>{sectionData}</Text>
            </View>
        );
    };

    // 每一行中的数据
    renderRow = (rowData, sectionID, rowID) => {
        return (
            <TouchableOpacity activeOpacity={0.6} onPress={
                () => {
                    carObject.brand_id = rowData.brand_id;
                    carObject.brand_name = rowData.brand_name;
                    if (this.state.isHideCarSubBrand) {
                        this.setState({
                            isHideCarSubBrand: false,
                        });

                    } else {
                        if (!this.state.isHideCarModel) {
                            this.setState({
                                isHideCarModel: true,
                            });

                        }
                        this.carSeriesList.loadCarSeriesData(carObject.brand_id);
                    }
                }}>
                <View style={styles.rowCell}>
                    <Image style={styles.rowCellImag}
                           source={rowData.brand_icon === null ? car_icon_default : {uri: rowData.brand_icon}}/>
                    <Text style={styles.rowCellText}>{rowData.brand_name}</Text>
                </View>
            </TouchableOpacity>

        )
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.wrapContainer}>
                    <ListView ref={(ref) => {
                        this.listView = ref
                    }}
                              dataSource={this.state.dataSource}
                              renderRow={this.renderRow}
                              renderSectionHeader={this.renderSectionHeader}
                              pageSize={100}
                              onScroll={() => {
                                  if (!this.state.isHideCarSubBrand) {
                                      this.setState({
                                          isHideCarSubBrand: true,
                                          isHideCarModel: true,
                                      });
                                  }
                              }}
                    />

                </View>
                <ZNListIndexView indexTitleArray={this.state.sectionTitleArray} indexClick={this._indexAndScrollClick}/>
                <AllNavigationView title={'添加车辆'} backIconClick={() => {
                    this.backPage();
                }} parentNavigation={this}/>
                {
                    this.state.isHideCarSubBrand ? (null) : (
                        <CarSeriesList ref={(ref) => {
                            this.carSeriesList = ref
                        }} checkedCarModel={this._checkedCarModel}/>
                    )
                }
                {
                    this.state.isHideCarModel ? (null) : (
                        <CarModelList ref={(ref) => {
                            this.carModelList = ref
                        }} checkedCarClick={this._checkedCarClick}/>
                    )
                }
            </View>
        );
    }

}

class CarSeriesList extends BaseComponent {

    componentDidMount() {

        this.state.valueRight.setValue(width);
        Animated.spring(
            this.state.valueRight,
            {
                toValue: width * 0.3,
                friction: 5,
            }
        ).start();

    }

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            valueRight: new Animated.Value(0),
            dataSource: ds
        };
        this.loadCarSeriesData(carObject.brand_id);
    }

    loadCarSeriesData = (carBrandID) => {

        let parameter = {
            brand_id: carBrandID,
        };
        Net.request(appUrls.AUTOGETSERIESLIST, 'post', parameter)
            .then((response) => {
                if (response.mjson.retdata.length) {
                    const ds = new ListView.DataSource({
                        rowHasChanged: (r1, r2) => r1 !== r2
                    });
                    this.setState({
                        dataSource: ds.cloneWithRows(response.mjson.retdata)
                    });
                } else {
                    alert('没数据');
                }
            }, (error) => {
            });

    };

    // 每一行中的数据
    _renderRow = (rowData) => {
        return (
            <TouchableOpacity onPress={() => {
                this.props.checkedCarModel(rowData.series_id)
            }}>
                <View style={styles.rowCell}>
                    <Text style={styles.rowCellText}>{rowData.series_name}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    render() {

        return (
            <Animated.View style={[styles.carSubBrandView, {left: this.state.valueRight}]}>
                <ListView
                    style={{flex: 1}}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                />
            </Animated.View>
        )

    }

}

class CarModelList extends BaseComponent {

    componentDidMount() {

        this.state.valueRight.setValue(width);
        Animated.spring(
            this.state.valueRight,
            {
                toValue: width * 0.5,
                friction: 5,
            }
        ).start();
    }

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = ({
            valueRight: new Animated.Value(0),
            modelsData: ds,
        });

        this.loadCarModelsData(carObject.series_id);
    }


    loadCarModelsData = (series_ID) => {

        let params = {
            series_id: series_ID
        };
        Net.request(appUrls.AUTOGETMODELLIST, 'post', params).then((response) => {

                if (response.mjson.retdata.length) {
                    this.setState({
                        modelsData: this.state.modelsData.cloneWithRows(response.mjson.retdata),
                    });
                }
            },
            (error) => {
            });
    };

    // 每一行中的数据
    _renderRow = (rowData) => {
        return (
            <TouchableOpacity onPress={() => {
                carObject.model_id = rowData.model_id;
                carObject.model_name = rowData.model_name;
                this.props.checkedCarClick(carObject);
            }}>
                <View style={styles.rowCell}>
                    <Text style={styles.rowCellText}>{rowData.model_name}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    render() {

        return (
            <Animated.View style={[styles.carSubModelView, {left: this.state.valueRight}]}>
                <ListView
                    style={{flex: 1}}
                    dataSource={this.state.modelsData}
                    renderRow={this._renderRow}
                />
            </Animated.View>
        )
    }

}

class ZNListIndexView extends Component {

    render() {
        const {indexTitleArray} = this.props;
        return (
            <View style={styles.indexView}>
                {
                    indexTitleArray.map((data, index) => {
                        return (
                            <TouchableOpacity key={index} style={styles.indexItem} onPress={() => {
                                this.props.indexClick(index);
                            }}>
                                <Text style={styles.indexItemText}>{data}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapContainer: {
        flex: 1,
        marginTop: Pixel.getTitlePixel(68),
        backgroundColor: FontAndColor.all_background
    },
    sectionHeader: {
        backgroundColor: FontAndColor.COLORA3,
        height: Pixel.getPixel(40),
        justifyContent: 'center'
    },
    sectionText: {
        marginLeft: Pixel.getPixel(31),
        color: FontAndColor.COLORA1,
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
    },
    rowCell: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: FontAndColor.COLORA3,
        height: Pixel.getPixel(44),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    rowCellImag: {
        width: Pixel.getPixel(40),
        height: Pixel.getPixel(40),
        marginLeft: Pixel.getPixel(15),
    },
    rowCellText: {
        marginLeft: Pixel.getPixel(5),
        color: FontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(FontAndColor.LITTLEFONT),
    },
    indexView: {
        position: 'absolute',
        bottom: 0,
        top: Pixel.getTitlePixel(113),
        backgroundColor: 'transparent',
        right: 0,
        width: Pixel.getPixel(45),
        alignItems: 'center',
        justifyContent: 'center',
    },
    indexItem: {
        marginTop: Pixel.getPixel(6),
        width: Pixel.getPixel(30),
        backgroundColor: 'transparent'
    },
    indexItemText: {
        color: FontAndColor.COLORA0,
        fontSize: Pixel.getFontPixel(FontAndColor.CONTENTFONT),
        textAlign: 'center'
    },
    carSubBrandView: {

        backgroundColor: 'white',
        top: Pixel.getTitlePixel(68),
        bottom: 0,
        position: 'absolute',
        width: width * 0.7,
        borderLeftWidth: 2,
        borderLeftColor: FontAndColor.COLORA3,

    },
    carSubModelView: {

        backgroundColor: 'white',
        top: Pixel.getTitlePixel(68),
        bottom: 0,
        position: 'absolute',
        width: width * 0.5,
        borderLeftWidth: 2,
        borderLeftColor: FontAndColor.COLORA3,

    },

});