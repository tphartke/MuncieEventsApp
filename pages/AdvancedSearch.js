import React from 'react';
import {Text, View} from 'react-native';
import TopBar from './top_bar';

export default class AdvancedSearch extends React.Component {
    render() {
      return (
        <View>
            <TopBar />
            <Text> AdvancedSearch </Text>
        </View>
      )
    }
}