import React from 'react';
import {Text, View, AsyncStorage, TextInput} from 'react-native';
import TopBar from './top_bar';
import CustomButton from "./CustomButton";
import Register from "./Register"
import Styles from './Styles';
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import EventList from '../EventList'

export default class LogInRegister extends React.Component {
    constructor(props){
      super(props);      
      this.state = {isLoggedIn: false,
                    selectedPage: "Login",
                    url: "",
                    text: ""}
      this.userid = '1112';
      this.password = '';
      this.username = '';
    }
    
    render() {
      loginRegisterView = null
      searchView = null
      if(this.state.url){
          searchView = this.getSearchView()
      }
      else if(this.state.isLoggedIn==true){
          loginRegisterView = this.getProfileViewSequence()
      }
      else if(this.state.selectedPage=="Login"){
          loginRegisterView = this.getLoginSequence()
      }
      else{
          loginRegisterView = this.getSignupSequence()
      }
      return(<View style={Styles.topBarPadding}>
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
                {loginRegisterView}
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

    getLoginSequence(){
      logInMessage = "You are not logged in";
      profileInfo = "";
      if(this.state.isLoggedIn){
          logInMessage = "You are logged in.";
          profileInfo = this.showProfileInfo();
      }
      return (
        <View>      
          <TextInput
              onChangeText={(username) => this.setState({username})}
              style={Styles.textBox}
              placeholder="Username"
          />          
          <TextInput
          onChangeText={(password) => this.setState({password})}
          style={Styles.textBox}
          placeholder="Password"
          />
          
          <CustomButton 
            text="Log In" 
            onPress={()=> this.logUserIn()} 
            buttonStyle={Styles.longButtonStyle}
            textStyle={Styles.longButtonTextStyle}
          />

          <CustomButton
            text = "Sign Up"
            buttonStyle={Styles.longButtonStyle}
            textStyle={Styles.longButtonTextStyle}
            onPress={() => this.setState({selectedPage: "Signup"})}
          />
          <Text>{logInMessage}</Text>
          <Text>{profileInfo}</Text>
        </View>
      )
    }

    getProfileViewSequence(){
      logInMessage = "You are logged in.";
      profileInfo = this.showProfileInfo();
      return(
        <View>
          <CustomButton
            text = "Log Out" 
            onPress={()=> this.logUserOut()} 
            buttonStyle={Styles.longButtonStyle}
            textStyle={Styles.longButtonTextStyle}
          />
        <Text>{logInMessage}</Text>
        <Text>{profileInfo}</Text>
       </View>
      );
    }

    getSignupSequence(){
      return(
        <View>
          <Register />
          <CustomButton
            text = "Go Back"
            buttonStyle={Styles.longButtonStyle}
            textStyle={Styles.longButtonTextStyle}
            onPress={() => this.setState({selectedPage: "Login"})}
          />
        </View>
      );
    }

    logUserIn = async() => {
      try {
        await AsyncStorage.setItem('Username', 'User');
        await AsyncStorage.setItem('Password', 'Password');
        this.setState({isLoggedIn: true});
      } catch (error) {
        console.log("Error storing login information");
      }
    }

    logUserOut = async() => {
      try {
        await AsyncStorage.removeItem('Username');
        await AsyncStorage.removeItem('Password');
        this.setState({isLoggedIn: false});
      } catch (error) {
        console.log("Error logging user out");
      }
    }

    retrieveStoredUsername = async() => {
      try {
        const usrnme = await AsyncStorage.getItem('Username');
        if (usrnme !== null) {
            this.username = usrnme;
        }
       } catch (error) {
          return "NULL"
       }
    }

    retrieveStoredPassword = async() => {
      try {
        const pword = await AsyncStorage.getItem('Password');
        if (pword !== null) {
          this.password = pword;
        }
       } catch (error) {
          return "NULL"
       }
      
    }

    showProfileInfo(){
      if(this.state.isLoggedIn){
        this.retrieveStoredUsername()
        this.retrieveStoredPassword()
        return "Username: " + this.username + ". Password: " + this.password;
      }
      else{
        return ""
      }
    }
}