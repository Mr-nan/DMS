//
//  DmsCustom.m
//  DMS
//
//  Created by lcus on 2017/5/23.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "DmsCustom.h"
#import "VLCameraViewController.h"
#import "VinCameraViewController.h"
#import "OBDScanController.h"
#import "IDCardCameraViewController.h"
#import "AppDelegate.h"


@implementation DmsCustom

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(scanVL:(RCTResponseSenderBlock)callback){
  
dispatch_async(dispatch_get_main_queue(), ^{
  VLCameraViewController *one = [[VLCameraViewController alloc]init];
  one.nsUserID=@"4D39F52BD46AC7CD8470";
  one.scaneResult=^(NSDictionary*successInfo,NSString*errorInfo){
    
    callback(@[successInfo,errorInfo]);
    
  };
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  
  [app.window.rootViewController presentViewController:one animated:YES completion:nil];
 });
}

RCT_EXPORT_METHOD(scanVin:(RCTResponseSenderBlock)callback){
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    VinCameraViewController *Vin=[[VinCameraViewController alloc]init];
    
    Vin.scaneResult=^(NSString*successInfo,NSString*errorInfo){
      
      callback(@[successInfo,errorInfo]);
      
    };
    
    AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    
    [app.window.rootViewController presentViewController:Vin animated:YES completion:nil];
    
  });
}

RCT_EXPORT_METHOD(qrScan:(RCTResponseSenderBlock)callback){
  
  dispatch_async(dispatch_get_main_queue(), ^{
    OBDScanController *obd=[[OBDScanController alloc]init];
    AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    obd.JsBolock=^(NSString*successInfo,NSString* error){
      callback(@[successInfo,error]);
    };
    [app.window.rootViewController presentViewController:[[UINavigationController alloc]initWithRootViewController:obd] animated:YES completion:nil];
  
  });
}
RCT_EXPORT_METHOD(scanID:(RCTResponseSenderBlock)callback){
  dispatch_async(dispatch_get_main_queue(), ^{
  IDCardCameraViewController *cameraView = [[IDCardCameraViewController alloc]init];
  cameraView.nsUserID = @"4D39F52BD46AC7CD8470";//授权码
  cameraView.resultblock=^(NSString*successInfo ,NSString*error){
    
     callback(@[successInfo,error]);
  };
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  
 [app.window.rootViewController presentViewController:cameraView animated:YES completion:nil];
    
  });
}




@end
