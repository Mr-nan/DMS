import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);
var db;
const NEW_CAR = "newcar"; //添加新车

const SQLite = React.createClass({

    render(){
        return null;
    },
    componentWillUnmount(){
        if (db) {
            this._successCB('close');
            db.close();
        } else {
            // console.log("SQLiteStorage not open");
        }

    },
    open(){
        db = SQLiteStorage.openDatabase(
            {name: "mydata", createFromLocation: '~data/mydata.db'},
            () => {
                this._successCB('open');
            },
            (err) => {
                this._errorCB('open', err);
            });
    },
    createTable(){
        if (!db) {
            this.open();
        }

        //添加新车
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + NEW_CAR + '('
                + 'accident varchar(20) default "",'
                + 'auto_base_id varchar(20) default "",'
                + 'brand_id varchar(20) default "",'
                + 'car_box varchar(20) default "",'
                + 'car_color varchar(20) default "",'
                + 'car_condition varchar(20) default "",'
                + 'car_door varchar(20) default "",'
                + 'car_seat varchar(20) default "",'
                + 'car_status varchar(20) default "",'
                + 'certification varchar(20) default "",'
                + 'chechong_mny varchar(20) default "",'
                + 'che300_mny varchar(20) default "",'
                + 'dealer_price varchar(20) default "",'
                + 'displacement varchar(20) default "",'
                + 'engine_number varchar(20) default "",'
                + 'viewing_position varchar(300) default "",'
                + 'frame_number varchar(20) default "" unique, '
                + 'gearbox varchar(20) default "",'
                + 'gearbox_speed varchar(20) default "",'
                + 'group_id varchar(50) default "",'
                + 'init_reg varchar(20) default "",'
                + 'ip varchar(20) default "",'
                + 'remark varchar(200) default "",'
                + 'is_new varchar(20) default "",'
                + 'isshow varchar(20) default "",'
                + 'last_update_time varchar(20) default "",'
                + 'maintenance varchar(20) default "",'
                + 'manufacture varchar(20) default "",'
                + 'merge_id varchar(20) default "",'
                + 'model_id varchar(20) default "",'
                + 'nature_use varchar(20) default "",'
                + 'personal_price varchar(20) default "",'
                + 'plate_number varchar(20) default "",'
                + 'retail_price varchar(20) default "",'
                + 'rfid_damaged varchar(20) default "",'
                + 'region_assess_mny varchar(20) default "",'
                + 'record_type varchar(20) default "",'
                + 'series_id varchar(20) default "",'
                + 'status varchar(20) default "",'
                + 'storage_id varchar(20) default "",'
                + 'transfer_count varchar(20) default "",'
                + 'mileage varchar(20) default "",'
                + 'tablestatus varchar(20) default "",'
                + 'trim_color varchar(20) default "",'
                + 'region_rebate varchar(20) default "",'
                + 'updatetime varchar(20) default "",'
                + 'user_id varchar(20) default "",'
                + 'lend_mny varchar(20) default "",'
                + 'wading varchar(20) default "");'
                , [], () => {
                    this._successCB('executeSql');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        });

        //新车添加图片
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + "carimage" + '('
                + 'file_url varchar(100) default "",'
                + 'file_id varchar(20) default "",'
                + 'file_name varchar(100) default "",'
                + 'syscodedata_id varchar(20) default "",'
                + 'frame_number varchar(20) default "");'
                , [], () => {
                    this._successCB('executeSql');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        });

        //盘库
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + "carcheckchoose" + '('
                + 'busno VARCHAR(20) default "",'
                +'type VARCHAR(20) default "");'
                , [], () => {
                    this._successCB('executeSql');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        });

        //盘库
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + "carchecksuccess" + '('
                + 'busno VARCHAR(20) default "",'
                + 'vin VARCHAR(20) PRIMARY KEY NOT NULL,'
                +'excecode VARCHAR(20) default "1205",'
                +'execinfo VARCHAR(20) default "正常",'
                +'rfid_img_id VARCHAR(20) default "",'
                +'type VARCHAR(20) default "",'
                +'brand VARCHAR(20) default "",'
                +'chk_time VARCHAR(20) default "1205",'
                +'name VARCHAR(20) default "正常",'
                +'storage VARCHAR(20) default "",'
                +'chkno VARCHAR(20) default "",'
                +'newrfid VARCHAR(20) default "");'
                , [], () => {
                    this._successCB('executeSql');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })


        //收车
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + "carCollectInfo" + '('
                + 'vin VARCHAR(20) default "",'
                + 'onstorge VARCHAR(20) default "",'
                + 'oncard VARCHAR(20) default "",'
                + 'owner VARCHAR(20) default "",'
                + 'ownership VARCHAR(20) default "",'
                + 'allin VARCHAR(20) default "",'
                + 'rg_type VARCHAR(20) default "",'
                + 'regbr VARCHAR(20) default "",'
                + 'runbr VARCHAR(20) default "",'
                + 'carid VARCHAR(20) default "",'
                + 'obd_number VARCHAR(20) default "",'
                + 'store_type VARCHAR(20) default "",'
                + 'rfid VARCHAR(20) default "");'
                , [], () => {
                    this._successCB('executeSql');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })
        //收车图片
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + "carImageInfo" + '('
                + 'file_url varchar(20) default "",'
                + 'file_id varchar(20) default "",'
                + 'syscodedata_id varchar(20) default "",'
                + 'vin varchar(20) default "");'
                , [], () => {
                    this._successCB('executeSql');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })

    },
    close(){
        if (db) {
            this._successCB('close');
            db.close();
        } else {
            // console.log("SQLiteStorage not open");
        }
        db = null;
    },
    _successCB(name){
        console.log("SQLiteStorage " + name + " success");
    },
    _errorCB(name, err){
        // console.log("SQLiteStorage " + name + " error:" + err);
    },
    /**
     * 查询数据
     * params sql:操作语句 array:参数 callBack:回调
     **/
    selectData(sql, array, callBack){
        if (!db) {
            this.open();
        }
        db.executeSql(sql, array, function (rs) {
            callBack({code: 1, result: rs});
        }, function (error) {
            callBack({code: -1, error: error});
        });
    },
    /**
     * 增删改数据
     * params sql:操作语句 array：参数
     **/
    changeData(sql, array,callBack){
        if (!db) {
            this.open();
        }
        db.transaction(
            function (tx) {
                // console.log('changeData');
                tx.executeSql(sql, array);
            }, function (error) {
                console.log('shibai' + error.message);
            }, function () {
                callBack();
                console.log('chenggong');
            }
        );
    }
});

module.exports = SQLite;