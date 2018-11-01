import React from 'react';
import {TextInput, View} from 'react-native';


export default class TopBar extends React.Component {
  render() {
  return(
    <View style={{height: 50, flexDirection: 'row', backgroundColor: '#aaa', paddingTop:20}}>
      <View style={{height: 50, flexDirection: 'row'}}>
        <TextInput 
          placeholder='Search'
          style={{borderColor: 'black', borderWidth: 1, width: 320, backgroundColor: '#fff'}}
        />
      </View>
    </View>
  );
  }
}
