//
//  RCTBridgeModule+MPC.m
//  firesafe
//
//  Created by Bob Wei on 2015/8/21.
//  Copyright © 2015年 Facebook. All rights reserved.
//

#import "MPC.h"

@implementation MPC

@class MCPeerID;
static NSString * const XXServiceType = @"hello-service";

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(
  init:(NSString *)name
  withInitCallback:(RCTResponseSenderBlock)initCallback
)
{
  displayName = name;
  localPeerID = [[MCPeerID alloc] initWithDisplayName:[[UIDevice currentDevice] name]];
  initCallback(@[@{@"peerId": @"1"}]);
//  MCNearbyServiceBrowser *browser = [[MCNearbyServiceBrowser alloc] initWithPeer:localPeerID serviceType:XXServiceType];
//  browser.delegate = self;
//  [browser startBrowsingForPeers];
}

@end
