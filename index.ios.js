'use strict';

var React = require('react-native');
var {
  AppRegistry,
  NavigatorIOS,
  StatusBarIOS,
  StyleSheet,
  Text,
  View,
} = React;
var MainView = require('./App/Views/MainView');

var firesafe = React.createClass({
  render: function() {
    StatusBarIOS.setStyle('light-content');

    return (
      <NavigatorIOS
        style={styles.navigator}
        initialRoute={{
          component: MainView,
          title: 'Firesafe'
        }}
        tintColor="#FFFFFF"
        barTintColor="#24CA99"
        titleTextColor="#FFFFFF"
        translucent="true"
      />
    );
  }
});

var styles = StyleSheet.create({
  navigator: {
    flex: 1,
  }
});

AppRegistry.registerComponent('firesafe', () => firesafe);
