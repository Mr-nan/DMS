package rtzltech.cn.jni;

/**
 * Created by mjl-pc on 2017/4/1.
 */

public class RFIDUtils {
    static {
        System.loadLibrary("RFIDUtils");
    }

    /**
     * 蓝牙数据解析
     * @param data
     * @param callback
     */
    public static native void parseData(byte[] data,DataCallback callback);

    /**
     * 软按键
     */
    public static native byte[] getWCmd();
}
