'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
} = React;
var Constants = require('../Constants');
var MPC = require('react-native').NativeModules.MPC;

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
  componentDidMount: function(){
    MPC.initConnection();
    MPC.connect();
  },
  getStatusWords: function(status){
    if (status === 'normal'){
      return '正常';
    }else if (status === 'warning'){
      return '異常';
    }else if (status === 'dangerous'){
      return '危險';
    }
  },
  getStatusColor: function(status){
    if (status === 'normal'){
      return Constants.buttonGreen;
    }else if (status === 'warning'){
      return Constants.buttonYellow;
    }else if (status === 'dangerous'){
      return Constants.buttonRed;
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
                <View>
                  <Text style={styles.name}>
                    {rowData.name}
                  </Text>
                  <Text style={styles.status}>
                    血氧濃度 : {this.getStatusWords(rowData.status)}
                  </Text>
                </View>
                <View>
                  <View style={[styles.statusIndicator, {backgroundColor: this.getStatusColor(rowData.status)}]}></View>
                </View>
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
  container: {
    flex: 1
  },
  userListCount: {
    fontSize: 15,
    color: '#4A4A4A',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginTop: 30,
  },
  cellStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  name: {
    fontSize: 18,
    marginBottom: 4
  },
  status: {
    fontSize: 14,
    color: '#9B9B9B',
  },
  separatorStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 10,
    marginRight: 10
  },
  separatorStyleHide: {
    opacity: 0
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 100,
    marginTop: 20,
    backgroundColor: Constants.buttonRed
  },
});

module.exports = UserListView;
