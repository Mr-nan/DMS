//
//  DmsCustom.m
//  DMS
//
//  Created by lcus on 2017/5/23.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "DmsCustom.h"
#import "VLCameraViewController.h"
#import "AppDelegate.h"


@implementation DmsCustom

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(scanVL:(RCTResponseSenderBlock)callback){
  
  VLCameraViewController *one = [[VLCameraViewController alloc]init];
  one.nsUserID=@"4D39F52BD46AC7CD8470";
  one.scaneResult=^(NSDictionary*successInfo,NSString*errorInfo){
    
    callback(@[successInfo,errorInfo]);
    
  };
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  
  [app.window.rootViewController presentViewController:one animated:YES completion:nil];

}


@end
