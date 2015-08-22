'use strict';

var assign = require('object-assign');
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
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
      var hasChanged = Object
        .keys(r2)
        .some(function(key){
          return r1[key] !== r2[key];
        });
      return hasChanged;
    }});
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
          appStatus.data.forEach((peer) => {
            if (this.otherDeviceDataCache && this.otherDeviceDataCache[peer.id]){
              peer.otherDeviceData = this.otherDeviceDataCache[peer.id];
            }
          });
          this.setState({
            dataSource: this.state.dataSource
              .cloneWithRows(
                appStatus.data
              )
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
        }else if (appStatus.status === 'didReceiveData'){
          var dataBlob = this.state.dataSource._dataBlob;
          var rows = this._dataBlobToRows(dataBlob);
          var row = rows.filter(function(theRow){
            return theRow.id === appStatus.data.peerID;
          })[0];
          if (row){
            row.otherDeviceData = {
              k1: appStatus.data.k1,
              k2: appStatus.data.k2
            };
            if (!this.otherDeviceDataCache){
              this.otherDeviceDataCache = {};
            }
            this.otherDeviceDataCache[appStatus.data.peerID] = row.otherDeviceData;
          }
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(rows)
          });
        }
        console.log(appStatus);
        setTimeout(() => {
          this.setState({
            appStatus: ''
          });
        }, 8000);
      }
    );
  },
  componentWillUnmount: function(){
    this.subscription.remove();
  },
  _dataBlobToRows: function(dataBlob){
    var rows = Object
      .keys(dataBlob)
      .reduce(function(s, key){
        return s.concat(dataBlob[key]);
      }, [])
      .map(function(row){
        return assign({}, row);
      });
    return rows;
  },
  getStatusWords: function(otherDeviceData){
    if (otherDeviceData){
      if (otherDeviceData.k1 >= 97){
        return '正常';
      }else if (otherDeviceData.k1 >= 90){
        return '異常';
      }else{
        return '危險';
      }
    }
  },
  getStatusColor: function(otherDeviceData){
    if (otherDeviceData){
      if (otherDeviceData.k1 >= 97){
        return Constants.buttonGreen;
      }else if (otherDeviceData.k1 >= 90){
        return Constants.buttonYellow;
      }else{
        return Constants.buttonRed;
      }
    }
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.appStatusWrapper}>
          <Text style={styles.userListCount}>
            其他 {this.state.dataSource.getRowCount()} 位成員
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
                    {rowData.displayName}
                  </Text>
                  <Text style={styles.status}>
                    生理狀態 : {this.getStatusWords(rowData.otherDeviceData)}
                  </Text>
                </View>
                <View style={styles.otherDeviceDataWrapper}>
                  <Text style={styles.otherDeviceDataText}>
                    {(() => {
                      if (rowData.otherDeviceData){
                        return rowData.otherDeviceData.k1 + ' %';
                      }
                    })()}
                  </Text>
                  <View style={[styles.statusIndicator, {backgroundColor: this.getStatusColor(rowData.otherDeviceData)}]}></View>
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
    alignItems: 'center',
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
  otherDeviceDataWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherDeviceDataText: {
    fontSize: 20,
    marginRight: 10,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: Constants.buttonRed
  },
});

module.exports = UserListView;
