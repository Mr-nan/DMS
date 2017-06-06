/**
 * Created by Administrator on 2017/6/5.
 */
import StorageUtil from "./StorageUtil";
var Platform = require('Platform');
import * as StorageKeyNames from "../constant/storageKeyNames";
import * as appUrls from '../constant/appUrls';

const request = (fileUri) => {

    return new Promise((resolve, reject) => {
        StorageUtil.mGetItem(StorageKeyNames.TOKEN, (data) => {
            if (data.code === 1) {
                let fileName = Date.parse(new Date());
                let token = data.result;
                let formData = new FormData();
                let file = {uri: fileUri, type: 'multipart/form-data', name: `${fileName}.png`};
                formData.append("reqtoken", token);

                if (Platform.OS === 'android') {
                    formData.append("device_code", "dycd_dms_manage_android")
                } else {
                    formData.append("device_code", "dycd_dms_manage_android")
                }

                formData.append('file', file);
                let isOk;
                fetch(appUrls.FILEUPLOAD, {
                    method: 'POST',
                    headers: {
                        'Content-Disposition': 'multipart/form-data',
                        'name': 'another',
                        'filename': `${fileName}.png`,
                    },
                    body: formData,
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
                            console.log("image upload success----------" + JSON.stringify(responseData));
                            if (responseData.retcode == 1) {
                                resolve({mjson: responseData, mycode: 1});
                            }else{
                                reject({mycode: -300});
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
            }
        })
    });


};

export {request};