import React from 'react';
import {TextInput, Button, View, ScrollView, Text} from 'react-native';
import AppNavigator from '../navigation/AppNavigator';

const TopBar = () => (
    <View style={{flex: 1, flexDirection: 'row'}}>
    <ScrollView>  
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
        style={{borderColor: 'black', borderWidth: 1}}
    />
  </View>
);
export default TopBar;
