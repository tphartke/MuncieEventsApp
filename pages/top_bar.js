import React from 'react';
import {TextInput, View} from 'react-native';
import {withNavigation } from "react-navigation";
import CustomButton from "./CustomButton";
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import Styles from './Styles';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={text: ''};
    this.state={readyToSearch: false}
  }

  searchOnArbitraryString(){
    return this.props.navigation.navigate('SearchOutput', {
      searchInput: this.state.text,
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
    );
  } 

  openMenuDrawer(){
    this.props.navigation.navigate('DrawerOpen');
  }
}
export default withNavigation(TopBar);