'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView,
  NativeAppEventEmitter,
} = React;
var Constants = require('../Constants');
var MPC = require('react-native').NativeModules.MPC;

var UserListView = React.createClass({
  getInitialState: () => {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      appStatus: '',
      dataSource: ds.cloneWithRows([]),
    };
  },
  componentDidMount: function(){
    MPC.initConnection();
    MPC.connect();
    this.subscription = NativeAppEventEmitter.addListener(
      'AppStatus',
      (appStatus) => {
        clearTimeout(this.clearEventTimer);
        if (appStatus.status === 'connecting'){
          this.setState({
            appStatus: '已開啟連線'
          });
        }else if (appStatus.status === 'logPeers'){
          this.setState({
            dataSource: this.state.dataSource
              .cloneWithRows(appStatus.data.map(function(peer, i){
                return {
                  name: peer,
                };
              }))
          });
        }else if (appStatus.status === 'foundPeers'){
          this.setState({
            appStatus: '發現' + appStatus.data.displayName,
          });
        }else if (appStatus.status === 'MCSessionStateConnecting'){
          this.setState({
            appStatus: '連線中...',
          });
        }else if (appStatus.status === 'MCSessionStateConnected'){
          this.setState({
            appStatus: '已連線',
          });
        }else if (appStatus.status === 'MCSessionStateNotConnected'){
          this.setState({
            appStatus: '未連線',
          });
        }
        console.log(appStatus);
        setTimeout(() => {
          this.setState({
            appStatus: ''
          });
        }, 10000);
      }
    );
  },
  componentWillUnmount: function(){
    this.subscription.remove();
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
        <View style={styles.appStatusWrapper}>
          <Text style={styles.userListCount}>
            {this.state.dataSource.getRowCount()} 位成員
          </Text>
          <Text style={styles.appStatus}>
            {this.state.appStatus}
          </Text>
        </View>
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
  appStatusWrapper: {
    paddingTop: 10,
    paddingRight: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userListCount: {
    fontSize: 17,
    color: Constants.textBlack,
  },
  appStatus: {
    fontSize: 12,
    color: Constants.textGray,
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
