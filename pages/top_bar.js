<<<<<<< HEAD
import React from 'react';
import {TextInput, Button, View, Alert, ScrollView, Text} from 'react-native';

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

    <Button
      title="Advanced Search"
      onPress={Alert.alert('You tapped the button!')}
      style={{borderColor: 'black', backgroundColor: 'orange'}}
    />
  </View>
);
export default TopBar;
=======
import React from 'react';
import {TextInput, Button, View, Alert, ScrollView, Text} from 'react-native';

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

    <Button
      title="Advanced Search"
      onPress={Alert.alert('You tapped the button!')}
      style={{borderColor: 'black', backgroundColor: 'orange'}}
    />
  </View>
);
export default TopBar;
>>>>>>> 73cfd49452f2428a93ccdfb17ae61efccde1a3fd
