import React from 'react';
import {Text, View} from 'react-native';
import TopBar from './top_bar';
import Styles from './Styles';

export default class Widgets extends React.Component {
    render() {
      return (
        <View style={Styles.topBarPadding}>
          <TopBar />
          <Text style={Styles.title}> Widgets </Text>
        </View>
      )
    }
}