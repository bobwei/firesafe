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
      }, {
        id: '3',
        name: 'Steve Jobs',
        status: 'dangerous'
      }]),
    };
  },
  getStateWords: function(status){
    if (status === 'normal'){
      return '正常';
    }else if (status === 'warning'){
      return '異常';
    }else if (status === 'dangerous'){
      return '危險';
    }
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.userListCount}>
          {this.state.dataSource.getRowCount()} 位成員
        </Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
            return (
              <View key={rowData.id} style={styles.cellStyle}>
                <Text style={styles.name}>
                  {rowData.name}
                </Text>
                <Text style={styles.status}>
                  血氧濃度 : {this.getStateWords(rowData.status)}
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
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  'container': {
    flex: 1
  },
  'userListCount': {
    fontSize: 15,
    color: '#4A4A4A',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginTop: 30,
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
