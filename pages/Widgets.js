import React from 'react';
import {Linking, Text, View, TextInput} from 'react-native';
import Styles from './Styles';
import CustomButton from "./CustomButton";
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import EventList from '../EventList'

export default class Widgets extends React.Component {
  constructor(props){
    super(props)
    this.state = ({url: "",
                   text: ""})
  }

render() {
    widgetsView = null
    searchView = null
    if(this.state.url){
        searchView = this.getSearchView()
    }
    else{
        widgetsView = this.getWidgetsView()
    }
  return (
    <View style={Styles.topBarPadding}>
       <View style={Styles.topBarWrapper}>
        <Animatable.View animation = "slideInRight" duration={500} style={Styles.topBarContent}>
            <CustomButton
                text="Menu"
                onPress={() => this.props.navigation.openDrawer()}/>
            <TextInput
                placeholder=' Search'
                value={this.state.text} 
                style={Styles.searchBar}
                onChangeText={(text) => this.setState({text})}
                onBlur={() => this.setState({url:'https://api.muncieevents.com/v1/events/search?q=' + this.state.text +  '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'})}
                showLoading='true'
              />
            <Icon name="ios-search" style={Styles.iosSearch}/>
          </Animatable.View>
        </View>
      {searchView}
      {widgetsView}
    </View>
  )
}

getWidgetsView(){
    return(
        <View>
            <Text style={Styles.title}>
                Widgets
            </Text>
            <Text style ={Styles.widgetContent}>Have a website? Support your community by adding a Muncie Events widget to it and keeping your visitors informed about local events. {"\n"}
              To learn more about useing our widgets, just visit our{" "}  
              <Text style={{color: 'blue'}}
                onPress={() => Linking.openURL('https://muncieevents.com/widget')
              }>
               webpage.
              </Text>
            </Text>
        </View>
    )
}


getSearchView(){
    return(
      <View>
        <CustomButton 
          text="Go Back"
          buttonStyle = {Styles.longButtonStyle}
          textStyle = {Styles.longButtonTextStyle}
          onPress={() => this.setState({url: ""})}/>
        />
        <EventList apicall={this.state.url} />
      </View>
    )
  }
}