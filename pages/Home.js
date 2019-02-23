import React from 'react';
import EventList from "../EventList"
import {TextInput, View, Text} from 'react-native';
import CustomButton from "./CustomButton";
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import Styles from './Styles';


export default class HomeScreen extends React.Component{
  constructor(props){
    super(props);
    this.state={text: ''};
    this.state={url: ""}
  }  
      render(){
        homeView = null
        searchView = null
        if(this.state.url){
            searchView = this.getSearchView()
        }
        else{
            homeView = this.getHomeView()
        }
        return(
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
            <View>
            {searchView}
            {homeView}
            </View>
        </View>
        );
      } 

      getHomeView(){
        return(
          <View>
            <Text style={Styles.title}>
              EVENTS
            </Text>
            <EventList apicall='https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ' />
          </View>)
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