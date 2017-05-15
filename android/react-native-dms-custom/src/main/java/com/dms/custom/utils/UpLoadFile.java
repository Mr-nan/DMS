package com.dms.custom.utils;

import android.util.Log;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import cn.edu.zafu.coreprogress.helper.ProgressHelper;
import cn.edu.zafu.coreprogress.listener.impl.UIProgressListener;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by thinkpad on 2016/8/5.
 */
public class UpLoadFile {
    private static final OkHttpClient client = new OkHttpClient.Builder()
            //设置超时，不设置可能会报异常
            .connectTimeout(300, TimeUnit.SECONDS)
            .readTimeout(300, TimeUnit.SECONDS)
            .writeTimeout(300, TimeUnit.SECONDS)
            .build();

    public static void upload(String url, String token, String filepath, final
    IUpLoadImageResult result) {
        File file = new File(filepath);

        //这个是ui线程回调，可直接操作UI
        final UIProgressListener uiProgressRequestListener = new UIProgressListener() {
            @Override
            public void onUIProgress(long bytesWrite, long contentLength, boolean done) {
                int i = (int) ((100 * bytesWrite) / contentLength);
                result.progress(i);
                //Toast.makeText(getApplicationContext(), bytesWrite + " " + contentLength + " "
                // + done, Toast.LENGTH_LONG).show();
            }

            @Override
            public void onUIStart(long bytesWrite, long contentLength, boolean done) {
                super.onUIStart(bytesWrite, contentLength, done);
            }

            @Override
            public void onUIFinish(long bytesWrite, long contentLength, boolean done) {
                super.onUIFinish(bytesWrite, contentLength, done);
            }
        };


        //构造上传请求，类似web表单
        RequestBody requestBody = new MultipartBody.Builder().setType(MultipartBody.FORM)
                .addFormDataPart("reqtoken", token)
                .addFormDataPart("file", file.getName())
                .addFormDataPart("device_code", "dycd_dms_manage_android")
                .addPart(Headers.of("Content-Disposition", "form-data; name=\"another\";" +
                        "filename=\"" + file.getName() + ".jpg\""), RequestBody.create(MediaType.parse
                        ("application/octet-stream"), file))
                .build();
        //进行包装，使其支持进度回调
        final Request request = new Request.Builder().url(url).post(ProgressHelper
                .addProgressRequestListener(requestBody, uiProgressRequestListener)).build();
        //开始请求
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                result.error(request.hashCode(), "");
                Log.e("TAG", "error ", e);
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                result.success(response.body().string()+"");
            }
        });

    }
}
