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

RCT_EXPORT_METHOD(initConnection)
{
  displayName = [[UIDevice currentDevice] name];
  localPeerID = [[MCPeerID alloc] initWithDisplayName:displayName];
}

#pragma mark - Public

RCT_EXPORT_METHOD(connect)
{
  NSLog(@"Peer %@ is connecting", displayName);

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
  NSLog(@"Peer %@ is disonnecting", displayName);
  
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
    [displayNames addObject:peer.displayName];
  }
  NSLog(@"%@ peers: %@", localPeerID.displayName, displayNames);
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
  if (state == MCSessionStateConnecting) {
    NSLog(@"%@ received MCSessionStateConnecting for %@", localPeerID.displayName, peerID.displayName);
  }
  else if (state == MCSessionStateConnected) {
    NSLog(@"%@ received MCSessionStateConnected for %@", localPeerID.displayName, peerID.displayName);
  } else if (state == MCSessionStateNotConnected) {
    NSLog(@"%@ received MCSessionStateNotConnected for %@", localPeerID.displayName, peerID.displayName);
  }
  [self logPeers];
}

#pragma mark - MCNearbyServiceAdvertiserDelegate

- (void)advertiser:(MCNearbyServiceAdvertiser *)advertiser didNotStartAdvertisingPeer:(NSError *)error
{
  NSLog(@"Advertiser %@ did not start advertising with error: %@", localPeerID.displayName, error.localizedDescription);
}

- (void)advertiser:(MCNearbyServiceAdvertiser *)advertiser didReceiveInvitationFromPeer:(MCPeerID *)peerID withContext:(NSData *)context invitationHandler:(void (^)(BOOL, MCSession *))invitationHandler
{
  NSLog(@"Advertiser %@ received an invitation from %@", localPeerID.displayName, peerID.displayName);
  invitationHandler(YES, session);
  NSLog(@"Advertiser %@ accepted invitation from %@", localPeerID.displayName, peerID.displayName);
}

#pragma mark - MCNearbyServiceBrowserDelegate

- (void)browser:(MCNearbyServiceBrowser *)browser didNotStartBrowsingForPeers:(NSError *)error
{
  NSLog(@"Browser %@ did not start browsing with error: %@", localPeerID.displayName, error.localizedDescription);
}

- (void)browser:(MCNearbyServiceBrowser *)nearbyBrowser foundPeer:(MCPeerID *)peerID withDiscoveryInfo:(NSDictionary *)info
{
  NSLog(@"Browser %@ found %@", localPeerID.displayName, peerID.displayName);
  
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
  NSLog(@"Browser %@ lost %@", localPeerID.displayName, peerID.displayName);
  [self logPeers];
}

@end
