//
//  RCTBridgeModule+MPC.h
//  firesafe
//
//  Created by Bob Wei on 2015/8/21.
//  Copyright © 2015年 Facebook. All rights reserved.
//
#import <MultipeerConnectivity/MultipeerConnectivity.h>
#import <UIKit/UIKit.h>
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTBridgeModule.h"

@interface MPC : NSObject <RCTBridgeModule, MCNearbyServiceAdvertiserDelegate>{
  NSString *displayName;
  RCTResponseSenderBlock callbackBlock;
  MCPeerID *localPeerID;
}

@end
