package com.dms.custom.vin.scan;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.hardware.Camera;
import android.media.AudioManager;
import android.media.SoundPool;
import android.media.ToneGenerator;
import android.os.Bundle;
import android.os.Environment;
import android.os.Vibrator;
import android.telephony.TelephonyManager;
import android.text.format.Time;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.dms.custom.R;
import com.etop.VL.VLCardAPI;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class VLScanActivity extends Activity implements SurfaceHolder.Callback, Camera.PreviewCallback{

    private boolean  bInitKernal=false;
    //private AutoCropImage   api=null;
    private VLCardAPI vlapi=null;
    private static final String PATH = Environment.getExternalStorageDirectory().toString() + "/Alpha/VL/";
    private static final String UserID = "4D39F52BD46AC7CD8470";
    private Camera mycamera;
    private SurfaceView surfaceView;
    private RelativeLayout re_c;
    private SurfaceHolder surfaceHolder;
    private ImageButton back;
    private ImageButton flash;
    private ImageButton change;
    private ImageButton take_pic;
    private TextView remind;
    private TextView mtext;
    private int width;
    private int height;
    private Timer time;
    private TimerTask timer;
    private Vibrator mVibrator;
    private Bitmap bitmap;
    private int preWidth = 0;
    private int preHeight = 0;
    private int photoWidth = 0;
    private int photoHeight = 0;
    double alphax = 0;
    double alphay = 0;
    private boolean isROI = false;
    private int[] m_lineX={0,0,0,0};
    private int[] m_lineY={0,0,0,0};
    private LineViewfinderView myView;
    private int ncount1=0;
    private int ncount2=0;
    private int ncount3=0;
    private ToneGenerator tone;
    private boolean bP = false;
    private boolean bPhoto =false;
    AlertDialog alertDialog = null;
    private SoundPool soundPool;
    private boolean bClose=false;
    private boolean bclear=false;
    HashMap musicId=new HashMap();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);// 横屏
        Configuration cf= this.getResources().getConfiguration(); //获取设置的配置信息
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
//			if(api==null){
//				api =new AutoCropImage();
//			}
            if(vlapi==null)
            {
                vlapi= new VLCardAPI();
                //String FilePath =Environment.getExternalStorageDirectory().toString()+"/"+UserID+".lic";
                String cacheDir =(this.getCacheDir()).getPath();
                String FilePath  = cacheDir + "/"+UserID+".lic";
                TelephonyManager telephonyManager = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
                int nRet = vlapi.VLKernalInit("",FilePath,UserID,0x05,0x02,telephonyManager,this);
                if(nRet!=0)
                {
                    Toast.makeText(getApplicationContext(), "激活失败", Toast.LENGTH_SHORT).show();
                    System.out.print("nRet="+nRet);
                    bInitKernal =false;
                }
                else
                {
                    System.out.print("nRet="+nRet);
                    bInitKernal=true;
                }
            }

            if(alertDialog==null){
                alertDialog = new AlertDialog.Builder(this).create();
            }
        }
        soundPool=new SoundPool(12, AudioManager.STREAM_SYSTEM,5);

        //通过load方法加载指定音频流，并将返回的音频ID放入musicId中

        musicId.put(1, soundPool.load(this, R.raw.find, 1));

        musicId.put(2, soundPool.load(this, R.raw.closer, 1));

        musicId.put(3, soundPool.load(this, R.raw.line, 1));
        musicId.put(4, soundPool.load(this, R.raw.photo, 1));
        musicId.put(5, soundPool.load(this, R.raw.error, 1));
        requestWindowFeature(Window.FEATURE_NO_TITLE);// 隐藏标题
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);// 设置全屏
        // // 屏幕常亮
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.activity_vlscan);
        findView();
    }
    public void copyDataBase() throws IOException {
        //  Common common = new Common();
        //  String dst = Environment.getExternalStorageDirectory().toString() + "/"+UserID+".lic";
        String cacheDir =(this.getCacheDir()).getPath();
        String dst  = cacheDir + "/"+UserID+".lic";
        File file = new File(dst);
        if (!file.exists()) {
            // file.createNewFile();
        } else {
            file.delete();
        }

        try {
            InputStream myInput = getAssets().open(UserID+".lic");
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
            System.out.println(UserID+".lic" + "is not found");
        }
    }

    private void findView() {
        surfaceView = (SurfaceView) findViewById(R.id.surfaceViwe);
        re_c = (RelativeLayout) findViewById(R.id.re_c);
        back = (ImageButton) findViewById(R.id.back_camera);
        flash = (ImageButton) findViewById(R.id.flash_camera);
        change = (ImageButton) findViewById(R.id.change);
        remind =(TextView) findViewById(R.id.remind);
        take_pic = (ImageButton) findViewById(R.id.take_pic);
        mtext=  (TextView) findViewById(R.id.text);

        DisplayMetrics metric = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(metric);
        width = metric.widthPixels; // 屏幕宽度（像素）
        height = metric.heightPixels; // 屏幕高度（像素）

        mtext.setText("当前为自动拍照识别模式");
        mtext.setTextColor(Color.WHITE);
        mtext.setTextSize(TypedValue.COMPLEX_UNIT_PX,height/18);
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams( RelativeLayout.LayoutParams.WRAP_CONTENT,RelativeLayout.LayoutParams.WRAP_CONTENT );
        layoutParams.addRule(RelativeLayout.CENTER_HORIZONTAL, RelativeLayout.TRUE);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM, RelativeLayout.TRUE);
        layoutParams.bottomMargin = (int) (height * 0.1);
        mtext.setLayoutParams(layoutParams);

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

        layoutParams = new RelativeLayout.LayoutParams(back_w, back_h);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT, RelativeLayout.TRUE);
        layoutParams.addRule(RelativeLayout.CENTER_VERTICAL, RelativeLayout.TRUE);
        layoutParams.leftMargin = (int) (back_h/3);
        //layoutParams.topMargin = (int) (height * 0.5);
        change.setLayoutParams(layoutParams);

        int takepic_w = (int) (width * 0.106796875);
        int takepic_h = (int) (takepic_w * 1);
        layoutParams = new RelativeLayout.LayoutParams(takepic_w, takepic_h);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
        layoutParams.addRule(RelativeLayout.CENTER_VERTICAL, RelativeLayout.TRUE);
        layoutParams.rightMargin = (int) ((width-(14*height/15)*88/58)/2+back_h/4);
        take_pic.setLayoutParams(layoutParams);
        take_pic.setVisibility(View.INVISIBLE);

        remind.setText("正在查找证件...");
        remind.setTextColor(Color.WHITE);
        remind.setBackgroundColor(Color.GREEN);
        remind .setTextSize(TypedValue.COMPLEX_UNIT_PX,height/18);
        layoutParams = new RelativeLayout.LayoutParams( RelativeLayout.LayoutParams.WRAP_CONTENT,RelativeLayout.LayoutParams.WRAP_CONTENT );
        layoutParams.addRule(RelativeLayout.CENTER_HORIZONTAL, RelativeLayout.TRUE);
        layoutParams.addRule(RelativeLayout.CENTER_VERTICAL, RelativeLayout.TRUE);
        remind.setLayoutParams(layoutParams);
        //remind.setVisibility(View.INVISIBLE);

        surfaceHolder = surfaceView.getHolder();
        surfaceHolder.addCallback(this);
        surfaceHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);

        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if	(vlapi!=null){
                    vlapi.VLKernalUnInit();
                    vlapi=null;
                }
                try {
                    if (mycamera != null) {
                        if (time != null) {
                            time.cancel();
                            time = null;
                        }
                        if (timer != null)
                        {
                            timer.cancel();
                            timer = null;
                        }
                        mycamera.setPreviewCallback(null);
                        mycamera.stopPreview();
                        mycamera.release();
                        mycamera = null;
                    }
                } catch (Exception e) {
                }
                finish();
            }
        });
        flash.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_FLASH)) {
                    String mess = getResources().getString(R.string.toast_flash);
                    Toast.makeText(VLScanActivity.this, mess, Toast.LENGTH_LONG).show();
                } else {
                    if (mycamera != null) {
                        Camera.Parameters parameters = mycamera.getParameters();
                        String flashMode = parameters.getFlashMode();
                        if (flashMode.equals(Camera.Parameters.FLASH_MODE_TORCH)) {
                            parameters.setFlashMode(Camera.Parameters.FLASH_MODE_OFF);
                            parameters.setExposureCompensation(0);
                        } else {
                            parameters.setFlashMode(Camera.Parameters.FLASH_MODE_TORCH);// 闪光灯常亮
                            parameters.setExposureCompensation(-1);
                        }
                        try {
                            mycamera.setParameters(parameters);
                        } catch (Exception e) {
                            String mess = getResources().getString(R.string.toast_flash);
                            Toast.makeText(VLScanActivity.this, mess, Toast.LENGTH_LONG).show();
                        }
                        mycamera.startPreview();
                    }
                }
            }
        });
        change.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!bPhoto)
                {
                    //change.setText("拍照模式");
                    if(myView!=null){
                        myView.setPaintLine(true);
                    }
                    mtext.setText("当前为手动拍照识别模式");
                    remind.setText("");
                    mtext.setTextColor(Color.WHITE);
                    mtext.setTextSize(TypedValue.COMPLEX_UNIT_PX,height/18);
                    take_pic.setVisibility(View.VISIBLE);
                    bPhoto =true;
                    if(mycamera!=null)
                    {
                        mycamera.setPreviewCallback(null);
                        Camera.Parameters parameters =mycamera.getParameters();
                        if (getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_AUTOFOCUS)) {
                            parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO);
                        }
                        mycamera.setParameters(parameters);
                    }
                }
                else
                {
                    //change.setText("视频流模式");
                    if(myView!=null){
                        myView.setPaintLine(false);
                    }
                    mtext.setText("当前为自动拍照识别模式");
                    remind.setText("正在查找证件...");
                    mtext.setTextColor(Color.WHITE);
                    mtext.setTextSize(TypedValue.COMPLEX_UNIT_PX,height/18);
                    take_pic.setVisibility(View.INVISIBLE);
                    if(mycamera!=null)
                    {
                        mycamera.setPreviewCallback(VLScanActivity.this);
                        Camera.Parameters parameters =mycamera.getParameters();
                        if (parameters.getSupportedFocusModes().contains(
                                parameters.FOCUS_MODE_CONTINUOUS_PICTURE)) {
                            parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);
                        }
                        else if (parameters.getSupportedFocusModes().contains(
                                parameters.FOCUS_MODE_AUTO))
                        {
                            parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO);// 1连续对焦
                        }
                        mycamera.setParameters(parameters);

                    }

                    bPhoto =false;
                }
            }
        });
        take_pic.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!alertDialog.isShowing()){
                    if (mycamera != null) {
                        try {
                            bP =false;
                            isFocusTakePicture();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        });

    }

    private void isFocusTakePicture() {

        mycamera.autoFocus(new Camera.AutoFocusCallback() {
            public void onAutoFocus(boolean success, Camera camera) {
                if (success&&!bP)
                {
                    try{
                        mycamera.takePicture(null, null, picturecallback);
                    } catch (RuntimeException e ) {
                        e.printStackTrace();
                        return ;
                    }
                }
            }
        });
    }
    private void isTakePicture() {
        mycamera.setPreviewCallback(null);
        Camera.Parameters parameters =mycamera.getParameters();
        if (getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_AUTOFOCUS)) {
            parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO);
        }
        mycamera.setParameters(parameters);
        if(mycamera!=null)
        {
            mycamera.autoFocus(new Camera.AutoFocusCallback() {
                public void onAutoFocus(boolean success, Camera camera) {
                    if (success&&!bP)
                    {
                        bP=true;
                        try{
                            mycamera.takePicture(null, null, picturecallback);
                        } catch (RuntimeException e ) {
                            e.printStackTrace();
                            mycamera.startPreview();
                            return ;
                        }
                    }
                }
            });
            //		mycamera.autoFocus(null);
            //	try{
//					mycamera.takePicture(shutterCallback, null, picturecallback);
//				  } catch (RuntimeException e ) {
//					  mycamera.startPreview();
//		                e.printStackTrace();
//		                return ;
//		            }
        }
    }

    private Camera.PictureCallback picturecallback = new Camera.PictureCallback() {
        @Override
        public void onPictureTaken(byte[] data, Camera camera) {
            if (mycamera == null) {
                return ;
            }
            //tackData = data;
            int nlen = data.length;
            try
            {
                data2file(data,"VLSrc");
            }
            catch (Exception e) {
                System.out.println("图像写入失败！");
            }
//		for	(int i=0;i<4;i++)
//		{
//			m_lineX[i]=m_lineX[i]*photoWidth/preWidth;
//			System.out.println("M_lineX"+i+":"+m_lineX[i]);
//		}
//		for	(int i=0;i<4;i++)
//		{
//			m_lineY[i]=m_lineY[i]*photoHeight/preHeight;
//			System.out.println("M_lineY"+i+":"+m_lineY[i]);
//		}
            Long timeStart= System.currentTimeMillis();

            int nRet = vlapi.VLRecognizePhoto(data,nlen);
            Long timeEnd= System.currentTimeMillis();
            Long recogTime = timeEnd-timeStart;
            mVibrator = (Vibrator) getApplication().getSystemService(Service.VIBRATOR_SERVICE);
            mVibrator.vibrate(50);
            String strResult ="";
            if	(nRet==0){

//                for(int i =0;i<10;i++){
//                    strResult += vlapi.VLGetResult(i);
//                    strResult += "\r\n";
//                }
//                strResult  +="\r\n识别时间:"+recogTime+"ms";
                Intent rIntent = new Intent();
                rIntent.putExtra("carPlate",vlapi.VLGetResult(0)+"");
                rIntent.putExtra("carType",vlapi.VLGetResult(1)+"");
                rIntent.putExtra("carOwner",vlapi.VLGetResult(2)+"");
                rIntent.putExtra("carAddress",vlapi.VLGetResult(3)+"");
                rIntent.putExtra("carNature",vlapi.VLGetResult(4)+"");
                rIntent.putExtra("carBrand",vlapi.VLGetResult(5)+"");
                rIntent.putExtra("carVl",vlapi.VLGetResult(6)+"");
                rIntent.putExtra("carEngine",vlapi.VLGetResult(7)+"");
                rIntent.putExtra("carReg",vlapi.VLGetResult(8)+"");
                rIntent.putExtra("carCert",vlapi.VLGetResult(9)+"");
                setResult(Activity.RESULT_OK,rIntent);
                finish();
            }
            else
            {
                strResult +="图像不清晰!\r\n";
                strResult +="请重新拍照!";
            }
            strResult +="（点击屏幕继续识别）";
            alertDialog.setMessage(strResult);
            Window window = alertDialog.getWindow();
            WindowManager.LayoutParams lp = window.getAttributes();
            // 设置透明度为0.3
            lp.alpha = 0.8f;
            lp.width= width*2/3;
            //lp.flags= 0x00000020;
            window.setAttributes(lp);
            window.setGravity(Gravity.LEFT |Gravity.BOTTOM);

            if	(nRet==0)
            {
                System.out.println("图像写入成功");
            }
//		//mycamera.stopPreview();
//		Camera.Parameters parameters = mycamera.getParameters();
//		int pW = parameters.getPreviewSize().width;
//		int pH = parameters.getPreviewSize().height;

            bP=false;
            if(!bPhoto)
            {
                mycamera.cancelAutoFocus();
                mycamera.setPreviewCallback(VLScanActivity.this);
                Camera.Parameters parameters =mycamera.getParameters();
                if(parameters.getSupportedFocusModes().contains(parameters.FOCUS_MODE_CONTINUOUS_PICTURE)) {
                    parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);
                }
                mycamera.setParameters(parameters);
            }
            mycamera.startPreview();
            //alertDialog.show();
        }
    };
    private void data2file(byte[] w, String tag) throws Exception {
        //将二进制数据转换为文件的函数
        String strCaptureFilePath = PATH + tag+"_"+ pictureName() + ".jpg";
        FileOutputStream out =null;
        try {
            out =new FileOutputStream(strCaptureFilePath);
            out.write(w);
            out.close();
        } catch (Exception e) {
            if (out !=null)
                out.close();
            throw e;
        }
        // api.warpPerspective(strCaptureFilePath, strCaptureFilePath, m_lineX, m_lineY, 0);
    }

    private Camera.ShutterCallback shutterCallback = new Camera.ShutterCallback() {
        public void onShutter() {
            try {
                if (tone == null) {
                    tone = new ToneGenerator(1, ToneGenerator.MAX_VOLUME);
                }
                tone.startTone(ToneGenerator.TONE_PROP_BEEP);
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
    };

    @Override
    public void surfaceCreated(SurfaceHolder holder) {

//		if(api==null){
//			api =new AutoCropImage();
//
//		}
        if(vlapi==null)
        {
            vlapi= new VLCardAPI();
            String cacheDir =(this.getCacheDir()).getPath();
            String FilePath  = cacheDir + "/"+UserID+".lic";
            //String FilePath =Environment.getExternalStorageDirectory().toString()+"/"+UserID+".lic";
            TelephonyManager telephonyManager = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
            int nRet = vlapi.VLKernalInit("",FilePath,UserID,0x05,0x02,telephonyManager,this);
            if(nRet!=0)
            {
                Toast.makeText(getApplicationContext(), "激活失败", Toast.LENGTH_SHORT).show();
                System.out.print("nRet="+nRet);
                bInitKernal =false;
            }
            else
            {
                System.out.print("nRet="+nRet);
                bInitKernal=true;
            }
        }

        if(alertDialog==null){
            alertDialog = new AlertDialog.Builder(this).create();
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
            /**
             * 禁止打开相机时在此崩溃,TODO
             */
            mycamera.setPreviewDisplay(holder);
            initCamera(holder);
//			time = new Timer();
//			if (timer == null) {
//				timer = new TimerTask() {
//					public void run() {
//						// isSuccess=false;
//						if (mycamera != null) {
//							try {
//								mycamera.autoFocus(new AutoFocusCallback() {
//									public void onAutoFocus(boolean success, Camera camera) {
//										// isSuccess=success;
//									}
//								});
//							} catch (Exception e) {
//								e.printStackTrace();
//							}
//						}
//					};
//				};
//			}
            //time.schedule(timer, 500, 1500);

        } catch (IOException e) {
            e.printStackTrace();

        }
    }

    @Override
    public void surfaceChanged(final SurfaceHolder holder, int format, int width, int height) {
//		if (camera != null) {
//			camera.autoFocus(new AutoFocusCallback() {
//				@Override
//				public void onAutoFocus(boolean success, Camera camera) {
//					if (success) {
//						synchronized (camera) {
//							new Thread() {
//								public void run() {
//									initCamera(holder);
//									super.run();
//								}
//							}.start();
//						}
//						// camera.cancelAutoFocus();// 只有加上了这一句，才会自动对焦。
//					}
//				}
//			});
//		}
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        try {
//			if(api!=null)
//			{
//				api=null;
//			}
//
            if (mycamera != null) {
                if (time != null) {
                    time.cancel();
                    time = null;
                }
                if (timer != null)
                {
                    timer.cancel();
                    timer = null;
                }
                mycamera.setPreviewCallback(null);
                mycamera.stopPreview();
                mycamera.release();
                mycamera = null;
            }
        } catch (Exception e) {
        }
    }
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
            if (time != null) {
                time.cancel();
                time = null;
            }
            if (timer != null)
            {
                timer.cancel();
                timer = null;
            }
            finish();
        }
        return super.onKeyDown(keyCode, event);
    }

    @TargetApi(14)
    private void initCamera(SurfaceHolder holder) {
        Camera.Parameters parameters = mycamera.getParameters();
        List<Camera.Size> list = parameters.getSupportedPreviewSizes();
        List<Camera.Size> listP = parameters.getSupportedPictureSizes();
        Camera.Size size;
        Camera.Size tmpsize = getOptimalPreviewSize(list,width,height);
        int length = list.size();
        int previewWidth = list.get(0).width;
        int previewheight = list.get(0).height;
        int second_previewWidth = 0;
        int second_previewheight = 0;
        int nlast = -1;
        int nThird =-1;
        int Third_previewWidth = 0;
        int Third_previewheight = 0;
        previewWidth = tmpsize.width;
        previewheight = tmpsize.height;
//		if (length == 1) {
//			size = list.get(0);
//			previewWidth = size.width;
//			previewheight = size.height;
//		} else {
//
//			for (int i = 0; i < length; i++) {
//				size = list.get(i);
//				if (size.width * height == size.height * width) {
//
//					if(size.width >800){
//	                     if(size.width== width ){
//	                    	 previewWidth = size.width;
//							 previewheight = size.height;
//							 nlast =i;
//	                     }
//	                     else if(size.width!= width && size.width>previewWidth &&nlast==-1){
//	                    	 previewWidth = size.width;;
//							 previewheight = size.height;
//							 nlast =i;
//	                     }
//
//					}
//				}
//				else if(size.width==width&&nlast==-1)
//				{
//					if(size.height >=height)
//					{
//						previewWidth  = size.width;
//						previewheight = size.height;
//						nThird =i;
//					}
//				}
//				else if(size.height ==height &&nlast==-1&&nThird ==-1)
//				{
//					if(size.width >=width)
//					{
//						previewWidth  = size.width;
//						previewheight = size.height;
//						//nThird =i;
//					}
//				}
//			}
//		}
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
        length = listP.size();
        int pwidth = listP.get(0).width;
        int pheight = listP.get(0).height;
        second_previewWidth = 0;
        second_previewheight = 0;
        nlast = -1;
        nThird =-1;
        //	 Third_previewWidth = 0;
        //	 Third_previewheight = 0;
        if (length == 1) {
            size = listP.get(0);
            pwidth = size.width;
            pheight = size.height;
        } else {

            for (int i = 0; i < length; i++) {
                size = listP.get(i);
                if (size.width * height == size.height * width) {

                    if(size.width >800){
                        if(size.width== width ){
                            pwidth = size.width;
                            pheight = size.height;
                            nlast =i;
                        }
                        else if(size.width!= width && size.width>pwidth &&nlast==-1){
                            pwidth = size.width;;
                            pheight = size.height;
                            nlast =i;
                        }

                    }
                }
                else if(size.width==width&&nlast==-1)
                {
                    if(size.height >=height)
                    {
                        pwidth  = size.width;
                        pheight = size.height;
                        nThird =i;
                    }
                }
                else if(size.height ==height &&nlast==-1&&nThird ==-1)
                {
                    if(size.width >=width)
                    {
                        pwidth  = size.width;
                        pheight = size.height;
                        //nThird =i;
                    }
                }
            }
        }
        photoWidth=pwidth;
        photoHeight=pheight;
        if(myView==null){
            myView = new LineViewfinderView(this, width, height);
            re_c.addView(myView);
        }
        parameters.setPictureFormat(PixelFormat.JPEG);
        parameters.setJpegQuality(100);
        parameters.setPreviewSize(preWidth,preHeight);
        parameters.setPictureSize(photoWidth,photoHeight);
        if (parameters.getSupportedFocusModes().contains(
                parameters.FOCUS_MODE_CONTINUOUS_PICTURE))
        {
            if (time != null) {
                time.cancel();
                time = null;
            }
            if (timer != null) {
                timer.cancel();
                timer = null;
            }
            parameters
                    .setFocusMode(parameters.FOCUS_MODE_CONTINUOUS_PICTURE);
        }
//		else
        //	if (parameters.getSupportedFocusModes().contains(
        //			parameters.FOCUS_MODE_AUTO))
        //	{
        //		parameters.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO);// 1连续对焦
        //	}
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
        String strCaptureFilePath = PATH + tag + "_Bank_" + pictureName() + ".jpg";
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
        t.setToNow(); // 取得系统时间。
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
    @Override
    public void onPreviewFrame(byte[] data, Camera camera) {
        Camera.Parameters parameters = camera.getParameters();
        for (int i = 0; i < 4; i++) {
            m_lineX[i] = 0;
        }
        for (int i = 0; i < 4; i++) {
            m_lineY[i] = 0;
        }
        AudioManager mgr = (AudioManager) this
                .getSystemService(Context.AUDIO_SERVICE);
        ((Activity) this).setVolumeControlStream(AudioManager.STREAM_SYSTEM);
        float streamVolumeCurrent = mgr
                .getStreamVolume(AudioManager.STREAM_SYSTEM);
        float streamVolumeMax = mgr
                .getStreamMaxVolume(AudioManager.STREAM_SYSTEM);
        float volume = streamVolumeCurrent / streamVolumeMax;
        if (!alertDialog.isShowing() && !bPhoto) {

            int r = vlapi.VLDetectLine(data,
                    parameters.getPreviewSize().width,
                    parameters.getPreviewSize().height, m_lineX, m_lineY);
            if (myView != null) {
                myView.SetLine(m_lineX, m_lineY,
                        parameters.getPreviewSize().width,
                        parameters.getPreviewSize().height);
            }
            if (r == 0) {
                bClose = false;
                ncount1 = 0;
                ncount2 = 0;
                ncount3 = 0;
                remind.setText("准备拍照，请不要移动...");
                soundPool.play((Integer) (musicId.get(4)), volume, volume,
                        0, 0, 1);
                isTakePicture();

            } else if (r == 31) {
                bclear = false;
                remind.setText("请靠近点...");
                if (ncount1 == 5) {
                    if (bClose == false) {
                        soundPool.play((Integer) (musicId.get(2)), volume,
                                volume, 0, 0, 1);
                        bClose = true;
                    }

                    ncount1 = 0;
                } else {
                    ncount1++;
                }
            } else if (r == 33) {
                bclear = false;
                remind.setText("正在查找证件...");
                ncount1 = 0;
                bClose = false;
            } else if ( r == 32) {

                remind.setText("正在检线...");
                ncount1 = 0;
                bClose = false;
            }
            else if(r==34){
                // remind.setText("非行驶证图片");
                if (bclear == false) {
                    soundPool.play((Integer) (musicId.get(5)), volume,
                            volume, 0, 0, 1);
                    bclear = true;
                }
            }
        }
    }
    @Override
    protected void onPause() {
        for	(int i=0;i<4;i++)
        {
            m_lineX[i]=0;
        }
        for	(int i=0;i<4;i++)
        {
            m_lineY[i]=0;
        }
        if(myView!=null)
        {
            myView.SetLine(m_lineX, m_lineY, preWidth, preHeight);
            if(!bPhoto){
                myView.setPaintLine(false);
            }else{
                myView.setPaintLine(true);
            }
            myView.invalidate();
        }
        super.onPause();

    }
    @Override
    protected void onResume()
    {
        super.onResume();
    }
    @Override
    protected void onStop() {

        super.onStop();
        for	(int i=0;i<4;i++)
        {
            m_lineX[i]=0;
        }
        for	(int i=0;i<4;i++)
        {
            m_lineY[i]=0;
        }
        if(myView!=null)
        {
            myView.SetLine(m_lineX, m_lineY, preWidth, preHeight);
            if(!bPhoto){
                myView.setPaintLine(false);
            }else{
                myView.setPaintLine(true);
            }
            myView.invalidate();
        }
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
        if (bitmap != null) {
            bitmap.recycle();
            bitmap = null;
        }
        if(vlapi!=null){

            vlapi.VLKernalUnInit();
            vlapi=null;
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
    }
    public static int[] convertYUV420_NV21toARGB8888(byte[] data, int width, int height) {
        int size = width * height;
        int offset = size;
        int[] pixels = new int[size];
        int u, v, y1, y2, y3, y4;

        // i along Y and the final pixels
        // k along pixels U and V
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
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
//        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    private Camera.Size getOptimalPreviewSize(List<Camera.Size> sizes, int w, int h) {
        final double ASPECT_TOLERANCE = 0.1;
        double targetRatio = (double) w / h;
        if (sizes == null) return null;

        Camera.Size optimalSize = null;
        double minDiff = Double.MAX_VALUE;

        int targetHeight = h;

        // Try to find an size match aspect ratio and size
        for (Camera.Size size : sizes) {
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
            for (Camera.Size size : sizes) {
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