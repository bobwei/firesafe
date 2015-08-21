//
//  RCTBridgeModule+MPC.m
//  firesafe
//
//  Created by Bob Wei on 2015/8/21.
//  Copyright © 2015年 Facebook. All rights reserved.
//

#import "MPC.h"

@implementation MPC

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(hello:(NSString *)name)
{
  NSLog(@"log %@", name);
}

@end
