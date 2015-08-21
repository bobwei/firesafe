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

var MainView = React.createClass({
  getInitialState: () => {
    return {};
  },
  onClickHandler: () => {

  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonWrapper}>
          <TouchableHighlight
            style={styles.button}
            underlayColor={Constants.buttonRed}
            onPress={this.onClickHandler}>
              <Text style={styles.buttonText}>
                更新我的血氧濃度
              </Text>
          </TouchableHighlight>
        </View>
        <UserListView/>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  'container': {
    flex: 1,
    paddingTop: 64 + 30,
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  'button': {
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
