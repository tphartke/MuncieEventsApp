import React from 'react';
import {TextInput, View} from 'react-native';
import{ withNavigation } from "react-navigation";
import CustomButton from "./CustomButton";
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import Styles from './Styles';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={text: ''};
  }

  searchOnArbitraryString(input){
      return this.props.navigation.navigate('SearchOutput', {
        searchInput: input,
      });
  }

  render() {
    return(
      <View style={Styles.topBarWrapper}>
        <Animatable.View animation = "slideInRight" duration={500} style={Styles.topBarContent}>
          <CustomButton
            text="Menu"
            onPress={() =>
              this.props.navigation.openDrawer()
            }
          />
          <TextInput
            placeholder=' Search'
            value={this.state.text} 
            style={Styles.searchBar}
            onChangeText={(text) => this.setState({text})}
            onBlur={() => this.searchOnArbitraryString(this.state.text)}
            showLoading='true'
          />
          <Icon name="ios-search" style={Styles.iosSearch}/>
          
        </Animatable.View>
      </View>
    );
  } 

  openMenuDrawer(){
    this.props.navigation.navigate('DrawerOpen');
  }
}
export default withNavigation(TopBar);