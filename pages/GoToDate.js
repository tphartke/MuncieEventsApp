import React from 'react';
import {Text, View, Button} from 'react-native';
import TopBar from './top_bar';

export default class GoToDate extends React.Component {
    render() {
      return (
        <View style={{paddingTop:20}}>
            <View style={{height: 50, flexDirection: 'row'}}>
            <Button style={{flex: 1, backgroundColor: 'ffa500'}}
                title="Menu"
                onPress={() =>
                this.props.navigation.openDrawer()
                }
              >
              </Button>
              <TopBar />
              </View>
                <View style={{paddingTop:30}}>
                  <Text> Go To Date... </Text>
                </View>
        </View>
      )
    }
}