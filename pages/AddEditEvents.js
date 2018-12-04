import React from 'react';
import {Text, View, Button} from 'react-native';
import TopBar from './top_bar';

export default class AddEditEvent extends React.Component {
    render() {
      return (
        <View style={{paddingTop:20}}>
            <View>
                <TopBar />
                </View>
                <View style={{paddingTop:30}}>
            <Text> AddEditEvents </Text>
            </View>
        </View>
      )
    }
}