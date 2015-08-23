'use strict';

var React = require('react-native');
var _ = require('underscore');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeAppEventEmitter,
} = React;
var Constants = require('../Constants');
var UserListView = require('./UserListView');
var MPC = require('react-native').NativeModules.MPC;
var OtherDevice = require('react-native').NativeModules.OtherDevice;


var MainView = React.createClass({
  getInitialState: () => {
    return {
      deviceName: 'Device',
      otherDeviceStatus: '尚未連接生理數據裝置'
    };
  },
  onNormalClickHandler: () => {
    MPC.sendData({
      k1: _.random(97, 99),
      k2: 72
    });
  },
  onWarningClickHandler: () => {
    MPC.sendData({
      k1: _.random(90, 94),
      k2: 72
    });
  },
  onDangerClickHandler: () => {
    MPC.sendData({
      k1: _.random(84, 89),
      k2: 72
    });
  },
  componentDidMount: function() {
    MPC.getDeviceName((deviceName) => {
      this.setState({
        deviceName: deviceName
      });
    });
    OtherDevice.initDevice();
    this.subscription = NativeAppEventEmitter.addListener(
      'OtherDeviceStatus',
      (otherDeviceStatus) => {
        if (otherDeviceStatus.statue === 'disconnected'){
          this.setState({
            otherDeviceStatus: '尚未連接生理數據裝置'
          });
        }else if (otherDeviceStatus.statue === 'connected'){
          this.setState({
            otherDeviceStatus: '已連接生理數據裝置'
          });
        }else if (otherDeviceStatus.status === 'receivedData'){
          this.setState({
            otherDeviceStatus: '我的生理數據 : ' + otherDeviceStatus.data.k1
          });
          MPC.sendData(otherDeviceStatus.data);
        }
        console.log(otherDeviceStatus);
      }
    );
  },
  componentWillUnmount: function(){
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.deviceStatusWrapper}>
          <Text style={styles.name}>{this.state.deviceName}</Text>
          <Text style={styles.deviceStatus}>{this.state.otherDeviceStatus}</Text>
        </View>
        <Text style={styles.actionLabel}>手動設定生理狀態</Text>
        <View style={styles.buttonWrapper}>
          <TouchableHighlight
            style={[styles.button, {backgroundColor: Constants.buttonGreen}]}
            underlayColor={Constants.buttonGreen}
            onPress={this.onNormalClickHandler}>
              <Text style={styles.buttonText}>
                正常
              </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.button, {backgroundColor: Constants.buttonYellow}]}
            underlayColor={Constants.buttonYellow}
            onPress={this.onWarningClickHandler}>
              <Text style={styles.buttonText}>
                異常
              </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Constants.buttonRed}
            onPress={this.onDangerClickHandler}>
              <Text style={styles.buttonText}>
                危險
              </Text>
          </TouchableHighlight>
        </View>
        <UserListView/>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
  },
  deviceStatusWrapper: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceStatus: {
    color: Constants.textGray,
    fontSize: 12,
  },
  actionLabel: {
    color: Constants.textGray,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  name: {
    fontSize: 18,
    color: Constants.textBlack,
  },
  buttonWrapper: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
  },
  button: {
    height: 40,
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: Constants.buttonRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  buttonText: {
    color: Constants.buttonTextColorWhite,
    fontSize: 16,
  }
});

module.exports = MainView;
