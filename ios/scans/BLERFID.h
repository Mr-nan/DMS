//
//  Created by majinglei on 2017/3/14.
//  Copyright © 2017年 majinglei. All rights reserved.
//
#import <CoreBluetooth/CoreBluetooth.h>

typedef NS_ENUM(NSInteger, BLEConnState) {
    BLEConnStateSuc = 0,
    BLEConnStateFail,
    BLEConnStateDisconn,
    BLEConnStateNoService,
} NS_ENUM_AVAILABLE(NA, 10_0);

@protocol IParseRFID<NSObject>
/*!
    扫描到数据时，推送tid和epc区数据
 */
-(void)pushData:(char*)tid epc:(char*)epc;
/*!
    扫描外设时推送状态码,state取值：
    0:CBManagerStateUnknown
    1:CBCentralManagerStateResetting
    2:CBCentralManagerStateUnsupported 不支持蓝牙
    3:CBCentralManagerStateUnauthorized 无相关权限
    4:CBCentralManagerStatePoweredOff 蓝牙未开启
    5:CBCentralManagerStatePoweredOn 正常 蓝牙已开启
 */
-(void)mgrDidUpdateState:(CBManagerState)state;

/*!
    发现外设
    peripheral：外设
    advertisementData：外设携带数据
    RSSI：信号强度
 */
-(void)didDiscoverPeripheral:(CBPeripheral*)peripheral //外设
                        RSSI:(NSNumber *)RSSI;
/*!
    外设连接状态码推送：state取值：
    0:BLEConnStateSuc 成功
    1:BLEConnStateFail 连接失败
    2:BLEConnStateDisconn 断开连接
    3:BLEConnStateNoService 无服务
 */
-(void)connectPeripheralState:(BLEConnState) state;
@end

@interface BLERFID :NSObject

/*数据解析代理*/
@property(nonatomic,weak) id<IParseRFID> delegate;

-(id)initWithParseRFIDDelegate:(id<IParseRFID>)aDelegate;
/*
    搜索外设
 */
-(void)scanForPeripherals;
/*
 连接外设
 peripheral：外设实体
 */
-(void)connPeripheral:(CBPeripheral*)peripheral;
/*
 断开连接
 peripheral：外设实体
 */
-(void)disConn:(CBPeripheral*)peripheral;
/*
 发送指令(软按键),注：目前只能读取TID区数据
 */
-(void)sendCmd;
/**
 停止扫描
 */
-(void) stopScan;
@end
