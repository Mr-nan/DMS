package com.dms.custom;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.annotation.Nullable;
import android.util.Log;

import com.dms.custom.bluetooths.BluetoothControl;
import com.dms.custom.bluetooths.IBluetoothCallBack;
import com.dms.custom.bluetooths.ItemBluetoothDevice;
import com.dms.custom.qr.scan.ScanCaptureAct;
import com.dms.custom.utils.SoundUtil;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;

import java.io.Console;

import rtzltech.cn.jni.RFIDUtils;

/**
 * Created by Administrator on 2017/5/11.
 */

public class DmsCustomModule extends ReactContextBaseJavaModule implements ActivityEventListener {


    private final int QR_REQUEST = 0;
    private Callback qr_success_ck;
    private Callback qr_fail_ck;
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
                map.putString("name",item.getName());
                map.putString("rssi",item.getRssi());
                map.putString("address",item.getAddress());
                sendEvent("findBluetooth", map);
            }

            //连接设备回调
            @Override
            public void connectionCallBack(boolean can) {
                WritableMap map = Arguments.createMap();
                map.putString("can",can ? "1" : "0");
                sendEvent("onBleConnection", map);
            }

            //读取数据回调
            @Override
            public void readCallBack(String result) {
                WritableMap map = Arguments.createMap();
                map.putString("result",result);
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
        if(requestCode == QR_REQUEST){
            if(resultCode == Activity.RESULT_CANCELED){
                qr_fail_ck.invoke("Result_Canceled");
            }else if(resultCode == Activity.RESULT_OK){
                boolean scan_hand = data.getBooleanExtra("SCAN_HAND",false);
                String scan_result = data.getStringExtra("SCAN_RESULT");
                WritableMap map = Arguments.createMap();
                map.putString("scan_hand",scan_hand ? "input" : "scan");
                map.putString("scan_result",scan_result);
                qr_success_ck.invoke(map);
                qr_success_ck = null;
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
     * 扫描声音
     *******************************************/
    @ReactMethod
    public void scanSound(int type){
        if(type == 1){
            SoundUtil.getInstance(mContext).soundSuccess();
        }else{
            SoundUtil.getInstance(mContext).soundError();
        }
    }


    /********************************************
     * 扫描条形码
     *******************************************/
    @ReactMethod
    public void qrScan(Callback qsCallback,Callback qfCallback){

        qr_success_ck = qsCallback;
        qr_fail_ck = qfCallback;
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            qr_fail_ck.invoke("扫描失败_01");
            qr_fail_ck = null;
            return;
        }
        try{
            Intent vlIntent = new Intent(currentActivity,ScanCaptureAct.class);
            currentActivity.startActivityForResult(vlIntent,QR_REQUEST);
        }catch (Exception e){
            qr_fail_ck.invoke(e.toString());
            qr_fail_ck = null;
        }
    }


    /********************************************
     * 蓝牙
     *******************************************/
    private BluetoothControl mBluetoothControl;

    //开启蓝牙
    @ReactMethod
    public void startBluetooth(){
        mBluetoothControl.startBluetooth();
    }

    //扫描蓝牙
    @ReactMethod
    public void startFind(Callback successRep,Callback errorRep){
        if(mBluetoothControl.startFind()){
            successRep.invoke("正在扫描");
        }else{
            errorRep.invoke("请先开启蓝牙");
        }
    }

    //停止扫描
    @ReactMethod
    public void stopFind(){
        mBluetoothControl.stopFind();
    }

    //连接设备
    @ReactMethod
    public void startConnection(String names,String address){
        mBluetoothControl.startConnection(names,address);
    }

    //是否已连接设备
    @ReactMethod
    public void isConnection(Callback callback){
        if(mBluetoothControl.isConnection()){
            callback.invoke("1");
        }else{
            callback.invoke("0");
        }
    }


}
