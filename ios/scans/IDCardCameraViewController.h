//
//  IDCardCameraViewController.h
//  SIDCard
//
//  Created by etop on 15/12/22.
//  Copyright (c) 2015年 etop. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>
#import <CoreMedia/CoreMedia.h>
#import <CoreMotion/CoreMotion.h>

typedef void(^IdScanBlock)(NSString *scane,NSString*errorInfo);
@class IDCardCameraViewController;
@protocol CameraDelegate <NSObject>

@required
//初始化结果，判断核心是否初始化成功
- (void)initIDCardWithResult:(int)nInit;

@optional

@end

@interface IDCardCameraViewController : UIViewController
@property (nonatomic,strong)IdScanBlock resultblock;
@property (assign, nonatomic) id<CameraDelegate>delegate;
@property (copy, nonatomic) NSString *nsUserID; //授权码
@property (nonatomic, strong) CMMotionManager* motionManager;
@end
