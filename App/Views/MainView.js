'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;
var Constants = require('../Constants');
var UserListView = require('./UserListView');
var MPC = require('react-native').NativeModules.MPC;


var MainView = React.createClass({
  getInitialState: () => {
    return {
      deviceName: 'Device'
    };
  },
  onClickHandler: () => {

  },
  componentDidMount: function() {
    MPC.getDeviceName((deviceName) => {
      this.setState({
        deviceName: deviceName
      });
    });
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.deviceStatusWrapper}>
          <Text style={styles.name}>{this.state.deviceName}</Text>
          <Text style={styles.deviceStatus}>尚未連結生理數據裝置</Text>
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
