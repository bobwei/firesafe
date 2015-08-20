'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React;
var Constants = require('../Constants');

var MainView = React.createClass({
  onClickHandler: () => {
    console.log('onClickHandler');
  },
  render: function() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.button}
          underlayColor={Constants.buttonRed}
          onPress={this.onClickHandler}>
            <Text style={styles.buttonText}>
              更新我的血氧濃度
            </Text>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  'container': {
    flex: 1,
    alignItems: 'center',
    paddingTop: 64 + 30,
  },
  'button': {
    height: 44,
    width: 290,
    color: Constants.buttonTextColorWhite,
    backgroundColor: Constants.buttonRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  buttonText: {
    color: Constants.buttonTextColorWhite,
    fontSize: 17,
    textAlign: 'center',
    margin: 20
  }
});

module.exports = MainView;
