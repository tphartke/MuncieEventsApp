import React from 'react';
import EventList from "../EventList"
import {TextInput, View, Text} from 'react-native';
import CustomButton from "./CustomButton";
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import Styles from './Styles';
import {AppLoading} from 'expo';
import APICacher from '../APICacher';

export default class HomeScreen extends React.Component{
  constructor(props){
    super(props);
    this.state={text: ''};
    this.state={url: 'https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ'};
    this.state={searchurl: ""}
    this.state = {isReady: false};
    this._startupCachingAsync = this._startupCachingAsync.bind(this);
    this.APICacher = new APICacher();
  }  
      render(){
        homeView = null
        searchView = null
        if(this.state.searchurl){
            searchView = this.getSearchView()
        }
        else{
            homeView = this.getHomeView()
        }
        if(!this.state.isReady && !this.state.searchurl){
          return(
            <AppLoading 
              startAsync={this._startupCachingAsync}
              onFinish={() => this.setState({ isReady: true })}
              onError= {console.error}
            />
          );
        }
        else if(!this.state.isReady && this.state.searchurl){
          return(
            <AppLoading 
              startAsync={() => this.startSearchSequence('https://api.muncieevents.com/v1/events/search?q=' + this.state.text +  '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1')}
              onFinish={() => this.setState({ isReady: true })}
              onError= {console.error}
            />
          );
        }
        else{
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
                        onBlur={() => {this.setState({isReady: false, searchurl: true})}}
                        showLoading='true'
                      />
                    <Icon name="ios-search" style={Styles.iosSearch}/>
                  </Animatable.View>
                </View>
                {searchView}
                {homeView}
            </View>
          );
        }
      } 

      async _startupCachingAsync(){
          key = "APIData"
          url = "https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
          hasAPIData = await this.APICacher._hasAPIData(key)
          if(hasAPIData){
           await this.APICacher._refreshJSONFromStorage(key, url)
          }
          if(!hasAPIData){
            await this.APICacher._cacheJSONFromAPIWithExpDate(key, url);
          }
      }

      getHomeView(){
        return(
          <View>
            <Text style={Styles.title}>
              EVENTS
            </Text>
            <View>
              <EventList/>
            </View>
          </View>)
      }

      async startSearchSequence(searchurl){
        console.log(searchurl)
        await this.APICacher._cacheJSONFromAPIAsync("SearchResults", searchurl)
      }

      getSearchView(){
        console.log(this.state.searchurl)
        return(
          <View>
            <CustomButton 
              text="Go Back"
              buttonStyle = {Styles.longButtonStyle}
              textStyle = {Styles.longButtonTextStyle}
              onPress={() => {this.setState({searchurl: ""})}}/>
            />
              <EventList useSearchResults={true} />
          </View>
        )
        }
    async searchOnString(arbitraryString){
      await this.APICacher._cacheJSONFromAPIAsync("SearchResults", arbitraryString)
    }
}