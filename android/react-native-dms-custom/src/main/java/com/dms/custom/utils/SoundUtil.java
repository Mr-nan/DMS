package com.dms.custom.utils;

import android.content.Context;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.Handler;
import android.os.Message;
import android.util.Log;


import com.dms.custom.R;

import java.util.HashMap;

/**
 * Created by thinkpad on 2016/9/5.
 */
public class SoundUtil {
    private static SoundUtil soundUtil;
    private static SoundPool soundpool;
    private static Context context;
    private static HashMap musicId = new HashMap();
    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 1:
                    int play = soundpool.play((Integer) musicId.get(1), 1, 1, 0, 0, 1);
                    if(play==0){
                        Log.e("123","eeeeeeeeee");
                        soundpool.release();
                        musicId.put(1, soundpool.load(context, R.raw.success, 1));
                        musicId.put(2, soundpool.load(context, R.raw.errorvl, 1));
                    }
                    break;
                case 2:
                    int plays = soundpool.play((Integer) musicId.get(2), 1, 1, 0, 0, 1);
                    if(plays==0){
                        Log.e("123","eeeeeeeeee");
                        soundpool.release();
                        musicId.put(1, soundpool.load(context, R.raw.success, 1));
                        musicId.put(2, soundpool.load(context, R.raw.errorvl, 1));
                    }
                    break;
            }
        }
    };

    private SoundUtil() {
    }

    public static SoundUtil getInstance(Context contexts) {
        context = contexts;
        if (soundUtil == null||soundpool==null) {
            soundUtil = new SoundUtil();
            soundpool = new SoundPool(15, AudioManager.STREAM_SYSTEM, 5);
            musicId.put(1, soundpool.load(context, R.raw.success, 1));
            musicId.put(2, soundpool.load(context, R.raw.errorvl, 1));
        }
        return soundUtil;
    }

    public synchronized void  soundSuccess() {
        mHandler.sendEmptyMessageDelayed(1, 500);
    }

    public void soundError() {
        mHandler.sendEmptyMessageDelayed(2, 500);
    }

}
