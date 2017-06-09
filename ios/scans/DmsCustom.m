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
#import "BLERFID.h"


@interface DmsCustom ()<IParseRFID>

@property(nonatomic,strong)BLERFID *fild;
@property(nonatomic,strong)NSMutableDictionary *fils;
@property(nonatomic,assign)BOOL isconection;
@end

@implementation DmsCustom

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();


//初始化蓝牙
RCT_EXPORT_METHOD(startBluetooth){
  
  self.fild=[[BLERFID alloc]initWithParseRFIDDelegate:self];
  self.fils=[[NSMutableDictionary alloc]init];

}
//开始扫描
RCT_EXPORT_METHOD(startFind:(RCTResponseSenderBlock)callback){
    callback(@[ @{@"suc":@"正在扫描",@"fail":@"请开启蓝牙"}]);
  [self.fild scanForPeripherals];
  

}

RCT_EXPORT_METHOD(startConnection:(NSString *)perUUid){
  
  CBPeripheral *perl=[self.fils objectForKey:perUUid];

  [self.fild connPeripheral:perl];
}

RCT_EXPORT_METHOD(stopFind){

}

RCT_EXPORT_METHOD(disConperipheral:(CBPeripheral *)peripheral){
  
  [self.fild disConn:peripheral];
}

RCT_EXPORT_METHOD(isConnection:(RCTResponseSenderBlock)callback){
  
  if(self.isconection){
    
    callback(@[ @{@"suc":@"1",@"fail":@"0"}]);

  }else{
     callback(@[ @{@"suc":@"0",@"fail":@"0"}]);
  }
  
}

-(void)mgrDidUpdateState:(CBManagerState)state{
  
 

  
}


-(void)pushData:(char *)tid epc:(char *)epc{
  [self.bridge.eventDispatcher sendAppEventWithName:@"onReadData" body:@{@"result":[NSString stringWithUTF8String:tid].uppercaseString}];
}
-(void)didDiscoverPeripheral:(CBPeripheral *)peripheral RSSI:(NSNumber *)RSSI{
  
  
  [self.fils setObject:peripheral forKey:peripheral.identifier.UUIDString];
  
  [self.bridge.eventDispatcher sendAppEventWithName:@"findBluetooth" body:@{@"name":peripheral.name,@"rssi":RSSI,@"address":peripheral.identifier.UUIDString}];


}
-(void)connectPeripheralState:(BLEConnState)state{
  
  if(state==BLEConnStateSuc){
    
    self.isconection=YES;
    [self.bridge.eventDispatcher sendAppEventWithName:@"onBleConnection" body:nil];
    
    
  }else if (state==BLEConnStateDisconn){
    
   [self.bridge.eventDispatcher sendAppEventWithName:@"onBleDisCon" body:nil];
    
    self.isconection=NO;
    
  }
  
}

RCT_EXPORT_METHOD(scanVL:(RCTResponseSenderBlock)callback){
  
dispatch_async(dispatch_get_main_queue(), ^{
  VLCameraViewController *one = [[VLCameraViewController alloc]init];
  one.nsUserID=@"4D39F52BD46AC7CD8470";
  one.scaneResult=^(NSDictionary*successInfo,NSString*errorInfo){
    
 
    callback(@[ @{@"suc":successInfo,@"fail":errorInfo}]);
    
  };
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  
  [app.window.rootViewController presentViewController:one animated:YES completion:nil];
 });
}

RCT_EXPORT_METHOD(scanVin:(RCTResponseSenderBlock)callback){
  
  dispatch_async(dispatch_get_main_queue(), ^{
    
    VinCameraViewController *Vin=[[VinCameraViewController alloc]init];
    
    Vin.scaneResult=^(NSString*successInfo,NSString*errorInfo){
      
    callback(@[ @{@"suc":successInfo,@"fail":errorInfo}]);
      
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
      callback(@[ @{@"suc":successInfo,@"fail":error}]);
    };
    [app.window.rootViewController presentViewController:[[UINavigationController alloc]initWithRootViewController:obd] animated:YES completion:nil];
  
  });
}
RCT_EXPORT_METHOD(scanID:(RCTResponseSenderBlock)callback){
  dispatch_async(dispatch_get_main_queue(), ^{
  IDCardCameraViewController *cameraView = [[IDCardCameraViewController alloc]init];
  cameraView.nsUserID = @"4D39F52BD46AC7CD8470";//授权码
  cameraView.resultblock=^(NSString*successInfo ,NSString*error){
    
    callback(@[ @{@"suc":successInfo,@"fail":error}]);
  };
  AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  
 [app.window.rootViewController presentViewController:cameraView animated:YES completion:nil];
    
  });
}




@end
