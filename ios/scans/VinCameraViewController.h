//
//  VinCameraViewController.h
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

typedef void(^vinscanBlock)(NSString *scane,NSString *error);
@class VinCameraViewController;

@protocol CameraDelegate <NSObject>

@required
//vin码初始化结果
- (void)initVinTyperWithResult:(int)nInit;

@optional

@end

@interface VinCameraViewController : UIViewController
@property (nonatomic,strong)vinscanBlock  scaneResult;
@property (assign, nonatomic) id<CameraDelegate>delegate;
@property(strong, nonatomic) UIImage *resultImg; //vin码区域图像
@property (nonatomic, strong) CMMotionManager* motionManager;
@end
