package com.dms.custom;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.util.Log;

import com.dms.custom.bluetooths.BluetoothControl;
import com.dms.custom.bluetooths.IBluetoothCallBack;
import com.dms.custom.bluetooths.ItemBluetoothDevice;
import com.dms.custom.idcard.IDCardActivity;
import com.dms.custom.qr.scan.ScanCaptureAct;
import com.dms.custom.utils.IUpLoadImageResult;
import com.dms.custom.utils.ImageUtil;
import com.dms.custom.utils.SoundUtil;
import com.dms.custom.utils.UpLoadFile;
import com.dms.custom.vin.scan.FDScanActivity;
import com.dms.custom.vin.scan.VLScanActivity;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;

/**
 * Created by Administrator on 2017/5/11.
 */

public class DmsCustomModule extends ReactContextBaseJavaModule implements ActivityEventListener {


    private final int QR_REQUEST = 0;
    private final int VIN_REQUEST = 1;
    private final int VL_REQUEST = 2;
    private final int SD_REQUEST = 3;
    private Callback qr_success_ck;
    private Callback vin_success_ck;
    private Callback vl_success_ck;
    private Callback sd_success_ck;


    private Context mContext;

    public DmsCustomModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
        mContext = reactContext;

        //蓝牙
        mBluetoothControl = BluetoothControl.getInstance(reactContext, new IBluetoothCallBack() {

            //扫描蓝牙回调
            @Override
            public void findCallBack(ItemBluetoothDevice item) {
                WritableMap map = Arguments.createMap();
                map.putString("name", item.getName());
                map.putString("rssi", item.getRssi());
                map.putString("address", item.getAddress());
                sendEvent("findBluetooth", map);
            }

            //连接设备回调
            @Override
            public void connectionCallBack(boolean can) {
                WritableMap map = Arguments.createMap();
                map.putString("can", can ? "1" : "0");
                sendEvent("onBleConnection", map);
            }

            //读取数据回调
            @Override
            public void readCallBack(String result) {
                WritableMap map = Arguments.createMap();
                map.putString("result", result);
                sendEvent("onReadData", map);
            }

            @Override
            public void permissionCallBack() {

            }

            @Override
            public void errorCallBack(String address) {

            }
        });
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == QR_REQUEST) {
            WritableMap map = Arguments.createMap();
            if (resultCode == Activity.RESULT_CANCELED) {
                map.putString("fail","Result_Canceled");
                qr_success_ck.invoke(map);
                qr_success_ck = null;
            } else if (resultCode == Activity.RESULT_OK) {
                boolean scan_hand = data.getBooleanExtra("SCAN_HAND", false);
                String scan_result = data.getStringExtra("SCAN_RESULT");
                WritableMap map2 = Arguments.createMap();
                map2.putString("scan_hand", scan_hand ? "input" : "scan");
                map2.putString("scan_result", scan_result);

                map.putMap("suc",map2);
                qr_success_ck.invoke(map);
                qr_success_ck = null;
            }
        } else if (requestCode == VIN_REQUEST) {
            WritableMap map = Arguments.createMap();
            if (resultCode == Activity.RESULT_CANCELED) {
                map.putString("fail", "Result_Canceled");
                vin_success_ck.invoke(map);
                vin_success_ck = null;
            } else if (resultCode == Activity.RESULT_OK) {
                String vin = data.getStringExtra("vin");
                WritableMap map2 = Arguments.createMap();
                map2.putString("vin", vin);
                map.putMap("suc",map2);
                vin_success_ck.invoke(map);
                vin_success_ck = null;
            }
        } else if (requestCode == VL_REQUEST) {
            WritableMap map = Arguments.createMap();
            if (resultCode == Activity.RESULT_CANCELED) {
                map.putString("fail", "Result_Canceled");
                vl_success_ck.invoke(map);
                vl_success_ck = null;
            } else if (resultCode == Activity.RESULT_OK) {
                WritableMap map2 = Arguments.createMap();
                map2.putString("carPlate", data.getStringExtra("carPlate"));
                map2.putString("carType", data.getStringExtra("carType"));
                map2.putString("carOwner", data.getStringExtra("carOwner"));
                map2.putString("carAddress", data.getStringExtra("carAddress"));
                map2.putString("carNature", data.getStringExtra("carNature"));
                map2.putString("carBrand", data.getStringExtra("carBrand"));
                map2.putString("carVl", data.getStringExtra("carVl"));
                map2.putString("carEngine", data.getStringExtra("carEngine"));
                map2.putString("carReg", data.getStringExtra("carReg"));
                map2.putString("carCert", data.getStringExtra("carCert"));
                map.putMap("suc", map2);

                vl_success_ck.invoke(map);
                vl_success_ck = null;
            }
        } else if (requestCode == SD_REQUEST) {
            WritableMap map = Arguments.createMap();
            if (resultCode == Activity.RESULT_CANCELED) {
                map.putString("fail","Result_Canceled");
                sd_success_ck.invoke(map);
                sd_success_ck = null;
            } else if (resultCode == Activity.RESULT_OK) {
                map.putString("suc",data.getStringExtra("recogResult"));
                sd_success_ck.invoke(map);
                sd_success_ck = null;
            }
        }

    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    public void sendEvent(String eventName,
                          @Nullable WritableMap params) {
        getReactApplicationContext()
                .getJSModule(RCTNativeAppEventEmitter.class)
                .emit(eventName, params);
    }

    @Override
    public String getName() {
        return "DmsCustom";
    }

    /********************************************
     * 评估照片压缩
     *******************************************/
    @ReactMethod
    public void assessCompress(String uri,Callback callback){
        String filePath = ImageUtil.getRealPathFromURI(mContext,Uri.parse(uri));
    }

    /********************************************
     * 身份证扫描
     *******************************************/
    @ReactMethod
    public void scanID(Callback dsCallback) {
        sd_success_ck = dsCallback;
        Activity currentActivity = getCurrentActivity();
        WritableMap map = Arguments.createMap();
        if (currentActivity == null) {
            map.putString("fail","扫描失败_01");
            sd_success_ck.invoke(map);
            sd_success_ck = null;
            return;
        }
        try {
            Intent vlIntent = new Intent(currentActivity, IDCardActivity.class);
            currentActivity.startActivityForResult(vlIntent, SD_REQUEST);
        } catch (Exception e) {
            map.putString("fail",e.toString());
            sd_success_ck.invoke(map);
            sd_success_ck = null;
        }
    }

    /********************************************
     * 行驶证扫描
     *******************************************/
    @ReactMethod
    public void scanVL(Callback lsCallback) {
        vl_success_ck = lsCallback;
        Activity currentActivity = getCurrentActivity();
        WritableMap map = Arguments.createMap();
        if (currentActivity == null) {
            map.putString("fail", "扫描失败_01");
            vl_success_ck.invoke(map);
            vl_success_ck = null;
            return;
        }
        try {
            Intent vlIntent = new Intent(currentActivity, VLScanActivity.class);
            currentActivity.startActivityForResult(vlIntent, VL_REQUEST);
        } catch (Exception e) {
            map.putString("fail", e.toString());
            vl_success_ck.invoke(map);
            vl_success_ck = null;
        }
    }


    /********************************************
     * 前风挡扫描
     *******************************************/
    @ReactMethod
    public void scanVin(Callback vsCallback) {
        vin_success_ck = vsCallback;
        Activity currentActivity = getCurrentActivity();
        WritableMap map = Arguments.createMap();
        if (currentActivity == null) {
            map.putString("fail", "扫描失败_01");
            vin_success_ck.invoke(map);
            vin_success_ck = null;
            return;
        }
        try {
            Intent vlIntent = new Intent(currentActivity, FDScanActivity.class);
            currentActivity.startActivityForResult(vlIntent, VIN_REQUEST);
        } catch (Exception e) {
            map.putString("fail", e.toString());
            vin_success_ck.invoke(map);
            vin_success_ck = null;
        }
    }


    /********************************************
     * 文件上传
     *******************************************/
    @ReactMethod
    public void uploadFile(String url, String token, String filePath,
                           final Callback up_s_ck, final Callback up_e_ck) {

        UpLoadFile.upload(url, token, filePath, new IUpLoadImageResult() {
            @Override
            public void success(String response) {
                up_s_ck.invoke(response);
            }

            @Override
            public void error(int arg0, String arg2) {
                up_e_ck.invoke(arg2);
            }

            @Override
            public void progress(int count) {
                WritableMap map = Arguments.createMap();
                map.putString("progress", count + "");
                sendEvent("onProgress", map);
            }
        });
    }


    /********************************************
     * 扫描声音
     *******************************************/
    @ReactMethod
    public void scanSound(int type) {
        if (type == 1) {
            SoundUtil.getInstance(mContext).soundSuccess();
        } else {
            SoundUtil.getInstance(mContext).soundError();
        }
    }


    /********************************************
     * 扫描条形码
     *******************************************/
    @ReactMethod
    public void qrScan(Callback qsCallback) {

        qr_success_ck = qsCallback;
        Activity currentActivity = getCurrentActivity();
        WritableMap map = Arguments.createMap();
        if (currentActivity == null) {
            map.putString("fail","扫描失败_01");
            qr_success_ck.invoke(map);
            qr_success_ck = null;
            return;
        }
        try {
            Intent vlIntent = new Intent(currentActivity, ScanCaptureAct.class);
            currentActivity.startActivityForResult(vlIntent, QR_REQUEST);
        } catch (Exception e) {
            map.putString("fail",e.toString());
            qr_success_ck.invoke(map);
            qr_success_ck = null;
        }
    }


    /********************************************
     * 蓝牙
     *******************************************/
    private BluetoothControl mBluetoothControl;

    //开启蓝牙
    @ReactMethod
    public void startBluetooth() {
        mBluetoothControl.startBluetooth();
    }

    //扫描蓝牙
    @ReactMethod
    public void startFind(Callback successRep) {
        WritableMap map = Arguments.createMap();
        if (mBluetoothControl.startFind()) {
            map.putString("suc","正在扫描");
            successRep.invoke(map);
        } else {
            map.putString("fail","请先开启蓝牙");
            successRep.invoke(map);
        }
    }

    //停止扫描
    @ReactMethod
    public void stopFind() {
        mBluetoothControl.stopFind();
    }

    //连接设备
    @ReactMethod
    public void startConnection(String names, String address) {
        mBluetoothControl.startConnection(names, address);
    }

    //是否已连接设备
    @ReactMethod
    public void isConnection(Callback callback) {
        WritableMap map = Arguments.createMap();
        if (mBluetoothControl.isConnection()) {
            map.putString("suc","1");
            callback.invoke(map);
        } else {
            map.putString("suc","0");
            callback.invoke(map);
        }
    }

    //已连接的设备名称
    @ReactMethod
    public void getConnectionDevice(Callback callback) {
        WritableMap map = Arguments.createMap();
        map.putString("suc",mBluetoothControl.getConnectionDevice());
        callback.invoke(map);
    }


}
