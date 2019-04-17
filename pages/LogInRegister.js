import React from 'react';
import {Text, View, AsyncStorage, TextInput, TouchableOpacity} from 'react-native';
import CustomButton from "./CustomButton";
import Register from "./Register"
import ForgotPassword from "./ForgotPassword"
import ProfileView from "./ProfileView"
import Styles from './Styles';
import LoadingScreen from '../components/LoadingScreen';
import TopBar from './top_bar';
import InternetError from '../components/InternetError';

export default class LogInRegister extends React.Component {
    constructor(props){
      super(props);      
      this.state = {isLoggedIn: false,
                    selectedPage: "Login",
                    userid: "",
                    uniqueToken: "",
                    email: "",
                    password: "",
                    statusMessage: "You are not logged in.", 
                    isLoading: true,
                    failedToLoad: false}
    }

    componentDidMount(){
      this.retrieveStoredToken()
    }
    
    render() {
      if(this.state.failedToLoad){
        mainView = this.getErrorMessage();
      }
      else{
        mainView = this.getDisplayedScreen()
      }
      return(
        <View style={Styles.wrapper}>
          <View style={Styles.topBarWrapper}>
            <TopBar/>    
          </View>
          <View style={Styles.mainViewContent}>
            {mainView}
          </View>
        </View>
        );
    }

    getErrorMessage(){
      return(
        <InternetError onRefresh = {() => {
          this.setState({failedToLoad:false})
        }}/>
      )
    }

    getDisplayedScreen(){
      if(this.state.isLoading){
        return this.getLoadingScreen()
      }
      else if(this.state.isLoggedIn==true){
        return this.getProfileViewSequence()
      }
      else if(this.state.selectedPage=="Login"){
        return this.getLoginSequence()
      }
      else if(this.state.selectedPage=="ForgotPassword"){
        return this.getForgotPasswordSequence()
      }
      else{
        return this.getSignupSequence()
      }
    }

    getLoadingScreen(){
      return(
        <View style={{flex:1}}>
          <LoadingScreen/>
        </View>
      );
    }

    getLoginSequence(){
      profileInfo = "";
      if(this.state.isLoggedIn){
          profileInfo = this.showProfileInfo();
      }
      return (
        <View style={{flex:0.3}}>      
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
            onPress={()=> this.fetchAPILoginData()} 
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
            onPress={() => this.setState({selectedPage: "ForgotPassword"})}>
            <Text style={{color: 'blue'}}>Forgot Password?</Text>
          </TouchableOpacity>

          <Text>{this.state.statusMessage}</Text>
          <Text>{profileInfo}</Text>
        </View>
      )
    }

    getProfileViewSequence(){
      return(
        <View style={{flex:1}}>
          <CustomButton
            text = "Log Out" 
            onPress={()=> this.logUserOut()} 
            buttonStyle={Styles.longButtonStyle}
            textStyle={Styles.longButtonTextStyle}
          />
          <ProfileView userid={this.state.userid} token={this.state.uniqueToken}/>
       </View>
      );
    }

    getSignupSequence(){
      return(
        <View style={{flex:1}}>
          <View style={Styles.buttonBuffer}/>
          <CustomButton
            text = "Go Back"
            buttonStyle={Styles.longButtonStyle}
            textStyle={Styles.longButtonTextStyle}
            onPress={() => this.setState({selectedPage: "Login"})}
          />
          <Register />

        </View>
      );
    }

    getForgotPasswordSequence(){
      return(
        <View style={{flex:1}}>
            <View style={Styles.buttonBuffer}/>
            <CustomButton
            text = "Go Back"
            buttonStyle={Styles.longButtonStyle}
            textStyle={Styles.longButtonTextStyle}
            onPress={() => this.setState({selectedPage: "Login"})}
          />
          <ForgotPassword />
        </View>
      );
    }
    
    logUserIn = async(dataSource) => {
      uid = ""
      utkn = ""
      credentialsAreCorrect = false
      try{
       uid = dataSource.data.id;
       utkn = dataSource.data.attributes.token
       credentialsAreCorrect = true
      }
      catch(error){
        console.log("Error logging in")
        this.setState({statusMessage: dataSource.errors[0].detail})
      }
      if(credentialsAreCorrect){
      try {
        await AsyncStorage.setItem('UniqueToken', utkn);
        await AsyncStorage.setItem('Token', uid);
        this.setState({isLoggedIn: true, uniqueToken: utkn, userid: uid});
      } catch (error) {
        console.log("Error storing login information");
      }
    }
    }

    logUserOut = async() => {
      try {
        await AsyncStorage.removeItem('UniqueToken');
        await AsyncStorage.removeItem('Token');
        this.setState({isLoggedIn: false, statusMessage: "You are not logged in", userid: "", uniqueToken: ""});
      } catch (error) {
        console.log("Error logging user out");
      }
    }

    retrieveStoredToken = async() => {
      try {
        const tkn = await AsyncStorage.getItem('Token')
        const utoken = await AsyncStorage.getItem('UniqueToken')
        this.determineLoginStatus(tkn, utoken);
       } catch (error) {
          this.determineLoginStatus()
          return "NULL"
       }
    }

    determineLoginStatus(tkn, utoken){
      if(tkn && utoken){
        this.setState({isLoading: false, userid: tkn, uniqueToken: utoken, isLoggedIn: true})
      }
      else{
        this.setState({isLoading: false, userid: tkn, isLoggedIn: false})
      }
    }

    fetchAPILoginData(){
      console.log("Fetching API login data...")
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
    .then((responseJson) => this.logUserIn(responseJson))
      .catch((error) =>{
         this.setState({failedToLoad:true})
      })
    }
}