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
static NSString * const AppStatus = @"AppStatus";

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initConnection)
{
  displayName = [[UIDevice currentDevice] name];
  localPeerID = [[MCPeerID alloc] initWithDisplayName:displayName];
}

#pragma mark - Public

RCT_EXPORT_METHOD(connect)
{
  [self.bridge.eventDispatcher sendAppEventWithName:AppStatus
                                               body:@{@"status": @"connecting"}];
  
  session = [[MCSession alloc] initWithPeer:localPeerID securityIdentity:nil encryptionPreference:MCEncryptionNone];
  session.delegate = self;

  advertiser = [[MCNearbyServiceAdvertiser alloc] initWithPeer:localPeerID discoveryInfo:nil serviceType:XXServiceType];
  advertiser.delegate = self;
  [advertiser startAdvertisingPeer];

  browser = [[MCNearbyServiceBrowser alloc] initWithPeer:localPeerID serviceType:XXServiceType];
  browser.delegate = self;
  [browser startBrowsingForPeers];
}

RCT_EXPORT_METHOD(disconnect)
{
  [self.bridge.eventDispatcher sendAppEventWithName:AppStatus
                                               body:@{@"status": @"disconnected"}];
  
  [advertiser stopAdvertisingPeer];
  advertiser.delegate = nil;
  advertiser = nil;
  
  [browser stopBrowsingForPeers];
  browser.delegate = nil;
  browser = nil;
  
  [session disconnect];
  session.delegate = nil;
  session = nil;
}

RCT_EXPORT_METHOD(getDeviceName:(RCTResponseSenderBlock)callback)
{
  callback(@[[[UIDevice currentDevice] name]]);
}

#pragma mark - Private

RCT_EXPORT_METHOD(logPeers)
{
  NSArray *peers = session.connectedPeers;
  NSMutableArray *displayNames = [[NSMutableArray alloc] init];
  for (MCPeerID *peer in peers) {
    NSLog(@"peer %@", peer);
    [displayNames addObject:peer.displayName];
  }
  [self.bridge.eventDispatcher sendAppEventWithName:AppStatus
                                               body:@{@"status": @"logPeers",
                                                      @"data": displayNames}];
}

#pragma mark - MCSessionDelegate

- (void)session:(MCSession *)session didReceiveData:(NSData *)data fromPeer:(MCPeerID *)peerID
{
}

- (void)session:(MCSession *)session didReceiveStream:(NSInputStream *)stream withName:(NSString *)streamName fromPeer:(MCPeerID *)peerID
{
}

- (void)session:(MCSession *)session didFinishReceivingResourceWithName:(NSString *)resourceName fromPeer:(MCPeerID *)peerID atURL:(NSURL *)localURL withError:(NSError *)error
{
}

- (void)session:(MCSession *)session didStartReceivingResourceWithName:(NSString *)resourceName fromPeer:(MCPeerID *)peerID withProgress:(NSProgress *)progress
{
}

- (void)session:(MCSession *)session peer:(MCPeerID *)peerID didChangeState:(MCSessionState)state
{
  NSString *stateMessage;
  NSString *message;
  if (state == MCSessionStateConnecting) {
    message = [NSString stringWithFormat:@"%@ received MCSessionStateConnecting for %@", localPeerID.displayName, peerID.displayName];
    stateMessage = @"MCSessionStateConnecting";
  }
  else if (state == MCSessionStateConnected) {
    message = [NSString stringWithFormat:@"%@ received MCSessionStateConnected for %@", localPeerID.displayName, peerID.displayName];
    stateMessage = @"MCSessionStateConnected";
  } else if (state == MCSessionStateNotConnected) {
    message = [NSString stringWithFormat:@"%@ received MCSessionStateNotConnected for %@", localPeerID.displayName, peerID.displayName];
    stateMessage = @"MCSessionStateNotConnected";
  }
  NSLog(@"%@", message);
  [self.bridge.eventDispatcher sendAppEventWithName:AppStatus
                                               body:@{@"status": stateMessage}];
  [self logPeers];
}

#pragma mark - MCNearbyServiceAdvertiserDelegate

- (void)advertiser:(MCNearbyServiceAdvertiser *)advertiser didNotStartAdvertisingPeer:(NSError *)error
{
  NSString *message;
  message = [NSString stringWithFormat:@"Advertiser %@ did not start advertising with error: %@", localPeerID.displayName, error.localizedDescription];
  [self.bridge.eventDispatcher sendAppEventWithName:AppStatus
                                               body:@{@"status": message}];
}

- (void)advertiser:(MCNearbyServiceAdvertiser *)advertiser didReceiveInvitationFromPeer:(MCPeerID *)peerID withContext:(NSData *)context invitationHandler:(void (^)(BOOL, MCSession *))invitationHandler
{
  NSString *message;
  message = [NSString stringWithFormat:@"Advertiser %@ received an invitation from %@", localPeerID.displayName, peerID.displayName];
  [self.bridge.eventDispatcher sendAppEventWithName:AppStatus
                                               body:@{@"status": message}];
  invitationHandler(YES, session);
  message = [NSString stringWithFormat:@"Advertiser %@ accepted invitation from %@", localPeerID.displayName, peerID.displayName];
  [self.bridge.eventDispatcher sendAppEventWithName:AppStatus
                                               body:@{@"status": message}];
}

#pragma mark - MCNearbyServiceBrowserDelegate

- (void)browser:(MCNearbyServiceBrowser *)browser didNotStartBrowsingForPeers:(NSError *)error
{
  NSString *message;
  message = [NSString stringWithFormat:@"Browser %@ did not start browsing with error: %@", localPeerID.displayName, error.localizedDescription];
  [self.bridge.eventDispatcher sendAppEventWithName:AppStatus
                                               body:@{@"status": message}];
}

- (void)browser:(MCNearbyServiceBrowser *)nearbyBrowser foundPeer:(MCPeerID *)peerID withDiscoveryInfo:(NSDictionary *)info
{
  [self.bridge.eventDispatcher sendAppEventWithName:AppStatus
                                               body:@{@"status": @"foundPeers",
                                                      @"data": @{@"displayName": peerID.displayName}}];
  
  // Should I invite the peer or should the peer invite me? Let the decision be based on the comparison of the hash values of the peerId.
  BOOL shouldInvite = localPeerID.hash < peerID.hash;
  if (shouldInvite) {
    // I will invite the peer, the remote peer will NOT invite me.
    NSLog(@"Browser %@ invites %@ to connect", localPeerID.displayName, peerID.displayName);
    [browser invitePeer:peerID toSession:session withContext:nil timeout:10];
  } else {
    // I will NOT invite the peer, the remote peer will invite me.
    NSLog(@"Browser %@ does not invite %@ to connect", localPeerID.displayName, peerID.displayName);
  }
}

- (void)browser:(MCNearbyServiceBrowser *)browser lostPeer:(MCPeerID *)peerID
{
  NSString *message;
  message = [NSString stringWithFormat:@"Browser %@ lost %@", localPeerID.displayName, peerID.displayName];
  NSLog(@"%@", message);
  [self logPeers];
}

@end
