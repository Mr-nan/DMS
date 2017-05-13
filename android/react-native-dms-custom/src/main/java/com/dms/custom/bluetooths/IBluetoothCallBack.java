package com.dms.custom.bluetooths;

/**
 * Created by thinkpad on 2016/7/14.
 */
public interface IBluetoothCallBack {

    void findCallBack(ItemBluetoothDevice item);

    void connectionCallBack(boolean can);

    void readCallBack(String result);

    void permissionCallBack();

    void errorCallBack(String address);
}
