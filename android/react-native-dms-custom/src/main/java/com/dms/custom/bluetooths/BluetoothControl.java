package com.dms.custom.bluetooths;


import android.Manifest;
import android.annotation.SuppressLint;
import android.annotation.TargetApi;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.os.Build;
import android.widget.Button;
import android.widget.Toast;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

/**
 * Created by thinkpad on 2016/7/14.
 */
public class BluetoothControl {

    private static BluetoothAdapter mBluetoothAdapter;
    private static Context activity;
    private static IBluetoothCallBack callBack;
    private static BluetoothControl bluetoothUtil;
    private static BluetoothResult mBluetoothResult;

    private BluetoothControl(Context activity, IBluetoothCallBack callBack) {
        this.activity = activity;
        this.callBack = callBack;
    }

    public static BluetoothControl getInstance(Context activitys, IBluetoothCallBack callBacks) {
        if (bluetoothUtil == null) {
            bluetoothUtil = new BluetoothControl(activitys, callBacks);
        }
        activity = activitys;
        callBack = callBacks;
        if (mBluetoothAdapter == null) {
            BluetoothManager bluetoothManager = (BluetoothManager) activity.getSystemService
                    (Context.BLUETOOTH_SERVICE);
            mBluetoothAdapter = bluetoothManager.getAdapter();
        }
        return bluetoothUtil;
    }

    @SuppressLint("NewApi")
    private static BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter
            .LeScanCallback() {
        @Override
        public void onLeScan(final BluetoothDevice device, final int rssi, final byte[]
                scanRecord) {
            runOnUiThread(new Runnable() {
                public void run() {
                    ItemBluetoothDevice item = new ItemBluetoothDevice(device.getName(), rssi +
                            "", device.getAddress());
                    callBack.findCallBack(item);
                }
            });
        }
    };

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
    public void startBluetooth() {
        mBluetoothAdapter.enable();
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
    public void stopBluetooth() {
        mBluetoothAdapter.disable();
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
    public boolean startFind() {
//        if (PermissionUtil.openPermissionInActivity(activity, Manifest.permission
//                .ACCESS_COARSE_LOCATION, PermissionIdentity.ACCESS_COARSE_LOCATION)) {
//            callBack.permissionCallBack();
//            return;
//        }
        if (mBluetoothAdapter == null || !mBluetoothAdapter.isEnabled()) {
//            Toast.makeText(activity, "请开启蓝牙", Toast.LENGTH_SHORT).show();
            return false;
        }
        mBluetoothAdapter.startLeScan(mLeScanCallback);
        return true;
//        if (button != null) {
//            button.setEnabled(false);
//            button.setText("正在搜索");
//        }
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
    public boolean startConnection(String names, String address) {
        stopFind();
        if (mBluetoothAdapter == null || !mBluetoothAdapter.isEnabled()) {
            return false;
        }
        BluetoothDevice device = mBluetoothAdapter.getRemoteDevice(address);
        if (device == null) {
            return false;
        }
        mBluetoothResult = BluetoothResult.getInstance(activity, mBluetoothAdapter, address, names,
                device, new IResultCallBack() {
                    @Override
                    public void connectionCallBack(boolean can) {
                        callBack.connectionCallBack(can);
                    }

                    @Override
                    public void readCallBack(String result) {
                        callBack.readCallBack(result);
                    }

                    @Override
                    public void errorCallBack(String result) {
                        callBack.errorCallBack(result);
                    }
                });
        return true;
    }

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
    public void stopFind() {
//        if (button != null) {
//            button.setEnabled(true);
//            button.setText("搜索设备");
//        }
        if (mBluetoothAdapter == null) {
            return;
        }
        mBluetoothAdapter.stopLeScan(mLeScanCallback);
    }

    public String getConnectionDevice() {
        if (mBluetoothResult != null) {
            return mBluetoothResult.getConnectionDevice();
        }
        return "";
    }

    public boolean isConnection(IResultCallBack items) {
        if (mBluetoothResult != null && mBluetoothResult.getConnectionDevice() != null &&
                !mBluetoothResult.getConnectionDevice().equals("")) {
            mBluetoothResult.setItemClick(items);
            return true;
        }
        return false;
    }

    public boolean isConnection() {
        if (mBluetoothResult != null && mBluetoothResult.getConnectionDevice() != null &&
                !mBluetoothResult.getConnectionDevice().equals("")) {
            return true;
        }
        return false;
    }


}
