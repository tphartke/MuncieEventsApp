import React from 'react';
import {Text, View} from 'react-native';
import TopBar from './top_bar';


export default class Contact extends React.Component {
    render() {
      return (
        <View>
          <View>
            <TopBar />
          </View>
          <View style={{flex:1, paddingTop:20}}>
          <Text>
            Contact
          </Text>
        </View>

        </View>

      )
    }
}