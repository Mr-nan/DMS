package com.dms.custom.utils;

/**
 * Created by thinkpad on 2016/8/5.
 */
public interface IUpLoadImageResult {
    void success(String response);

    void error(int arg0, String arg2);

    void progress(int count);
}
