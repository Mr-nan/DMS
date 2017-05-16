import StorageUtil from "./StorageUtil";
var Platform = require('Platform');
import * as StorageKeyNames from "../constant/storageKeyNames";
const request = (url, method, params,backToLogin) => {



    return new Promise((resolve, reject) => {
        StorageUtil.mGetItem(StorageKeyNames.TOKEN, (data) => {
            if (data.code === 1) {
                params.reqtoken = data.result;
                console.log('reqtoken===' + data.result);
            }

            if (Platform.OS === 'android') {
                params.device_code = 'dycd_dms_manage_android';
            } else {
                params.device_code = 'dycd_dms_manage_android';
            }

            let isOk;
            let body = '';
            for (let key of Object.keys(params)) {
                body += key;
                body += '=';
                body += params[key];
                body += '&';
            }
            if (body.length > 0) {
                body = body.substring(0, body.length - 1);
            }

            fetch(url + '?'+body, {
                method,
                body
            })
                .then((response) => {
                    if (response.ok) {
                        isOk = true;
                    } else {
                        isOk = false;
                    }
                    // console.log(response);
                    return response.json();
                })
                .then((responseData) => {
                    if (isOk) {
                        for (let key of Object.keys(params)) {
                            console.log(key+"===" + params[key]);
                        }
                        console.log("success----------" + JSON.stringify(responseData));
                        if (responseData.retcode == 1) {
                            resolve({mjson: responseData, mycode: 1});
                        } else {
                            if(responseData.code==7040011){
                                backToLogin();
                            }else{
                                reject({mycode: responseData.code, mjson: responseData});
                            }
                        }
                    }else{
                        console.log("error----------" + JSON.stringify(responseData));
                        reject({mycode: -300});
                    }
                })
                .catch((error) => {
                    console.log("error----------error" + error);
                    reject({mycode: -500, error: error});
                });
        })
    });
}

export {request};