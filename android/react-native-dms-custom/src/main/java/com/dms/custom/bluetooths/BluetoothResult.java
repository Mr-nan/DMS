package com.dms.custom.bluetooths;

import android.annotation.TargetApi;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;

import rtzltech.cn.jni.DataCallback;
import rtzltech.cn.jni.RFIDUtils;

/**
 * Created by thinkpad on 2016/7/15.
 */
@TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
public class BluetoothResult {

    private static BluetoothResult bluetoothresult;
    private static BluetoothGatt mBluetoothGatt;
    private static BluetoothDevice device;
    private static IResultCallBack item;
    private static String address;
    private static String connectionDevice = "";
    private static String name = "";
    private static Context activity;
    private static BluetoothAdapter mBluetoothAdapter;
    private static final CopyOnWriteArrayList<Byte> DATA_LIST = new CopyOnWriteArrayList();
    private static final UUID UUID_BLH_COMMUNICATIONDATASEVICE = UUID.fromString
            ("0000ffe0-0000-1000-8000-00805f9b34fb");
    private static final UUID UUID_BLH_COMMUNICATIONDATANOTITY = UUID.fromString
            ("0000ffe1-0000-1000-8000-00805f9b34fb");
    private static final UUID UUID_BLH_COMMUNICATIONDATANOTITY_CW_READ_NOTIFY = UUID.fromString
            ("00001C0f-D102-11E1-9B23-000efB0000A5");
    private static final UUID UUID_HEART_RATE_MEASUREMENT = UUID.fromString
            ("0000ffe2-0000-1000-8000-00805f9b34fb");
    private static BluetoothGattCharacteristic mNotifyCharacteristic;
    private static String CLIENT_CHARACTERISTIC_CONFIG = "00002902-0000-1000-8000-00805f9b34fb";

