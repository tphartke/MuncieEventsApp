import React from 'react';
import {Text, View, Button} from 'react-native';
import TopBar from './top_bar';

export default class Widgets extends React.Component {
    render() {
      return (
        <View style={{paddingTop:20}}>
          <TopBar />
          <View style={{paddingTop:30}}>
            <Text> Widgets </Text>
          </View>
        </View>
      )
    }
}