import React from 'react';
import {TextInput, View, Button} from 'react-native';
import{ withNavigation } from "react-navigation";
import CustomButton from "./CustomButton";
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }

  searchOnArbitraryString(input){
      console.log("top_bar: " + input)
      return this.props.navigation.navigate('SearchOutput', {
        searchInput: input,
      });
  }

  render() {
  return(
    <View style={{height: 65, backgroundColor: '#aaa', paddingTop: 10, paddingHorizontal: 10, flexDirection: 'row'}}>
    <Animatable.View animation = "slideInRight" duration={500} style={{height: 45, flex: 1, flexDirection: 'row',  paddingHorizontal: 5, paddingLeft: 5, justifyContent: 'center',
     borderColor: 'black', borderRadius: 10, borderWidth: 1, width: 320, backgroundColor: '#fff', alignItems: 'center'}}>
      <CustomButton
        style={{width:50, height:50}}
        text="Menu"
        onPress={() =>
          this.props.navigation.openDrawer()
        }
      />
    <TextInput
      placeholder=' Search'
      value={this.state.text} 
      style = {{flex:1, width: 50}}
      onChangeText={(text) => this.setState({text})}
      onBlur={() => this.searchOnArbitraryString(this.state.text)}
      showLoading='true'
    />
     <Icon name = "ios-search" style = {{fontSize: 24}}/>
      
    </Animatable.View>
    </View>
  );
  } 

  openMenuDrawer(){
    this.props.navigation.navigate('DrawerOpen');
  }
}
export default withNavigation(TopBar);