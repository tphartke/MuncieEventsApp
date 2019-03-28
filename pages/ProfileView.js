import React from 'react';
import {View, TextInput, Text} from 'react-native';
import CustomButton from "./CustomButton";
import Styles from './Styles';
import EventList from '../EventList';
import APICacher from '../APICacher';
import LoadingScreen from '../components/LoadingScreen';
import ChangePassword from './ChangePassword'

export default class ProfileView extends React.Component {
    constructor(props){
        super(props);
        this.state = ({email: "", 
                      name: "", 
                      statusMessage: "", 
                      userid: "",
                      token: "",
                      isLoading: true, 
                      usereventsurl: "", 
                      usereventsresponsejson: "",
                      changePassword: false,
                      isReady: false});
                      this._startupCachingAsync = this._startupCachingAsync.bind(this);
                      this.APICacher = new APICacher();
      }

      render(){
        contentView = null
        eventsView = null
        if(!this.state.isReady){
            eventsView= this.getLoadingView()
        }
        else if(this.state.changePassword){
            contentView = (<View>
                              <ChangePassword userid={this.state.userid}/>
                              <CustomButton 
                                  text="Go Back" 
                                  buttonStyle = {Styles.longButtonStyle}
                                  textStyle = {Styles.longButtonTextStyle}
                                  onPress = {()=>this.setState({changePassword: false})}
                              />
                          </View>)
        }
        else{
          eventsView=(<View>
            <Text style={Styles.title}>EVENTS</Text>
            <View>
            <EventList useSearchResults = {true} />
            </View>
          </View>)
          if(!this.state.email && this.state.userid){
              this.fetchUserData(this.state.userid)
              this.fetchUserEventsData()
          }
          else if(this.state.userid){
              contentView = this.getProfileInformation();
          }
        }
          return(
            <View>
                {contentView}
                {eventsView}
            </View>
        );
      }

      getLoadingView(){
        return(
          <LoadingScreen/>
        );
      }

      componentDidMount(){
        url = "https://api.muncieevents.com/v1/user/" + this.props.userid + "/events?apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1";
        this.setState({userid: this.props.userid, token: this.props.token,
        usereventsurl: url});
        this._startupCachingAsync(url);
      }

      fetchUserData(userid){
        fetch("https://api.muncieevents.com/v1/user/" + userid + "?apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1")        
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            email: responseJson.data.attributes.email,
            name: responseJson.data.attributes.name
          });
        })
        .catch((error) =>{
          console.error(error);
        });
      } 

      updateUserData(){
        fetch("https://api.muncieevents.com/v1/user/profile?userToken=" + this.state.token + "&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1", 
          {method: "PATCH",
          headers: {
            Accept: '*/*'
            },
          body: JSON.stringify({
              email: this.state.email, 
              name: this.state.name,
          })
      })
      .then((response)=>responseJson = response.json())
      .then((responseJson)=>console.log(responseJson))
        .catch((error) =>{
           console.log(error)
           this.setState({statusMessage: "Error reaching server: " + error})
        })
      }

      async _startupCachingAsync(url){
        key = "SearchResults"
        await this.APICacher._cacheJSONFromAPIAsync(key, url)
        this.setState({isReady:true});
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
          console.error(error);
        });
      } 

      getProfileInformation(){
          return(
              <View>
                <TextInput
                    onChangeText={(name) => this.setState({name})}
                    style={Styles.textBox}
                    value={this.state.name}
                />          
                <TextInput
                    onChangeText={(email) => this.setState({email})}
                    style={Styles.textBox}
                    value={this.state.email}
                />
                <CustomButton 
                    text="Update" 
                    buttonStyle = {Styles.longButtonStyle}
                    textStyle = {Styles.longButtonTextStyle}
                    onPress = {()=>this.updateUserData()}
                />
                <CustomButton 
                    text="Change Password" 
                    buttonStyle = {Styles.longButtonStyle}
                    textStyle = {Styles.longButtonTextStyle}
                    onPress = {()=>this.setState({changePassword: true})}
                />
              </View>
          )
      }
}