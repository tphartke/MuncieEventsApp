import React from 'react';
import {View, TextInput, Text} from 'react-native';
import CustomButton from "./CustomButton";
import Styles from './Styles';
import EventList from '../EventList';
import APICacher from '../APICacher';
import LoadingScreen from '../components/LoadingScreen';

export default class ProfileView extends React.Component {
    constructor(props){
        super(props);
        this.state = ({email: "", 
                      name: "", 
                      statusMessage: "", 
                      userid: "",
                      isLoading: true, 
                      usereventsurl: "", 
                      usereventsresponsejson: "",
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
        else{
            eventsView=(<View>
                          <Text style={Styles.title}>EVENTS</Text>
                          <View>
                          <EventList useSearchResults = {true} />
                          </View>
                        </View>)
        }

        if(!this.state.email && this.state.userid){
          this.fetchUserData(this.state.userid)
          this.fetchUserEventsData()
        }
        else if(this.state.userid){
          contentView = this.getProfileInformation();
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
        console.log(this.props.userid + " profileView")
        url = "https://api.muncieevents.com/v1/user/" + this.props.userid + "/events?apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1";
        this.setState({userid: this.props.userid, 
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
        fetch("https://api.muncieevents.com/v1/user/profile?userToken=" + this.state.userid +"apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1", 
          {method: "PATCH",
          headers: {
              Accept: 'application/vnd.api+json',
              'Content-Type': 'application/json',
              },
          body: JSON.stringify({
            name: this.state.name,
            email: this.state.email,
          })
      })
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
        fetch(this.state.usereventsurl)        
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
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
              </View>
          )
      }
}