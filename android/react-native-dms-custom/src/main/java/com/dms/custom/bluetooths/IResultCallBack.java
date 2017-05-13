package com.dms.custom.bluetooths;

/**
 * Created by thinkpad on 2016/7/15.
 */
public interface IResultCallBack {

    void connectionCallBack(boolean can);

    void readCallBack(String result);

    void errorCallBack(String result);
}
