//
//  SIDCard.h
//  SIDCard
//
//  Created by etop on 15/12/22.
//  Copyright (c) 2015年 etop. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface SIDCard : NSObject

//二代证正面识别结果
@property(copy, nonatomic) NSString *nsName; //名字
@property(copy, nonatomic) NSString *nsSex;  //性别
@property(copy, nonatomic) NSString *nsNation; //民族
@property(copy, nonatomic) NSString *nsBirth;  //出生日期
@property(copy, nonatomic) NSString *nsAddress; //地址
@property(copy, nonatomic) NSString *nsIDNum;  //身份证号

//二代证背面识别结果
@property(copy, nonatomic) NSString *nsIssuingAuthority; //签发机关
@property(copy, nonatomic) NSString *nsExpDate;  //有效期限

@property(copy, nonatomic) UIImage *imageHead; //头像
@property(copy, nonatomic) UIImage *imageCard; //全图(裁切后)

//初始化核心
-(int)initSIDCard:(NSString *)nsUserID nsReserve:(NSString *) nsReserve;
//设置证件识别类型(0-自动、1-正面、2-背面)
-(int) setRecognizeType:(int)nType;
//预览识别
-(int) recognizeSIDCard:(UInt8 *)buffer Width:(int)width Height:(int)height;
//拍照识别
-(int) recognizeSIDCardPhoto:(UIImage *)image;
//获取证件类型（1-正面、2-背面）
-(int) getRecognizeType;
//获取证件方向（0-0度 1-180度）
-(int) getIDCardDirection;
//释放核心
- (void) freeSIDCard;
@end
