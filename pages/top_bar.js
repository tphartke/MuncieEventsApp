import React from 'react';
import {TextInput, View, ScrollView, Text, Button} from 'react-native';

const TopBar = () => (
    <View style={{height: 50, flexDirection: 'row', backgroundColor: '#aaa'}}>
    <ScrollView style={{flex: 3}}>  
      <Text>Home</Text>
      <Text>Go To Date...</Text>
      <Text>Add Event</Text>
      <Text>Widgets</Text>
      <Text>Log In/Register</Text>
      <Text>Contact</Text>
      <Text>About</Text>
    </ScrollView>
    <TextInput 
        placeholder='Search'
        style={{borderColor: 'black', borderWidth: 1, flex: 5, backgroundColor: '#fff'}}
    />
  </View>
);
export default TopBar;