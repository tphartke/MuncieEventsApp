import React from 'react';
import {TextInput, View, Button} from 'react-native';

export default class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  searchOnArbitraryString(input){
      return this.props.navigation.navigate('SearchOutput', {
        searchInput: input,
      });
  }

  render() {
  return(
    <View style={{height: 50, flexDirection: 'row', backgroundColor: '#aaa', paddingTop:20}}>
        <TextInput
          placeholder='Search'
          showLoading='true'
          style= {{borderColor: 'black', borderWidth: 1, width: 320, backgroundColor: '#fff'}}
        />
    </View>
  );
  } 

  openMenuDrawer(){
    this.props.navigation.navigate('DrawerOpen');
  }
}
