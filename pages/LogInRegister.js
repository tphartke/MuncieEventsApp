import React from 'react';
import {Text, View, Button, AsyncStorage, TextInput} from 'react-native';
import TopBar from './top_bar';

export default class LogInRegister extends React.Component {
    constructor(props){
      super(props);
      this.state = {isLoggedIn: false}
      this.password = '';
      this.username = '';
    }
    
    render() {
      logInMessage = "You are not logged in";
      profileInfo = "";
      if(this.state.isLoggedIn){
          logInMessage = "You are logged in.";
          profileInfo = this.showProfileInfo();
      }
      return (
        <View style={{paddingTop:20}}>
          <TopBar />         
          <Button title="Log In" onPress={()=> this.logUserIn()} />
          <Button title = "Log Out" onPress={()=> this.logUserOut()} />
          <Text>{logInMessage}</Text>
          <Text>{profileInfo}</Text>
        </View>
      )
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