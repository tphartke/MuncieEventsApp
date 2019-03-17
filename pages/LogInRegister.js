import React from 'react';
import {Text, View, AsyncStorage, TextInput, TouchableOpacity} from 'react-native';
import CustomButton from "./CustomButton";
import Register from "./Register"
import ForgotPassword from "./ForgotPassword"
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
                    text: "",
                    token: "",
                    email: "",
                    password: "",
                    rname: "",
                    remail: "",
                    rtoken: ""}
    }
    dataSource = ""
    username = ""
    name = ""
    token = ""
    
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
      else if(this.state.selectedPage=="ForgotPassword"){
          loginRegisterView = this.getForgotPasswordSequence()
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
              onChangeText={(email) => this.setState({email})}
              style={Styles.textBox}
              placeholder="Email"
          />          
          <TextInput
          onChangeText={(password) => this.setState({password})}
          style={Styles.textBox}
          placeholder="Password"
          secureTextEntry={true}
          />
          
          <CustomButton 
            text="Log In" 
            onPress={()=> this.initiateLoginProcess()} 
            buttonStyle={Styles.longButtonStyle}
            textStyle={Styles.longButtonTextStyle}
          />

          <CustomButton
            text = "Sign Up"
            buttonStyle={Styles.longButtonStyle}
            textStyle={Styles.longButtonTextStyle}
            onPress={() => this.setState({selectedPage: "Signup"})}
          />
          <TouchableOpacity
            onPress={() => this.setState({selectedPage: "ForgotPassword"})}
          >
            <Text style={{color: 'blue'}}>Forgot Password?</Text>
          </TouchableOpacity>
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

    initiateLoginProcess(){
      this.fetchAPILoginData()
    }

    getForgotPasswordSequence(){
      return(
        <View>
            <ForgotPassword />
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
        await AsyncStorage.setItem('Username', this.state.remail);
        await AsyncStorage.setItem('Name', this.state.rname);
        await AsyncStorage.setItem('Token', this.state.rtoken);
        this.setState({isLoggedIn: true});
      } catch (error) {
        console.log("Error storing login information");
      }
    }

    logUserOut = async() => {
      try {
        await AsyncStorage.removeItem('Username');
        await AsyncStorage.removeItem('Name');
        await AsyncStorage.removeItem('Token');
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

    retrieveStoredName = async() => {
      try {
        const nm = await AsyncStorage.getItem('Name');
        if (nm !== null) {
          this.name = nm;
        }
       } catch (error) {
          return "NULL"
       }
      
    }

    retrieveStoredToken = async() => {
      try {
        const tkn = await AsyncStorage.getItem('Token');
        if (tkn !== null) {
          this.token = tkn;
        }
       } catch (error) {
          return "NULL"
       }
      
    }
    showProfileInfo(){
      if(this.state.isLoggedIn){
        this.retrieveStoredUsername()
        this.retrieveStoredName()
        this.retrieveStoredToken()
        return "Email: " + this.state.remail + " Name: " + this.state.rname + "Token: " + this.state.rtoken;
      }
      else{
        return ""
      }
    }

    fetchAPILoginData(){
      fetch("https://api.muncieevents.com/v1/user/login?apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1", 
        {method: "POST",
        headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({
          password: this.state.password,
          email: this.state.email,
        })
    })
    .then((response) => response.json())
    .then((responseJson) =>  this.dataSource = responseJson)
    .then(() => this.setState({remail: this.dataSource.data.attributes.email, rname: this.dataSource.data.attributes.name, rtoken: this.dataSource.data.id}))
    .then(() => this.logUserIn())
      .catch((error) =>{
         console.log(error)
         this.setState({statusMessage: "Error reaching server: " + error})
      })
    }
}