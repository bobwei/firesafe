'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
} = React;

var UserListView = React.createClass({
  getInitialState: () => {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([{
        id: '1',
        name: 'Bob Wei',
        status: 'normal'
      }, {
        id: '2',
        name: 'Mark Zuckerberg',
        status: 'warning'
      }]),
    };
  },
  render: function() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
            return (
              <View key={rowData.id} style={styles.cellStyle}>
                <Text style={styles.name}>
                  {rowData.name}
                </Text>
                <Text style={styles.status}>
                  血氧濃度 : {rowData.status}
                </Text>
              </View>
            );
          }}
          renderSeparator={(sectionId, rowId, adjacentRowHighlighted) => {
            var separatorStyle = [
              styles.separatorStyle,
              adjacentRowHighlighted && styles.rowSeparatorHide
            ];
            return (
              <View key={rowId} style={separatorStyle}/>
            );
          }}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  'container': {
    flex: 1
  },
  'cellStyle': {
    padding: 15,
  },
  'name': {
    fontSize: 18,
    marginBottom: 4
  },
  'status': {
    fontSize: 14,
    color: '#9B9B9B',
  },
  'separatorStyle': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 10,
    marginRight: 10
  },
  'separatorStyleHide': {
    opacity: 0
  }
});

module.exports = UserListView;
