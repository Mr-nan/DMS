package com.dms.custom.vin.scan;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.view.View;

import com.dms.custom.R;

/**
 * Created by Administrator on 2017/2/27.
 */

public class LineViewfinderView extends View {
    private static final long ANIMATION_DELAY = 5L;

    private final Paint paint;
    private final Paint paintLine;
    // private Bitmap resultBitmap;
    private final int maskColor;
    private final int frameColor;
    private int leftLine = 0;
    private int topLine = 0;
    private int rightLine = 0;
    private int bottomLine = 0;

    private Rect frame;
    private Rect[]line=new Rect[4];

    int w, h;
    boolean boo = false;
    private Paint mTextPaint;
    private String mText;
    boolean bPaintLine = false;
    public LineViewfinderView(Context context, int w, int h) {
        super(context);
        this.w = w;
        this.h = h;
        paint = new Paint();
        paintLine = new Paint();
        Resources resources = getResources();
        maskColor = resources.getColor(R.color.viewfinder_mask);
        frameColor = resources.getColor(R.color.viewfinder_frame);
        //line =new Rect[4];
        for(int i=0;i<4;i++)
        {
            line[i]=new Rect(0,0,0,0);
//			line[i].left=0;
//			line[i].top=0;
//			line[i].right=0;
//			line[i].bottom=0;
        }
    }

    public LineViewfinderView(Context context, int w, int h, boolean boo) {
        super(context);
        this.w = w;
        this.h = h;
        this.boo = boo;
        paint = new Paint();
        paintLine = new Paint();
        Resources resources = getResources();
        maskColor = resources.getColor(R.color.viewfinder_mask);
        frameColor = resources.getColor(R.color.viewfinder_frame);
        for(int i=0;i<4;i++)
        {
            line[i]=new Rect(0,0,0,0);
//			line[i].left=0;
//			line[i].top=0;
//			line[i].right=0;
//			line[i].bottom=0;
        }
    }
    public void SetLine( int []ArrayX,int[]ArrayY,int nW,int nH)
    {
        // double nHr = (double)(nH)/(double)(this.h);
        //double nWr = (double)nW/(double)this.w;
        this.line[0].left=ArrayX[0];
        this. line[0].right=ArrayY[0];
        this. line[0].top=ArrayX[3];
        this. line[0].bottom=ArrayY[3];

        this. line[1].left= ArrayX[0];
        this. line[1].right= ArrayY[0];
        this.line[1].top= ArrayX[1];
        this.line[1].bottom=ArrayY[1];

        this. line[2].left=ArrayX[1];
        this.line[2].right=ArrayY[1];
        this.line[2].top=ArrayX[2];
        this.line[2].bottom=ArrayY[2];

        this.line[3].left=ArrayX[3];
        this. line[3].right=ArrayY[3];
        this.line[3].top=ArrayX[2];
        this. line[3].bottom=ArrayY[2];
        for(int i =0;i<4;i++){
            this.line[i].left =this.line[i].left*this.w/nW;
            this.line[i].right =this.line[i].right*this.h/nH;
            this.line[i].top =this.line[i].top*this.w/nW;
            this.line[i].bottom =this.line[i].bottom*this.h/nH;;
        }
    }
    public void setLeftLine(int leftLine) {
        this.leftLine = leftLine;
    }
    public void setPaintLine(boolean PaintLine)
    {
        this.bPaintLine = PaintLine;
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
    public int max(int a,int b)
    {
        return a>b?a:b;
    }
    public int min(int a,int b)
    {
        return a>b?b:a;
    }
    @Override
    public void onDraw(Canvas canvas) {
        int width = canvas.getWidth();
        int height = canvas.getHeight();

        int t;
        int b;
        int l;
        int r;
        t =  height/30;
        b = height*29/30;
        int ntmpW =(b-t)*88/58;
        l = (width-ntmpW)/2;
        r =  width-l;
        frame = new Rect(l, t, r, b);

        // 鐢诲嚭鎵弿妗嗗闈㈢殑闃村奖閮ㄥ垎锛屽叡鍥涗釜閮ㄥ垎锛屾壂鎻忔鐨勪笂闈㈠埌灞忓箷涓婇潰锛屾壂鎻忔鐨勪笅闈㈠埌灞忓箷涓嬮�?		// 鎵弿妗嗙殑宸﹁竟闈㈠埌灞忓箷宸﹁竟锛屾壂鎻忔鐨勫彸杈瑰埌灞忓箷鍙宠竟
        paint.setColor(maskColor);
        canvas.drawRect(0, 0, width, frame.top, paint);
        canvas.drawRect(0, frame.top, frame.left, frame.bottom + 1, paint);
        canvas.drawRect(frame.right + 1, frame.top, width, frame.bottom + 1,
                paint);
        canvas.drawRect(0, frame.bottom + 1, width, height, paint);
//
        paintLine.setColor(frameColor);
        paintLine.setStrokeWidth(8);
        paintLine.setAntiAlias(true);
//		//canvas.drawLine(15, height/3, 30, height*2/3, paintLine);
        if(bPaintLine)
        {
            int num = (b - t) / 6;
            canvas.drawLine(l - 4, t, l + num, t, paintLine);
            canvas.drawLine(l, t, l, t + num, paintLine);

            canvas.drawLine(r, t, r - num, t, paintLine);
            canvas.drawLine(r, t - 4, r, t + num, paintLine);

            canvas.drawLine(l - 4, b, l + num, b, paintLine);
            canvas.drawLine(l, b, l, b - num, paintLine);

            canvas.drawLine(r, b, r - num, b, paintLine);
            canvas.drawLine(r, b + 4, r, b - num, paintLine);
        }
        else
        {
            for(int i=0;i<4;i++)
            {
                if((line[i].left!=0&&line[i].top!=0&&line[i].right!=0&&line[i].bottom!=0)
                        ||(line[i].left!=-1&&line[i].top!=-1&&line[i].right!=-1&&line[i].bottom!=-1))
                {
                    int nsub =0;
                    if(i==0||i==2)
                    {
                        nsub =4;
                    }
                    canvas.drawLine(line[i].left, line[i].right-nsub, line[i].top, line[i].bottom+nsub, paintLine);
                }
            }
        }


//		if (leftLine == 1) {
//			canvas.drawLine(l, t, l, b, paintLine);
//		}
//		if (rightLine == 1) {
//			canvas.drawLine(r, t, r, b, paintLine);
//		}
//		if (topLine == 1) {
//			canvas.drawLine(l, t, r, t, paintLine);
//		}
//		if (bottomLine == 1) {
//			canvas.drawLine(l, b, r, b, paintLine);
//		}
        mText = "请将证件放置框内且尽量占满整个框";
        mTextPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mTextPaint.setStrokeWidth(3);
        mTextPaint.setTextSize((h - b)*3/2);
        mTextPaint.setColor(Color.WHITE);
        mTextPaint.setTextAlign(Paint.Align.CENTER);
        canvas.drawText(mText, w / 2, h * 1 / 5, mTextPaint);
//		String mText1 = "1234  5678  9012  3456";
//		mTextPaint.setTextSize((h - b) * 7/ 10);
//		//mTextPaint.setColor(laserColor);
//		mTextPaint.setTextAlign(Paint.Align.CENTER);
//		canvas.drawText(mText1, w / 2, (b - (b - t) * 2 / 5) + (h - b) * 7 / 20,
//				mTextPaint);
        if (frame == null) {
            return;
        }

        postInvalidateDelayed(ANIMATION_DELAY);
    }
}
