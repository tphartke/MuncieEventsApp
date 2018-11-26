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
      <View style={{height: 50, flexDirection: 'row'}}>
        <Button style={{flex: 1}}
          title="Menu"
          onPress={() =>
          this.openMenuDrawer()
          }
        />
        <TextInput
          placeholder='Search'
          style={{borderColor: 'black', borderWidth: 1, width: 320, backgroundColor: '#fff'}}
          onBlur={(text) => {this.setState({text}); this.searchOnArbitraryString(this.state.text);}}
          showLoading='true'
        />
      </View>
    </View>
  );
  } 

  openMenuDrawer(){
    this.props.navigation.navigate('DrawerOpen');
  }
}
