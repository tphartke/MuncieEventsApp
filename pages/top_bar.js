import React from 'react';
import {TextInput, View, Button} from 'react-native';
import{ withNavigation } from "react-navigation";

class TopBar extends React.Component {
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
    <View style={{height: 60, flexDirection: 'row', backgroundColor: '#aaa', paddingTop:20}}>
      <Button style={{flex: 1}}
        title="Menu"
        onPress={() =>
          this.props.navigation.openDrawer()
        }
      />
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
  export default withNavigation(TopBar);
