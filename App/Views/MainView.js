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
  onClickHandler: () => {
    MPC.sendData({
      k1: _.random(92, 99),
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
        if (otherDeviceStatus === 'disconnected'){
          this.setState({
            otherDeviceStatus: '尚未連接生理數據裝置'
          });
        }else if (otherDeviceStatus === 'connected'){
          this.setState({
            otherDeviceStatus: '已連接生理數據裝置'
          });
        }
        console.log(otherDeviceStatus);
      }
    );
    this.timer = setInterval(() => {
      this.onClickHandler();
    }, 5000);
  },
  componentWillUnmount: function(){
    clearInterval(this.timer);
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.deviceStatusWrapper}>
          <Text style={styles.name}>{this.state.deviceName}</Text>
          <Text style={styles.deviceStatus}>{this.state.otherDeviceStatus}</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Constants.buttonRed}
            onPress={this.onClickHandler}>
              <Text style={styles.buttonText}>
                手動更新我的生理數據
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
    paddingRight: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceStatus: {
    color: Constants.textGray,
    fontSize: 12,
  },
  name: {
    fontSize: 17,
    color: Constants.textBlack,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  button: {
    height: 44,
    width: 290,
    backgroundColor: Constants.buttonRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  buttonText: {
    color: Constants.buttonTextColorWhite,
    fontSize: 17,
  }
});

module.exports = MainView;
