package com.dms.custom.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Environment;
import android.widget.ImageView;

import java.io.File;
import java.io.FileOutputStream;

/**
 * Created by thinkpad on 2016/6/12.
 * 远程图片获取工具类，封装picasso框架
 */
public class ImageUtil {

    /**
     * 压缩图片
     *
     * @param options
     * @param reqWidth
     * @param reqHeight
     * @return
     */
    public static int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int
            reqHeight) {
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {
            final int heightRatio = Math.round((float) height / (float) reqHeight);
            final int widthRatio = Math.round((float) width / (float) reqWidth);
            inSampleSize = heightRatio < widthRatio ? heightRatio : widthRatio;
        }
        return inSampleSize;
    }

    public static Bitmap getSmallBitmap(String filePath) {
        final BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeFile(filePath, options);

        // Calculate inSampleSize
        options.inSampleSize = calculateInSampleSize(options, 480, 800);

        // Decode bitmap with inSampleSize set
        options.inJustDecodeBounds = false;

        return BitmapFactory.decodeFile(filePath, options);
    }

    public static String compressBitmapWithRatio(String filePath, String filename,int ratio)throws Exception{
        String path = Environment.getExternalStorageDirectory().getPath()
                + File.separator + "DMS" + File.separator + "photo" + File.separator + "clone" +
                filename;
        File f = new File(path);
        Bitmap bm = getSmallBitmap(filePath);
        FileOutputStream out = new FileOutputStream(f);
        bm.compress(Bitmap.CompressFormat.JPEG, ratio, out);
        out.flush();
        out.close();
        File fold = new File(filePath);
        fold.delete();
        System.gc();
        return path;
    }

    public static String bitmapToString(String filePath, String filename) throws Exception {
        String path = Environment.getExternalStorageDirectory().getPath()
                + File.separator + "DMS" + File.separator + "photo" + File.separator + "clone" +
                filename;
        File f = new File(path);
        Bitmap bm = getSmallBitmap(filePath);
        FileOutputStream out = new FileOutputStream(f);
        bm.compress(Bitmap.CompressFormat.JPEG, 40, out);
        out.flush();
        out.close();
        File fold = new File(filePath);
        fold.delete();
        System.gc();
        return path;
    }

    public static String bitmapToStringCarRev(String filePath, String filename) throws Exception {
        String path = Environment.getExternalStorageDirectory().getPath()
                + File.separator + "DMS" + File.separator + "photo" + File.separator + "clone" +
                filename;
        File f = new File(path);
        Bitmap bm = getSmallBitmap(filePath);
        FileOutputStream out = new FileOutputStream(f);
        bm.compress(Bitmap.CompressFormat.JPEG, 70, out);
        out.flush();
        out.close();
        File fold = new File(filePath);
        fold.delete();
        System.gc();
        return path;
    }

    public static String bitmapToStringSelect(String filePath, String filename) throws Exception {
        String path = Environment.getExternalStorageDirectory().getPath()
                + File.separator + "DMS" + File.separator + "photo" + File.separator + "clone" +
                filename;
        File f = new File(path);
        Bitmap bm = getSmallBitmap(filePath);
        FileOutputStream out = new FileOutputStream(f);
        bm.compress(Bitmap.CompressFormat.JPEG, 90, out);
        out.flush();
        out.close();
//        File fold = new File(filePath);
//        fold.delete();
//        System.gc();
        return path;
    }
}
