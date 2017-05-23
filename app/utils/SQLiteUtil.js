import React from 'react';
import SQLiteStorage from 'react-native-sqlite-storage';

SQLiteStorage.DEBUG(true);
var db;
const Collection_TABLE_NAME = "CarName";//收藏表
const PUBLISH_TABLE_NAME = "publishCar"; //发布编辑

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
        //盘库
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + "carcheckchoose" + '('
                + 'busno VARCHAR(20 default ""),'
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
        })

        //盘库
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + "carchecksuccess" + '('
                + 'busno VARCHAR(20) default "",'
                +'vin VARCHAR(20) PRIMARY KEY NOT NULL,'
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
        // console.log("SQLiteStorage " + name + " success");
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
            callBack({code:1,result:rs});
        }, function (error) {
            callBack({code:-1,error:error});
        });
    },
    /**
     * 增删改数据
     * params sql:操作语句 array：参数
     **/
    changeData(sql, array){
        if (!db) {
            this.open();
        }
        db.transaction(
            function (tx) {
                console.log('changeData');
                tx.executeSql(sql, array);
            }, function (error) {
                // console.log('shibai' + error.message);
            }, function () {
                // console.log('chenggong');
            }
        );
    }
});

module.exports = SQLite;