import React from 'react';
import {Text, View, AsyncStorage, TextInput, TouchableOpacity} from 'react-native';
import CustomButton from "./CustomButton";
import Register from "./Register"
import ForgotPassword from "./ForgotPassword"
import ProfileView from "./ProfileView"
import Styles from './Styles';
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import EventList from '../EventList'
import LoadingScreen from '../components/LoadingScreen';

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
                    rtoken: "", 
                    credentialsAreCorrect: false, 
                    statusMessage: "You are not logged in.", 
                    isLoading: true}
        dataSource = ""
        username = ""
        name = ""
        token = ""
    }

    componentDidMount(){
      this.retrieveStoredToken()
    }
    
    render() {
      console.log(this.state.isLoading)
      searchView = this.getDisplayedScreen()
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
            </View>)
    }

    getDisplayedScreen(){
      searchView = null
      if(this.state.isLoading){
        searchView = this.getLoadingScreen()
      }
      else if(this.state.url){
          searchView = this.getSearchView()
      }
      else if(this.state.isLoggedIn==true){
          searchView = this.getProfileViewSequence()
      }
      else if(this.state.selectedPage=="Login"){
          searchView = this.getLoginSequence()
      }
      else if(this.state.selectedPage=="ForgotPassword"){
          searchView = this.getForgotPasswordSequence()
      }
      else{
          searchView = this.getSignupSequence()
      }
      return searchView
    }

    getLoadingScreen(){
      return(
        <View>
          <LoadingScreen/>
        </View>
      );
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
      profileInfo = "";
      if(this.state.isLoggedIn){
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
          <Text>{this.state.statusMessage}</Text>
          <Text>{profileInfo}</Text>
        </View>
      )
    }

    getProfileViewSequence(){
      return(
        <View>
          <CustomButton
            text = "Log Out" 
            onPress={()=> this.logUserOut()} 
            buttonStyle={Styles.longButtonStyle}
            textStyle={Styles.longButtonTextStyle}
          />
          <ProfileView userid={this.state.token}/>
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
      if(this.state.credentialsAreCorrect){
      try {
        await AsyncStorage.setItem('Username', this.state.remail);
        await AsyncStorage.setItem('Name', this.state.rname);
        await AsyncStorage.setItem('Token', this.state.rtoken);
        this.setState({isLoggedIn: true});
      } catch (error) {
        console.log("Error storing login information");
      }
    }
    }

    logUserOut = async() => {
      try {
        await AsyncStorage.removeItem('Username');
        await AsyncStorage.removeItem('Name');
        await AsyncStorage.removeItem('Token');
        this.setState({isLoggedIn: false, credentialsAreCorrect: false, statusMessage: "You are not logged in"});
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
        const tkn = await AsyncStorage.getItem('Token')
        this.determineLoginStatus(tkn);
       } catch (error) {
          this.determineLoginStatus()
          return "NULL"
       }
    }

    determineLoginStatus(tkn){
      if(tkn){
        console.log(tkn)
        this.setState({isLoading: false, token: tkn, isLoggedIn: true})
      }
      else{
        console.log("Not logged in")
        this.setState({isLoading: false, token: tkn, isLoggedIn: false})
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
    .then(() => this.setLoginData(this.dataSource))
    .then(() => this.logUserIn())
      .catch((error) =>{
         console.log(error)
      })
    }

    setLoginData(dataSource){
      try{
        this.setState({remail: dataSource.data.attributes.email, rname: dataSource.data.attributes.name, rtoken: dataSource.data.id, credentialsAreCorrect: true})
      }
      catch(error){
        this.setState({statusMessage: dataSource.errors[0].detail})
      }
    }
}