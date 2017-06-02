package com.dms.custom.idcard;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.view.View;
import android.view.animation.TranslateAnimation;
import com.dms.custom.R;


public final class SIDViewfinderView extends View {
    private static final long ANIMATION_DELAY = 50;
    private TranslateAnimation myAnimation_Alpha;
    private Rect mRect;
    /**
     * 中间滑动线的最顶端位置
     */
    private int slideTop;

    /**
     * 中间滑动线的速度
     */
    private final Paint paint;
    private final Paint paintLine;
    private final int maskColor;
    private final int resultColor;
    private final int frameColor;
    private final int laserColor;
    private int scannerAlpha;
    private int leftLine = 0;
    private int topLine = 0;
    private int rightLine = 0;
    private int bottomLine = 0;
    private Paint mTextPaint;
    private String mText;
    private Rect frame;

    int w, h;
    boolean boo = false;

    public SIDViewfinderView(Context context, int w, int h) {
        super(context);
        this.w = w;
        this.h = h;
        paint = new Paint();
        paintLine = new Paint();
        Resources resources = getResources();
        maskColor = resources.getColor(R.color.viewfinder_mask);
        resultColor = resources.getColor(R.color.result_view);
        frameColor = resources.getColor(R.color.viewfinder_frame);// 绿色
        laserColor = resources.getColor(R.color.viewfinder_laser);// 白色
        scannerAlpha = 0;
        mRect = new Rect();

    }

    public SIDViewfinderView(Context context, int w, int h, boolean boo) {
        super(context);
        this.w = w;
        this.h = h;
        this.boo = boo;
        paint = new Paint();
        paintLine = new Paint();
        Resources resources = getResources();
        maskColor = resources.getColor(R.color.viewfinder_mask);
        resultColor = resources.getColor(R.color.result_view);
        frameColor = resources.getColor(R.color.viewfinder_frame);// 绿色
        laserColor = resources.getColor(R.color.viewfinder_laser);// 红色
    }

    public void setLeftLine(int leftLine) {
        this.leftLine = leftLine;
    }

    public void setTopLine(int topLine) {
        this.topLine = topLine;
    }

    public void setRightLine(int rightLine) {
        this.rightLine = rightLine;
    }

    public void setBottomLine(int bottomLine) {
        this.bottomLine = bottomLine;
    }

    @Override
    public void onDraw(Canvas canvas) {
        int width = canvas.getWidth();
        int height = canvas.getHeight();

        int t;
        int b;
        int l;
        int r;

        t = height / 10;
        b = height * 9 / 10;
        int ntmpW = (b - t) * 88 / 58;
        l = (width - ntmpW) / 2;
        r = width - l;

        frame = new Rect(l, t, r, b);
        // 画出扫描框外面的阴影部分，共四;个部分，扫描框的上面到屏幕上面，扫描框的下面到屏幕下面
        // 扫描框的左边面到屏幕左边，扫描框的右边到屏幕右边
        paint.setColor(maskColor);
        canvas.drawRect(0, 0, width, frame.top, paint);
        canvas.drawRect(0, frame.top, frame.left, frame.bottom + 1, paint);
        canvas.drawRect(frame.right + 1, frame.top, width, frame.bottom + 1, paint);
        canvas.drawRect(0, frame.bottom + 1, width, height, paint);

        paintLine.setColor(frameColor);
        paintLine.setStrokeWidth(16);
        paintLine.setAntiAlias(true);
        int num = (b - t) / 5;
        canvas.drawLine(l - 8, t, l + num, t, paintLine);
        canvas.drawLine(l, t, l, t + num, paintLine);

        canvas.drawLine(r + 8, t, r - num, t, paintLine);
        canvas.drawLine(r, t, r, t + num, paintLine);

        canvas.drawLine(l - 8, b, l + num, b, paintLine);
        canvas.drawLine(l, b, l, b - num, paintLine);

        canvas.drawLine(r + 8, b, r - num, b, paintLine);
        canvas.drawLine(r, b, r, b - num, paintLine);

        paintLine.setColor(laserColor);
        paintLine.setAlpha(100);
        paintLine.setStrokeWidth(3);
        paintLine.setAntiAlias(true);
        canvas.drawLine(l, t + num, l, b - num, paintLine);
        canvas.drawLine(r, t + num, r, b - num, paintLine);
        canvas.drawLine(l + num, t, r - num, t, paintLine);
        canvas.drawLine(l + num, b, r - num, b, paintLine);

        mText = "请将证件放置于框内";
        // String mText1= "若长时间无法识别，请拍照识别";
        mTextPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mTextPaint.setStrokeWidth(3);
        mTextPaint.setTextSize(50);
        mTextPaint.setColor(frameColor);
        mTextPaint.setTextAlign(Paint.Align.CENTER);
        canvas.drawText(mText, w / 2, h * 3 / 4, mTextPaint);
        //canvas.drawText(mText1,w/2,h/2+h/5, mTextPaint);
        if (frame == null) {
            return;
        }

        postInvalidateDelayed(ANIMATION_DELAY);
    }

}
