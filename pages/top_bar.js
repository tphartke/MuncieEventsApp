import React from 'react';
import {TextInput, View, ScrollView, Text, Button} from 'react-native';

export default class TopBar extends React.Component{
  render(){
    return(
    <View style={{height: 50, flexDirection: 'row', backgroundColor: '#aaa'}}>
    <TextInput 
        placeholder='Search'
        style={{borderColor: 'black', borderWidth: 1, width: 150, backgroundColor: '#fff'}}
    />
  </View>
    );
  }
}
