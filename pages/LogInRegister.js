import React from 'react';
import {Text, View, Button, AsyncStorage, TextInput} from 'react-native';
import TopBar from './top_bar';
import CustomButton from "./CustomButton";
import Register from "./Register"
import Styles from './Styles';

export default class LogInRegister extends React.Component {
    constructor(props){
      super(props);      this.state = {isLoggedIn: false}
      this.state = {selectedPage: "Login"}
      this.password = '';
      this.username = '';
    }
    
    render() {
      if(this.state.isLoggedIn==true){
        return(
          this.getLogoutSequence()
        )
      }
      else if(this.state.selectedPage=="Login"){
        return(
          this.getLoginSequence()
        )
      }
      else{
        return(
          this.getSignupSequence()
        )
      }
    }

    getLoginSequence(){
      logInMessage = "You are not logged in";
      profileInfo = "";
      if(this.state.isLoggedIn){
          logInMessage = "You are logged in.";
          profileInfo = this.showProfileInfo();
      }
      return (
        <View style={Styles.topBarPadding}>
          <TopBar />        
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

    getLogoutSequence(){
      logInMessage = "You are logged in.";
      profileInfo = this.showProfileInfo();
      return(
        <View style={Styles.topBarPadding}>
          <TopBar />  
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
        <View style={Styles.topBarPadding}>
          <TopBar />  
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