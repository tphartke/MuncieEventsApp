import React from 'react';
import {View, TextInput, Text} from 'react-native';
import CustomButton from "./CustomButton";
import Styles from './Styles';
import EventList from '../EventList';
import APICacher from '../APICacher';
import LoadingScreen from '../components/LoadingScreen';
import ChangePassword from './ChangePassword'
import InternetError from '../components/InternetError';
import MailingList from './MailingList'
import APIKey from '../APIKey'

export default class ProfileView extends React.Component {
    constructor(props){
        super(props);
        this.state = ({email: "", 
                      name: "", 
                      statusMessage: "", 
                      userid: "",
                      token: "",
                      usereventsurl: "", 
                      usereventsresponsejson: "",
                      changePassword: false,
                      isLoading: true,
                      mailingList: false,
                      failedToLoad:false});
                      this.APICacher = new APICacher();
                      this.APIKey = new APIKey();
      }

      render(){
        contentView = null
        eventsView = null
        if(this.state.isLoading){
            eventsView= this.getLoadingView()
        }
        else if(this.state.failedToLoad){
          contenView = this.getErrorMessage()
        }
        else if(this.state.changePassword){
            contentView = (<View style={{flex:1}}>
                              <CustomButton 
                                  text="Go Back" 
                                  buttonStyle = {Styles.longButtonStyle}
                                  textStyle = {Styles.longButtonTextStyle}
                                  onPress = {()=>this.setState({changePassword: false})}
                              />
                              <ChangePassword userToken={this.state.token}/>
                          </View>)
        }
        else if(this.state.mailingList){
          contentView = this.getMailingListView()
        }
        else{
          if(!this.state.email && this.state.userid){
              this.fetchUserData(this.state.userid)
          }
          else if(this.state.userid){
              contentView = this.getProfileInformation();
          }
        }
          return(
            <View style={{flex:1}}>
                {contentView}
                {eventsView}
            </View>
        );
      }

      getErrorMessage(){
        return(
          <InternetError onRefresh={()=> {
            this.setState({failedToLoad: false, changePassword:false, isLoading:true})
          }}/>
        );
      }

      getLoadingView(){
        return(
          <LoadingScreen/>
        );
      }

      getMailingListView(){
        return(
              <View style={{flex:1}}>
                  <CustomButton 
                      text="Go Back" 
                      buttonStyle = {Styles.longButtonStyle}
                      textStyle = {Styles.longButtonTextStyle}
                      onPress = {()=>this.setState({mailingList: false})}
                    />
                  <MailingList userToken={this.state.token}/>
              </View>

        )
      }

      componentDidMount(){
        url = "https://api.muncieevents.com/v1/user/" + this.props.userid + "/events?apikey="+this.APIKey.getAPIKey();
        this.setState({userid: this.props.userid, token: this.props.token,
        usereventsurl: url});
        this._startupCachingAsync(url);
      }

      fetchUserData(userid){
        fetch("https://api.muncieevents.com/v1/user/" + userid + "?apikey="+this.APIKey.getAPIKey())        
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            email: responseJson.data.attributes.email,
            name: responseJson.data.attributes.name
          });
        })
        .catch((error) =>{
          this.setState({failedToLoad:true})
        });
      } 

      checkIfUserDataIsValid(){
        if(this.state.name == ""){
          this.setState({statusMessage: "Please enter your name"})
        }
        else if(!this.isValidEmail(this.state.email)){
          this.setState({statusMessage: "Please enter a valid email"})
        }
        else{
          this.updateUserData();
        }
      }

      updateUserData(){
        fetch("https://api.muncieevents.com/v1/user/profile?userToken=" + this.state.token + "&apikey="+this.APIKey.getAPIKey(), 
          {method: "PATCH",
          headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/json',
            },
          body: JSON.stringify({
              email: this.state.email, 
              name: this.state.name,
          })
      })
      .then((response) => {this.getStatusMessage(response.json())})
        .catch((error) =>{
           console.log(error)
        })
      }

      getStatusMessage(responseJson){
        try{
          this.setState({statusMessage: responseJson.errors[0].detail})
        }
        catch(error){this.setState({statusMessage: 'User information successfully updated!'})}
        }

        isValidEmail(email){
          //this is a regex expression compliant with the rfc that matches 99.99% of active email addresses
          rfc2822 = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
          return rfc2822.test(email);
        }

      async _startupCachingAsync(url){
        try{
          key = "SearchResults"
          await this.APICacher._cacheJSONFromAPIAsync(key, url)
          this.setState({isLoading:false});
        }
        catch(error){
          this.setState({failedToLoad:true})
        }
    }

      fetchUserEventsData(){
        console.log(this.state.usereventsurl)
        fetch(this.state.usereventsurl)        
        .then((responseJson) => {
          this.setState({
            usereventsresponsejson: responseJson
          });
        })
        .catch((error) =>{
          this.setState({failedToLoad:true})
        });
      } 

      getProfileInformation(){
          return(
              <View style={{flex:0.35}}>
              <View style={Styles.buttonBuffer}/>
                <CustomButton 
                    text="Change Password" 
                    buttonStyle = {Styles.longButtonStyle}
                    textStyle = {Styles.longButtonTextStyle}
                    onPress = {()=>this.setState({changePassword: true})}
                />
                <View style={Styles.buttonBuffer}/>
                <CustomButton 
                    text="Edit Mailing List Settings" 
                    buttonStyle = {Styles.longButtonStyle}
                    textStyle = {Styles.longButtonTextStyle}
                    onPress = {()=>{this.setState({mailingList: true})}}
                />
                <View style={Styles.buttonBuffer}/>
                <TextInput
                    onChangeText={(name) => this.setState({name})}
                    style={Styles.textBox}
                    value={this.state.name}
                    underlineColorAndroid="transparent"
                />          
                <TextInput
                    onChangeText={(email) => this.setState({email})}
                    style={Styles.textBox}
                    value={this.state.email}
                    underlineColorAndroid="transparent"
                />
                <CustomButton 
                    text="Update" 
                    buttonStyle = {Styles.longButtonStyle}
                    textStyle = {Styles.longButtonTextStyle}
                    onPress = {()=>this.checkIfUserDataIsValid()}
                />
                <Text>{this.state.statusMessage}</Text>
              </View>
          )
      }
}