    public static final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            Log.e("onConnectionStateChange",
                    "----------------------------------------------------");
            String intentAction;
            Log.e("onConnectionStateChange", "newStatenewStatenewStatenewStatenewState" + newState);
            if (newState == 2) {
                intentAction = "com.example.bluetooth.le.ACTION_GATT_CONNECTED";
                boolean started = mBluetoothGatt.discoverServices();
                if (started) {
                    Log.e("123123123123", "正在搜索服务正在搜索服务正在搜索服务正在搜索服务正在搜索服务正在搜索服务");
                }
                broadcastUpdate(intentAction);
            } else if (newState == 0) {
                Log.e("----------", "--------------------------蓝牙已断开");
                mBluetoothGatt.disconnect();
                mBluetoothGatt.close();
                connectionDevice = "";
                item.connectionCallBack(false);
                intentAction = "com.example.bluetooth.le.ACTION_GATT_DISCONNECTED";
                broadcastUpdate(intentAction);
            }

        }

        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            Log.e("onServicesDiscovered",
                    "--------------------------------------------------------" + status);
            if (status == 0) {
                boolean b = FindBthService();
                Log.e("onServicesDiscovered",
                        "--------------------------------------------------------" + b);
                if (b) {
                    connectionDevice = name;
                    Log.e("onCharacteristicRead", "连接成功连接成功连接成功连接成功连接成功");
                    item.connectionCallBack(true);
                } else {
                    mBluetoothGatt.disconnect();
                    mBluetoothGatt.close();
                    item.connectionCallBack(false);
                    connectionDevice = "";
                    Log.e("onCharacteristicRead", "连接失败连接失败连接失败连接失败连接失败连接失败");
                }
                broadcastUpdate("com.example.bluetooth.le.ACTION_GATT_SERVICES_DISCOVERED");
            } else {
                mBluetoothGatt.disconnect();
                mBluetoothGatt.close();
                connectionDevice = "";
                item.connectionCallBack(false);
                Log.e("onCharacteristicRead", "连接失败连接失败连接失败连接失败连接失败连接失败");
            }

        }

        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic
                characteristic, int status) {
            Log.e("onCharacteristicRead", "----------------------------------------------" +
                    status);
            if (status == 0) {
                broadcastUpdate("com.example.bluetooth.le.ACTION_DATA_AVAILABLE", characteristic);
            } else {
            }

        }

        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic
                characteristic) {
            Log.e("onCharacteristicChanged",
                    "111111111111111111111111111111111111111111111111111111");
            broadcastUpdate("com.example.bluetooth.le.ACTION_DATA_AVAILABLE", characteristic);
        }
    };

    private BluetoothResult() {
    }

    /*发送广播*/
    private static void broadcastUpdate(final String action) {
        Log.e("11111111111111111111111", "222" + action);
        Intent intent = new Intent(action);
        activity.sendBroadcast(intent);
    }

    /*发送广播*/
    private static void broadcastUpdate(final String action, final BluetoothGattCharacteristic
            characteristic) {
        Log.e("22222222222222222222", "222" + action);
        final Intent intent = new Intent(action);
        UUID uuid = characteristic.getUuid();
        if (UUID_HEART_RATE_MEASUREMENT.equals(uuid)) {
            int data = characteristic.getProperties();
            boolean stringBuilder = true;
            byte var12;
            if ((data & 1) != 0) {
                var12 = 18;
            } else {
                var12 = 17;
            }

            int rfid = characteristic.getIntValue(var12, 1).intValue();
            intent.putExtra("com.example.bluetooth.le.EXTRA_DATA", String.valueOf(rfid));
        } else if (UUID_BLH_COMMUNICATIONDATANOTITY.equals(uuid) ||
                UUID_BLH_COMMUNICATIONDATANOTITY_CW_READ_NOTIFY.equals(uuid)) {
            byte[] var11 = characteristic.getValue();
            if (var11 != null && var11.length > 0) {

                RFIDUtils.parseData(var11, new DataCallback() {
                    @Override
                    public void revData(String tid, String epc) {
                        intent.putExtra("com.example.bluetooth.le.EXTRA_DATA", tid);
                    item.readCallBack(tid.toUpperCase());
                    }
                });

//                StringBuilder var13 = new StringBuilder(var11.length);
//                byte[] var10 = var11;
//                int var9 = var11.length;
//
//                for (int msg = 0; msg < var9; ++msg) {
//                    byte var14 = var10[msg];
//                    DATA_LIST.add(Byte.valueOf(var14));
//                    var13.append(String.format("%02X ", new Object[]{Byte.valueOf(var14)}));
//                }
//                //E2003414
//
//                Log.e("aaaaaaaaaaaaaaaaaaaaa", "-----------" + var13.toString());
//                Log.e("bbbbbbbbbbbbbbbbbbbbb", "-----------" + DATA_LIST.toString());
////                if (DATA_LIST.size() > 50 || DATA_LIST.size() <= 3) {
////                    Log.e("eeeeeeeeeeeeeee", "-------------------------");
////                    mBluetoothGatt.disconnect();
////                    mBluetoothGatt.close();
////                    connectionDevice = "";
////                    item.errorCallBack(address);
////                }
////                mBluetoothGatt.disconnect();
//                String var15 = new Transformation().parseData(DATA_LIST);
//                if (var15 != null && !"".equals(var15)) {
//                    Log.e("wwwwwwwwwwwwwww", "-------------------------" + var15);
//                    intent.putExtra("com.example.bluetooth.le.EXTRA_DATA", var15);
//                    item.readCallBack(var15);
//                } else {
//                }
            }
        }

        activity.sendBroadcast(intent);
    }

    public static BluetoothResult getInstance(Context activitys, BluetoothAdapter
            mBluetoothAdapters, String addresss, String names, BluetoothDevice devices,
                                              IResultCallBack items) {
        if (bluetoothresult == null) {
            bluetoothresult = new BluetoothResult();
        }
        address = addresss;
        name = names;
        item = items;
        activity = activitys;
        device = devices;
        mBluetoothAdapter = mBluetoothAdapters;
        mBluetoothGatt = device.connectGatt(activity, false, mGattCallback);
        return bluetoothresult;
    }

    public String getConnectionDevice() {
        return connectionDevice;
    }

    public void setItemClick(IResultCallBack items) {
        item = items;
    }

    private static void readCharacteristic(BluetoothGattCharacteristic characteristic) {
        if (mBluetoothAdapter != null && mBluetoothGatt != null) {
            mBluetoothGatt.readCharacteristic(characteristic);
        } else {
        }
    }

    private static void setCharacteristicNotification(BluetoothGattCharacteristic characteristic,
                                                      boolean enabled) {
        if (mBluetoothAdapter != null && mBluetoothGatt != null) {
            mBluetoothGatt.setCharacteristicNotification(characteristic, enabled);
            if (UUID_HEART_RATE_MEASUREMENT.equals(characteristic.getUuid())) {
                BluetoothGattDescriptor descriptor = characteristic.getDescriptor(UUID.fromString
                        (CLIENT_CHARACTERISTIC_CONFIG));
                descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                mBluetoothGatt.writeDescriptor(descriptor);
            }

        } else {
        }
    }

    private static List<BluetoothGattService> getSupportedGattServices() {
        return mBluetoothGatt == null ? null : mBluetoothGatt.getServices();
    }

    private static boolean FindBthService() {
        try {
            List e = getSupportedGattServices();
            if (e != null && e.size() > 0) {
                for (int i = 0; i < e.size(); ++i) {
                    String temp = ((BluetoothGattService) e.get(i)).getUuid().toString();
                    if (temp.endsWith(UUID_BLH_COMMUNICATIONDATASEVICE.toString())) {
                        List lbgc = ((BluetoothGattService) e.get(i)).getCharacteristics();

                        for (int j = 0; j < lbgc.size(); ++j) {
                            String temp2 = ((BluetoothGattCharacteristic) lbgc.get(j)).getUuid()
                                    .toString().trim();
                            String temp3 = UUID_BLH_COMMUNICATIONDATANOTITY.toString().trim();
                            if (temp2.endsWith(temp3)) {
                                int charaProp = ((BluetoothGattCharacteristic) lbgc.get(j))
                                        .getProperties();
                                if ((charaProp | 16) > 0) {
                                    Log.e("(charaProp | 16) > 0",
                                            "------------------------------------------");
                                    mNotifyCharacteristic = (BluetoothGattCharacteristic) lbgc
                                            .get(j);
                                    setCharacteristicNotification((BluetoothGattCharacteristic)
                                            lbgc.get(j), true);
                                    return true;
                                }

                                if ((charaProp | 2) > 0) {
                                    Log.e("(charaProp | 2) > 0",
                                            "-------------------------------------------");
                                    if (mNotifyCharacteristic != null) {
                                        setCharacteristicNotification(mNotifyCharacteristic, false);
                                        mNotifyCharacteristic = null;
                                    }

                                    readCharacteristic((BluetoothGattCharacteristic) lbgc.get(j));
                                    return true;
                                }

                                return false;
                            }
                        }

                        return false;
                    }
                }

                return false;
            } else {
                return false;
            }
        } catch (Exception var9) {
            var9.printStackTrace();
            return false;
        }
    }
}
