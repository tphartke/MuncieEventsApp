import React from 'react';
import {TextInput, View, Text} from 'react-native';
import {withNavigation} from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons'
import Styles from './Styles';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={text: null};
    this.state={readyToSearch: false}
  }

  openDrawer = () =>{
    this.props.navigation.toggleDrawer()
  }

  render() {
    return(
      <View style={{flexDirection:"column", flex:1}}>
        <View style={{flexDirection:"row", flex:1, alignItems:"center"}}>
          <Icon name="ios-menu" size={34} style={{flex:.1, paddingLeft:5}}
            onPress={() => this.openDrawer()}
          />
          <Text style={[Styles.title, {flex:.8}]}>
            MUNCIE EVENTS
          </Text>
        </View>
        {/*Padding to keep the title centered*/}
        <View style={{flex:.1}}/>
        <View style={[Styles.topBarContent, {flex:1}]}>
          <TextInput
            placeholder=' Search Muncie Events'
            value={this.state.text} 
            style={Styles.searchBar}
            onChangeText={(text) => this.setState({text})}
            showLoading='true'
          />
          <Icon name="ios-search" style={Styles.iosSearch} size={34}
            onPress={() => this.startSearch()}  
          />
        </View>
      </View>
    );
  } 

  startSearch(){
    userInput = this.state.text
    if(userInput){
      this.props.navigation.navigate("Search Results Passer", {searchInput: userInput});
    }
  }
}
export default withNavigation(TopBar);