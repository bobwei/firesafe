//
//  RCTBridgeModule+OtherDevice.m
//  firesafe
//
//  Created by Bob Wei on 2015/8/22.
//  Copyright © 2015年 Facebook. All rights reserved.
//

#import "OtherDevice.h"

static NSString * const OtherDeviceStatus = @"OtherDeviceStatus";

@implementation OtherDevice

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initDevice)
{
  [self.bridge.eventDispatcher sendAppEventWithName:OtherDeviceStatus
                                               body:@{@"status": @"disconnected"}];

  [[NSNotificationCenter defaultCenter] addObserverForName:@"receivedOtherDeviceData" object:nil queue:nil usingBlock:^(NSNotification * __nonnull note) {
    NSLog(@"received %@", note.object);
    NSDictionary *obj = (NSDictionary *)note.object;
    [self.bridge.eventDispatcher sendAppEventWithName:OtherDeviceStatus
                                                 body:@{@"status": @"connected"}];
    [self.bridge.eventDispatcher sendAppEventWithName:OtherDeviceStatus
                                                 body:@{@"status": @"receivedData",
                                                        @"data": obj}];
  }];
  
//  [self.bridge.eventDispatcher sendAppEventWithName:OtherDeviceStatus
//                                               body:@{@"status": @"connected"}];


//  [self.bridge.eventDispatcher sendAppEventWithName:OtherDeviceStatus
//                                               body:@{@"status": @"receivedData",
//                                                      @"data": @""}];
}

@end


