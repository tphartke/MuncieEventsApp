import React from 'react';
import {TextInput, View, Text} from 'react-native';
import {withNavigation} from "react-navigation";
import CustomButton from "./CustomButton";
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import Styles from './Styles';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={text: null};
    this.state={readyToSearch: false}
  }

  searchOnArbitraryString(){
    return this.props.navigation.navigate('SearchOutput', {
      searchInput: this.state.text,
    });
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
        <Animatable.View animation = "slideInRight" duration={500} style={[Styles.topBarContent, {flex:1}]}>
          <TextInput
            placeholder=' Search'
            value={this.state.text} 
            style={Styles.searchBar}
            onChangeText={(text) => this.setState({text})}
            showLoading='true'
          />
          <Icon name="ios-search" style={Styles.iosSearch} size={34}
            onPress={() => this.startSearch()}  
          />
        </Animatable.View>
      </View>
    );
  } 

  startSearch(){
    userInput = this.state.text
    if(userInput){
      beginningSearcURL = 'https://api.muncieevents.com/v1/events/search?q='
      endingSearcURL = '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'
      fullSearchURL = beginningSearcURL + userInput +  endingSearcURL
      this.props.navigation.navigate("Search Results Passer", {searchURL: fullSearchURL});
    }
  }

  /*
  This is the old topbar code. Saved in case the new code breaks.
        <View style={Styles.topBarWrapper}>
        <Animatable.View animation = "slideInRight" duration={500} style={Styles.topBarContent}>
          <CustomButton
            text="Menu"
            onPress={() =>
              this.props.navigation.openDrawer()
            }
          />
          <TextInput
            ref={TextInput => {this.searchInput = TextInput}}
            placeholder=' Search'
            value={this.state.text} 
            style={Styles.searchBar}
            onChangeText={(text) => this.setState({text})}
            onBlur={() => this.setState({readyToSearch: true})}
            showLoading='true'
          />
          <Icon name="ios-search" style={Styles.iosSearch}/>
        </Animatable.View>
      </View>
  */

}
export default withNavigation(TopBar);