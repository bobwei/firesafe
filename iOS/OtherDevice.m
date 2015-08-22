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


  
  // Create server
  _webServer = [[GCDWebServer alloc] init];
  
  // Add a handler to respond to GET requests on any URL
  [_webServer addDefaultHandlerForMethod:@"GET"
                            requestClass:[GCDWebServerRequest class]
                            processBlock:^GCDWebServerResponse *(GCDWebServerRequest* request) {
                              
                              return [GCDWebServerDataResponse responseWithHTML:@"<html><body><p>Hello World</p></body></html>"];
                              
                            }];
  
  // Start server on port 8080
  [_webServer startWithPort:8080 bonjourName:nil];
  NSLog(@"Visit %@ in your web browser", _webServer.serverURL);

  
//  [self.bridge.eventDispatcher sendAppEventWithName:OtherDeviceStatus
//                                               body:@{@"status": @"connected"}];


//  [self.bridge.eventDispatcher sendAppEventWithName:OtherDeviceStatus
//                                               body:@{@"status": @"receivedData",
//                                                      @"data": @""}];
}

@end


