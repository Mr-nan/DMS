package com.dms.custom.vin.scan;


import android.annotation.TargetApi;
import android.app.Activity;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.hardware.Camera;
import android.hardware.Camera.AutoFocusCallback;
import android.hardware.Camera.PictureCallback;
import android.hardware.Camera.ShutterCallback;
import android.hardware.Camera.Size;
import android.media.ToneGenerator;
import android.os.Bundle;
import android.os.Environment;
import android.os.Vibrator;
import android.telephony.TelephonyManager;
import android.text.format.Time;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.dms.custom.R;
import com.etop.vin.VINAPI;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class FDScanActivity extends Activity implements SurfaceHolder.Callback, Camera.PreviewCallback{
    private static final String PATH = Environment.getExternalStorageDirectory().toString() + "/alpha/VinCode/";
    private static final String UsrID = "4D39F52BD46AC7CD8470";
    private Camera mycamera;
    private SurfaceView surfaceView;
    private RelativeLayout re_c;
    private SurfaceHolder surfaceHolder;
    private ImageButton back;
    private ImageButton flash;
    private ImageButton	takepic;
    private TextView vin_result;
    private TextView remind;
    private ImageView showbitmap;
    private VinViewfinderView myView;

    private VINAPI api;
    private Bitmap bitmap;
    private int preWidth = 0;
    private int preHeight = 0;
    private int photoWidth =0;
    private int photoHeight = 0;
    private boolean isROI = false;
    private int width;
    private int height;
    private Timer time;
    private TimerTask timer;
    private Vibrator mVibrator;
    private ToneGenerator tone;
    private byte[] tackData;
    private boolean isFatty = false;
    private int[] m_ROI={0,0,0,0};
    private boolean  bInitKernal=false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        Configuration cf= this.getResources().getConfiguration();
        int noriention=cf.orientation;
        try {
            copyDataBase();
        } catch (IOException e) {
            e.printStackTrace();
        }
        File file =new File(PATH);
        if	(!file.exists() && !file.isDirectory())
        {
            file.mkdirs();
        }
        if(noriention==cf.ORIENTATION_LANDSCAPE)
        {
            if(!bInitKernal)
            {
                if(api==null){
                    api =new VINAPI();
                    String FilePath =Environment.getExternalStorageDirectory().toString()+"/"+UsrID+".lic";
                    TelephonyManager telephonyManager = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
                    int nRet = api.VinKernalInit("", FilePath,UsrID,0x01,0x02,telephonyManager, this);
                    if(nRet!=0)
                    {
                        Toast.makeText(getApplicationContext(), "激活失败", Toast.LENGTH_SHORT).show();
                        bInitKernal = false;
                    }
                    else
                    {
                        bInitKernal=true;
                    }
                }
            }
        }
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        //
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.activity_fdscan);
        findView();

    }


    public void copyDataBase() throws IOException {
        //  Common common = new Common();
        String dst = Environment.getExternalStorageDirectory().toString() + "/"+UsrID+".lic";

        File file = new File(dst);
        if (!file.exists()) {
            // file.createNewFile();
        } else {
            file.delete();
        }

        try {
            InputStream myInput = getAssets().open(UsrID+".lic");
            OutputStream myOutput = new FileOutputStream(dst);
            byte[] buffer = new byte[1024];
            int length;
            while ((length = myInput.read(buffer)) > 0) {
                myOutput.write(buffer, 0, length);
            }
            myOutput.flush();
            myOutput.close();
            myInput.close();
        } catch (Exception e) {
            System.out.println(UsrID+".lic" + "is not found");
        }
    }

    @Override
    protected void onRestart() {
        if (bitmap != null) {
            bitmap.recycle();
            bitmap = null;
        }
        super.onRestart();
    }

    @Override
    protected void onResume() {

        super.onResume();


    }

    private void findView() {
        surfaceView = (SurfaceView) findViewById(R.id.surfaceViwe);
        re_c = (RelativeLayout) findViewById(R.id.re_c);
        back = (ImageButton) findViewById(R.id.back_camera);
        flash = (ImageButton) findViewById(R.id.flash_camera);
        takepic = (ImageButton) findViewById(R.id.tackPic_btn);
        vin_result = (TextView) findViewById(R.id.vin_result);
        remind =(TextView) findViewById(R.id.remind);
        showbitmap =(ImageView)findViewById(R.id.showbitmap);

        DisplayMetrics metric = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metric);
        width = metric.widthPixels;
        height = metric.heightPixels;
        if (width * 3 == height * 4) {
            isFatty = true;
        }

        remind.setText("点击屏幕继续识别");
        remind.setTextColor(Color.WHITE);
        remind .setTextSize(TypedValue.COMPLEX_UNIT_PX,height/18);
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams( RelativeLayout.LayoutParams.WRAP_CONTENT,RelativeLayout.LayoutParams.WRAP_CONTENT );
        layoutParams.addRule(RelativeLayout.CENTER_HORIZONTAL, RelativeLayout.TRUE);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        layoutParams.topMargin = (int) (height * 0.08);
        remind.setLayoutParams(layoutParams);
        remind.setVisibility(View.INVISIBLE);


        vin_result.setTextColor(Color.GREEN);
        vin_result .setTextSize(TypedValue.COMPLEX_UNIT_PX,height/16);
        layoutParams = new RelativeLayout.LayoutParams( RelativeLayout.LayoutParams.WRAP_CONTENT,RelativeLayout.LayoutParams.WRAP_CONTENT );
        layoutParams.addRule(RelativeLayout.CENTER_HORIZONTAL, RelativeLayout.TRUE);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        layoutParams.topMargin = (int) (height * 0.2);
        vin_result.setLayoutParams(layoutParams);
        vin_result.setVisibility(View.INVISIBLE);

        int showbitmap_w = (int) (width/2+ height*2/5*1.585);
        int showbitmap_h = (int) (height*2/5);
        layoutParams = new RelativeLayout.LayoutParams(showbitmap_w,showbitmap_h);
        layoutParams.addRule(RelativeLayout.CENTER_HORIZONTAL,RelativeLayout.TRUE);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP,RelativeLayout.TRUE);
        layoutParams.topMargin = (int) (height * 0.3);
        showbitmap.setLayoutParams(layoutParams);
        showbitmap.setVisibility(View.INVISIBLE);

        int back_w = (int) (width * 0.066796875);
        int back_h = (int) (back_w * 1);
        layoutParams = new RelativeLayout.LayoutParams(back_w, back_h);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT, RelativeLayout.TRUE);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);
        layoutParams.leftMargin = (int) (( back_h/2));
        layoutParams.bottomMargin = (int) (height * 0.15);
        back.setLayoutParams(layoutParams);

        int flash_w = (int) (width * 0.066796875);
        int flash_h = (int) (flash_w *69/106);
        layoutParams = new RelativeLayout.LayoutParams(flash_w, flash_h);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT, RelativeLayout.TRUE);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        layoutParams.leftMargin = (int) (( back_h/2));
        layoutParams.topMargin = (int) (height * 0.15);
        flash.setLayoutParams(layoutParams);


        int tackPic_w = (int) (width * 0.076796875);
        int tackPic_h = (int) (tackPic_w * 1);
        layoutParams = new RelativeLayout.LayoutParams(tackPic_w, tackPic_h);
        layoutParams.addRule(RelativeLayout.CENTER_VERTICAL, RelativeLayout.TRUE);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT, RelativeLayout.TRUE);
        layoutParams.leftMargin = (int) (((width - height * 0.06 * 1.585)  - back_h));
        takepic.setLayoutParams(layoutParams);

        surfaceHolder = surfaceView.getHolder();
        surfaceHolder.addCallback(FDScanActivity.this);
        surfaceHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);

        back.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                api.VinKernalUnInit();
                finish();
            }
        });
        flash.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {
                if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_FLASH)) {
                    String mess = getResources().getString(R.string.toast_flash);
                    Toast.makeText(FDScanActivity.this, mess, Toast.LENGTH_LONG).show();
                } else {
                    if (mycamera != null) {
                        Camera.Parameters parameters = mycamera.getParameters();
                        String flashMode = parameters.getFlashMode();
                        if (flashMode.equals(Camera.Parameters.FLASH_MODE_TORCH)) {
                            parameters.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
                            parameters.setExposureCompensation(0);
                        } else {
                            parameters.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);
                            parameters.setExposureCompensation(-1);
                        }
                        try {
                            mycamera.setParameters(parameters);
                        } catch (Exception e) {
                            String mess = getResources().getString(R.string.toast_flash);
                            Toast.makeText(FDScanActivity.this, mess, Toast.LENGTH_LONG).show();
                        }
                        mycamera.startPreview();
                    }
                }
            }
        });
        takepic.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {
                if(time!=null){
                    time.cancel();
                    time=null;
                }
                if (timer != null) {
                    timer.cancel();
                    timer = null;
                }
                if (mycamera != null) {
                    try {
                        isFocusTakePicture(mycamera);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });

    }
    private void isFocusTakePicture(Camera camera) {
        if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_AUTOFOCUS)) {
            camera.stopPreview();
            camera.startPreview();
            camera.takePicture(shutterCallback, null, picturecallback);
        } else {
            camera.autoFocus(new AutoFocusCallback() {
                public void onAutoFocus(boolean success, Camera camera) {
                    camera.stopPreview();
                    camera.startPreview();
                    camera.takePicture(shutterCallback, null, picturecallback);

                }
            });
        }
    }
    private ShutterCallback shutterCallback = new ShutterCallback() {
        public void onShutter() {
            try {
                if (tone == null) {
                    tone = new ToneGenerator(1, ToneGenerator.MIN_VOLUME);
                }
                tone.startTone(ToneGenerator.TONE_PROP_BEEP);
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
    };


    @Override
    public void surfaceCreated(SurfaceHolder holder) {

        if(api==null){
            api =new VINAPI();
            String FilePath =Environment.getExternalStorageDirectory().toString()+"/"+UsrID+".lic";
            TelephonyManager telephonyManager = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
            int nRet = api.VinKernalInit("", FilePath,UsrID,0x01,0x02,telephonyManager, this);
            if(nRet!=0)
            {
                Toast.makeText(getApplicationContext(), "激活失败", Toast.LENGTH_SHORT).show();
                bInitKernal = false;
            }
            else
            {
                bInitKernal=true;
            }
        }
        if (mycamera == null) {
            try {
                mycamera = Camera.open();
            } catch (Exception e) {
                e.printStackTrace();
                String mess = getResources().getString(R.string.toast_camera);
                Toast.makeText(getApplicationContext(), mess, Toast.LENGTH_LONG).show();
                return;
            }
        }
        try {

            mycamera.setPreviewDisplay(holder);
            initCamera(holder);
            time = new Timer();
            if (timer == null) {
                timer = new TimerTask() {
                    public void run() {
                        // isSuccess=false;
                        if (mycamera != null) {
                            try {
                                mycamera.autoFocus(new AutoFocusCallback() {
                                    public void onAutoFocus(boolean success, Camera camera) {
                                        // isSuccess=success;
                                    }
                                });
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    };
                };
            }
            time.schedule(timer, 500, 2500);

        } catch (IOException e) {
            e.printStackTrace();

        }

    }

    @Override
    public void surfaceChanged(final SurfaceHolder holder, int format, int width, int height) {
        if (mycamera != null) {
            mycamera.autoFocus(new AutoFocusCallback() {
                @Override
                public void onAutoFocus(boolean success, Camera camera) {
                    if (success) {
                        synchronized (camera) {
                            new Thread() {
                                public void run() {
                                    initCamera(holder);
                                    super.run();
                                }
                            }.start();
                        }
                    }
                }
            });
        }
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        try {
            if (mycamera != null) {
                mycamera.setPreviewCallback(null);
                mycamera.stopPreview();
                mycamera.release();
                mycamera = null;
            }
        } catch (Exception e) {
        }
        if(time!=null){
            time.cancel();
            time=null;
        }
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
        if(api!=null)
        {
            api.VinKernalUnInit();
            api=null;
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            try {
                if (mycamera != null) {
                    mycamera.setPreviewCallback(null);
                    mycamera.stopPreview();
                    mycamera.release();
                    mycamera = null;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            if(api!=null)
            {
                api.VinKernalUnInit();
                api=null;
            }
            finish();
        }
        return super.onKeyDown(keyCode, event);
    }

    public boolean onTouchEvent(MotionEvent event)
    {
        // int Action = event.getAction();
        //  float X = event.getX();
        //   float Y = event.getY();
        remind.setVisibility(View.INVISIBLE);
        vin_result.setVisibility(View.INVISIBLE);
        showbitmap.setVisibility(View.INVISIBLE);
        return true;
    }
    @TargetApi(14)
    private void initCamera(SurfaceHolder holder) {
        Camera.Parameters parameters = mycamera.getParameters();
        List<Size> list = parameters.getSupportedPreviewSizes();
        Size size;
        int length = list.size();
        Size tmpsize = getOptimalPreviewSize(list,width,height);
        int previewWidth = list.get(0).width;
        int previewheight = list.get(0).height;
        int second_previewWidth = 0;
        int second_previewheight = 0;
        int nlast = -1;
        int nThird =-1;
        previewWidth = tmpsize.width;
        previewheight = tmpsize.height;
        if (length == 1) {
            preWidth = previewWidth;
            preHeight = previewheight;
        }
        else
        {
            second_previewWidth=previewWidth;
            second_previewheight = previewheight;
            for (int i = 0; i < length; i++) {
                size = list.get(i);
                if(size.height>700)
                {
                    if(size.width * previewheight == size.height * previewWidth && size.height<second_previewheight)
                    {
                        second_previewWidth =size.width;
                        second_previewheight= size.height;
                    }
                }
            }
            preWidth = second_previewWidth;
            preHeight = second_previewheight;
        }
        List<Size> listP =  parameters.getSupportedPictureSizes();
        length = listP.size();
        int pwidth = listP.get(0).width;
        int pheight = listP.get(0).height;
        tmpsize = getOptimalPreviewSize(listP,width,height);
        pwidth = tmpsize.width;
        pheight = tmpsize.height;
        second_previewWidth = 0;
        second_previewheight = 0;
        nlast = -1;
        nThird =-1;

        if (length == 1) {
            photoWidth = pwidth;
            photoHeight = pheight;
        }
        else
        {
            second_previewWidth=pwidth;
            second_previewheight = pheight;
            for (int i = 0; i < length; i++) {
                size = listP.get(i);
                if(size.height>700)
                {
                    if(size.width * height == size.height * width && size.height<second_previewheight)
                    {
                        second_previewWidth =size.width;
                        second_previewheight= size.height;
                    }
                }
            }
            photoWidth = second_previewWidth;
            photoHeight = second_previewheight;
        }
        if (!isROI) {
            int $t = height / 10;
            int ntmp = height*3 / 10;
            int t = ntmp;
            int b = height - ntmp;
            int $l = (int) ((height-$t-$t) * 1.585);
            int l = (width - $l) / 2;
            int r = width - l;
//			l = l + 30;
//			t = t + 19;
//			r = r - 30;
//			b = b - 19;
//			if (isFatty) {
//				int $t = height / 5;
//				int ntmp = height*2 / 5;
//				int t = ntmp;
//				int b = height - t;
//				int  $l = (int) ((height - $t-$t) * 1.585);
//				int l = (width - $l) / 2;
//				int r = width - l;
//			}
            double proportion = (double) width / (double) preWidth;
            double hproportion=(double)height/(double)  preHeight;
            l = (int) (l /proportion);
            t = (int) (t /hproportion);
            r = (int) (r /proportion);
            b = (int) (b / hproportion);
            int borders[] = { l, t, r, b };
            m_ROI[0]=l;
            m_ROI[1]=t;
            m_ROI[2]=r;
            m_ROI[3]=b;
            api.VinSetROI(borders, preWidth, preHeight);
            isROI = true;
            if (isFatty)
                myView = new VinViewfinderView(this, width, height, isFatty);
            else
                myView = new VinViewfinderView(this, width, height);
            re_c.addView(myView);
        }
        parameters.setPictureFormat(PixelFormat.JPEG);
        parameters.setJpegQuality(100);
        parameters.setPictureSize(photoWidth, photoHeight);
        parameters.setPreviewSize(preWidth,preHeight);
        if (getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_AUTOFOCUS)) {
            parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO);
        }
        mycamera.setPreviewCallback(this);
        if(parameters.isZoomSupported()){
            parameters.setZoom(2);
        }
        mycamera.setParameters(parameters);
        try {
            mycamera.setPreviewDisplay(holder);
        } catch (IOException e) {
            e.printStackTrace();
        }
        mycamera.startPreview();
    }

    public String savePicture(Bitmap bitmap, String tag) {
        String strCaptureFilePath = PATH + tag + "_VIN_" + pictureName() + ".jpg";
        File dir = new File(PATH);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        File file = new File(strCaptureFilePath);
        if (file.exists()) {
            file.delete();
        }
        try {
            file.createNewFile();
            BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file));

            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, bos);
            bos.flush();
            bos.close();

        } catch (IOException e) {
            Toast.makeText(getApplicationContext(), "图片存储失败,请检查SD卡", Toast.LENGTH_SHORT).show();
        }
        return strCaptureFilePath;
    }

    public String pictureName() {
        String str = "";
        Time t = new Time();
        t.setToNow();
        int year = t.year;
        int month = t.month + 1;
        int date = t.monthDay;
        int hour = t.hour; // 0-23
        int minute = t.minute;
        int second = t.second;
        if (month < 10)
            str = String.valueOf(year) + "0" + String.valueOf(month);
        else {
            str = String.valueOf(year) + String.valueOf(month);
        }
        if (date < 10)
            str = str + "0" + String.valueOf(date + "_");
        else {
            str = str + String.valueOf(date + "_");
        }
        if (hour < 10)
            str = str + "0" + String.valueOf(hour);
        else {
            str = str + String.valueOf(hour);
        }
        if (minute < 10)
            str = str + "0" + String.valueOf(minute);
        else {
            str = str + String.valueOf(minute);
        }
        if (second < 10)
            str = str + "0" + String.valueOf(second);
        else {
            str = str + String.valueOf(second);
        }
        return str;
    }

    private PictureCallback picturecallback = new PictureCallback() {
        @Override
        public void onPictureTaken(byte[] data, Camera camera) {
            //tackData =data;
            Camera.Parameters parameters = camera.getParameters();
            //int pW = parameters.getPictureSize().width;
            //	int pH = parameters.getPictureSize().height;
            if (data != null) {

                bitmap = BitmapFactory.decodeByteArray(data, 0, data.length);
            }

            if (bitmap != null) {

                int $t = height / 10;
                int ntmp = height*3 / 10;
                int t = ntmp;
                int b = height - ntmp;
                int $l = (int) ((height-$t-$t) * 1.585);
                int l = (width - $l) / 2;
                int r = width - l;
                double proportion = (double) width / (double) photoWidth;
                double hproportion=(double)height/(double)  photoHeight;
                l = (int) (l /proportion);
                t = (int) (t /hproportion);
                r = (int) (r /proportion);
                b = (int) (b / hproportion);
                Bitmap tmpbitmap = Bitmap.createBitmap(bitmap,l, t, r-l, b-t);
                String path = savePicture(tmpbitmap, "E");
                tackData = null;
                String flashMode = parameters.getFlashMode();
                if (flashMode != null && flashMode.equals(Camera.Parameters.FLASH_MODE_TORCH)) {
                    camera.startPreview();
                    parameters.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
                    camera.setParameters(parameters);
                    //		camera.stopPreview();
                }
                showbitmap.setImageBitmap(tmpbitmap);
                showbitmap.setVisibility(View.VISIBLE);
                if (!bitmap.isRecycled()) {
                    bitmap.recycle();
                }
                remind.setVisibility(View.VISIBLE);
                vin_result.setText("图片已保存至相册");
                vin_result.setVisibility(View.VISIBLE);
                if(time==null)
                {
                    time = new Timer();
                    if (timer == null) {
                        timer = new TimerTask() {
                            public void run() {
                                // isSuccess=false;
                                if (mycamera != null) {
                                    try {
                                        mycamera.autoFocus(new AutoFocusCallback() {
                                            public void onAutoFocus(
                                                    boolean success,
                                                    Camera camera) {
                                                // isSuccess=success;
                                            }
                                        });
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                }
                            };
                        };
                    }
                    time.schedule(timer, 500, 2500);
                }
                camera.startPreview();
            }
        }
    };

    @Override
    public void onPreviewFrame(byte[] data, Camera camera) {
        tackData = data;
        Camera.Parameters parameters = camera.getParameters();
        int buffl = 30;
        char recogval[] = new char[buffl];
        int pLineWarp[] = new int[32000];
        int r = api.VinRecognizeNV21Ex(data, parameters.getPreviewSize().width, parameters.getPreviewSize().height,recogval, buffl,pLineWarp);
        if (r == 0&& remind.getVisibility()==View.INVISIBLE) {
            //camera.stopPreview();
            mVibrator = (Vibrator) getApplication().getSystemService(Service.VIBRATOR_SERVICE);
            mVibrator.vibrate(100);
            //
            int[] datas = convertYUV420_NV21toARGB8888(tackData, parameters.getPreviewSize().width,
                    parameters.getPreviewSize().height);

            BitmapFactory.Options opts = new BitmapFactory.Options();
            opts.inInputShareable = true;
            opts.inPurgeable = true;
            bitmap = Bitmap.createBitmap(datas, parameters.getPreviewSize().width,
                    parameters.getPreviewSize().height, Bitmap.Config.ARGB_8888);
            Bitmap tmpbitmap = Bitmap.createBitmap(bitmap, m_ROI[0], m_ROI[1], m_ROI[2]-m_ROI[0], m_ROI[3]-m_ROI[1]);
            System.out.println("m_ROI:"+m_ROI[0]+" "+m_ROI[1]+" "+m_ROI[2]+" "+m_ROI[3]);
            //savePicture(bitmap,"M");
            savePicture(tmpbitmap, "V");

            String recogResult = api.VinGetResult();
            Intent rIntent = new Intent();
            rIntent.putExtra("vin",recogResult);
            setResult(Activity.RESULT_OK,rIntent);
            finish();
//            remind.setVisibility(View.VISIBLE);
//            vin_result.setText(recogResult);
//            vin_result.setVisibility(View.VISIBLE);
//            showbitmap.setImageBitmap(tmpbitmap);
//            showbitmap.setVisibility(View.VISIBLE);
        }
    }
    public static int[] convertYUV420_NV21toARGB8888(byte[] data, int width, int height) {
        int size = width * height;
        int offset = size;
        int[] pixels = new int[size];
        int u, v, y1, y2, y3, y4;
        for (int i = 0, k = 0; i < size; i += 2, k += 2) {
            y1 = data[i] & 0xff;
            y2 = data[i + 1] & 0xff;
            y3 = data[width + i] & 0xff;
            y4 = data[width + i + 1] & 0xff;

            u = data[offset + k] & 0xff;
            v = data[offset + k + 1] & 0xff;
            u = u - 128;
            v = v - 128;

            pixels[i] = convertYUVtoARGB(y1, u, v);
            pixels[i + 1] = convertYUVtoARGB(y2, u, v);
            pixels[width + i] = convertYUVtoARGB(y3, u, v);
            pixels[width + i + 1] = convertYUVtoARGB(y4, u, v);

            if (i != 0 && (i + 2) % width == 0)
                i += width;
        }

        return pixels;
    }

    private  static int convertYUVtoARGB(int y, int u, int v) {
        int r, g, b;

        r = y + (int) 1.402f * u;
        g = y - (int) (0.344f * v + 0.714f * u);
        b = y + (int) 1.772f * v;
        r = r > 255 ? 255 : r < 0 ? 0 : r;
        g = g > 255 ? 255 : g < 0 ? 0 : g;
        b = b > 255 ? 255 : b < 0 ? 0 : b;
        return 0xff000000 | (r << 16) | (g << 8) | b;
    }

    @Override
    protected void onStop() {

        super.onStop();
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
        if(time!=null){
            time.cancel();
            time=null;
        }
        if (bitmap != null) {
            bitmap.recycle();
            bitmap = null;
        }
        try {
            if (mycamera != null) {
                mycamera.setPreviewCallback(null);
                mycamera.stopPreview();
                mycamera.release();
                mycamera = null;
            }
        } catch (Exception e) {
        }
        if(api!=null)
        {
            api.VinKernalUnInit();
            api=null;
        }
    }
    private Size getOptimalPreviewSize(List<Size> sizes, int w, int h) {
        final double ASPECT_TOLERANCE = 0.1;
        double targetRatio = (double) w / h;
        if (sizes == null) return null;

        Size optimalSize = null;
        double minDiff = Double.MAX_VALUE;

        int targetHeight = h;

        // Try to find an size match aspect ratio and size
        for (Size size : sizes) {
            double ratio = (double) size.width / size.height;
            if(size.height<700) continue;
            if (Math.abs(ratio - targetRatio) > ASPECT_TOLERANCE) continue;
            if (Math.abs(size.height - targetHeight) < minDiff) {
                optimalSize = size;
                minDiff = Math.abs(size.height - targetHeight);
            }
        }

        // Cannot find the one match the aspect ratio, ignore the requirement
        if (optimalSize == null) {
            minDiff = Double.MAX_VALUE;
            for (Size size : sizes) {
                if(size.height<700) continue;
                if (Math.abs(size.height - targetHeight) < minDiff) {
                    optimalSize = size;
                    minDiff = Math.abs(size.height - targetHeight);
                }
                else if(Math.abs(size.height - targetHeight) == minDiff&&size.width>optimalSize.width)
                {
                    optimalSize = size;
                }
            }
        }
        return optimalSize;
    }



}
