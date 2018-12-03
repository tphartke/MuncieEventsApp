import React from 'react';
import {Text, View, Button} from 'react-native';
import TopBar from './top_bar';

export default class ExpandedEventView extends React.Component {
    render() {
      return (
        <View style={{paddingTop:20}}>
          <TopBar />
          <View style={{paddingTop:30}}>
            <Text> Expanded View </Text>
          </View>
        </View>
      )
    }
}