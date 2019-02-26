import React from 'react';
import {Text, View, Platform, DatePickerAndroid, DatePickerIOS, TextInput} from 'react-native';
import CustomButton from "./CustomButton";
import EventList from "../EventList"
import Styles from './Styles';
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import APICacher from '../APICacher'
import {AppLoading} from 'expo';

export default class GoToDate extends React.Component {
  constructor(props){
    super(props);
    this.state = {formattedDate: '', 
                  lastUsedDate: null, 
                  chosenDate: new Date(), 
                  eventView: null,
                  searchURL: "",
                  text: '',
                  resultsLoaded: false,
                  resultsLoading: false
                }  
    this.dateSelected = false; 
    this.setDate = this.setDate.bind(this);
    this.APICacher = new APICacher();
  }

    render() {
      mainView = this.getDatePicker()
      if(this.state.resultsLoaded){
        mainView = this.getResultsScreen()
      }
      else if(this.state.resultsLoading){
        url = this.state.searchURL
        console.log("This is the URL about to be cached: " + url)
        return(
          <AppLoading 
            startAsync={() => this._cacheSearchResults(url)}
            onFinish={() => this.setState({ resultsLoaded: true, resultsLoading: false})}
            onError= {console.error}
          />
        );
      }
      return (
        <View style={Styles.topBarPadding}>
          {this.getTopBar()}
          <View style={Styles.content}>
            {mainView}
          </View>
        </View>
      )
    }

    getIOSFormattedDate(){
      day = this.state.chosenDate.getDate();
      month = this.state.chosenDate.getMonth()+1;
      year = this.state.chosenDate.getFullYear();
      //pad month if needed for api
      if(this.state.chosenDate.getMonth()+1 < 10){
         month="0" + (this.state.chosenDate.getMonth()+1).toString();
      }
      //pad day if needed for api
      if(this.state.chosenDate.getDate() < 10){
        day='0' + this.state.chosenDate.getDate().toString();
      }
      return year + '-' + month + '-' + day;
    }

  getAndroidFormattedDate(newDate){
      console.log("The nonformatted date is: " + newDate)
      day = newDate.getDate();
      month = newDate.getMonth()+1;
      year = newDate.getFullYear();
      console.log("day: " + day + " month: " + month + " year: " + year)
      //pad month if needed for api
      if(newDate.getMonth()+1 < 10){
         month="0" + (newDate.getMonth()+1).toString();
      }
      //pad day if needed for api
      if(newDate.getDate() < 10){
        day='0' + newDate.getDate().toString();
      }
      formattedDate = year + '-' + month + '-' + day
      return formattedDate;
  }

    getTopBar(){
      return(
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
                onBlur={() => this.setState({searchurl:'https://api.muncieevents.com/v1/events/search?q=' + this.state.text +  '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'})}
                showLoading='true'
              />
            <Icon name="ios-search" style={Styles.iosSearch}/>
          </Animatable.View>
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
            onPress={() => this.setState({searchurl: ""})}/>
          />
          <EventList useSearchResults= {true}/>
        </View>
      )
    }

    updateEventView(date){
        if(Platform.OS == 'ios'){
          formattedDate = this.getIOSFormattedDate()
          url = 'https://api.muncieevents.com/v1/events?start='+formattedDate+'&end='+formattedDate+'&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1';
        }
        else{
          formattedDate = this.getAndroidFormattedDate(date)
          url = 'https://api.muncieevents.com/v1/events?start='+formattedDate+'&end='+formattedDate+'&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'
        }
       this.state.searchURL = url;
       this.setState({resultsLoading: true})
    }

    startLoadingResults(){
      this.setState({resultsLoading: true})
    }

    async _cacheSearchResults(searchURL){
      await this.APICacher._cacheJSONFromAPIAsync("SearchResults", searchURL)
    }

    getResultsScreen(){
      return (   
        <View>        
          <Text style={Styles.title}>
          EVENTS
          </Text>
          <CustomButton 
            text="Go Back"
            buttonStyle = {Styles.longButtonStyle}
            textStyle = {Styles.longButtonTextStyle}
            onPress={() => this.setState({resultsLoaded: false})}/>
          <EventList useSearchResults = {true} />
        </View> 
        );
    }

    getDatePicker(){
      if(Platform.OS == 'ios'){
        return (
              <View>
                <DatePickerIOS 
                  date={this.state.chosenDate}
                  onDateChange={this.updateEventView}
                  mode={'date'}
                />
                <CustomButton
                  text="Search"
                  onPress={()=>this.setState({dateSelected: true})}
                  buttonStyle={Styles.longButtonStyle}
                  textStyle={Styles.longButtonTextStyle}
                  />
              </View>)
      }
      else if(Platform.OS == 'android'){ 
        return(
          <CustomButton
              text="Select Date"
              onPress={() => this.getAndroidDatePicker()}
              buttonStyle={Styles.longButtonStyle}
              textStyle={Styles.longButtonTextStyle}
          />
        )      
      }
    }

    async getAndroidDatePicker(){
      try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          date: new Date()
        });
        if (action == DatePickerAndroid.dateSetAction) {
          newDate = new Date(year, month, day);
          this.updateEventView(newDate);
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
    }

    setDate(newDate) {
      if(Platform.OS == 'ios'){
        this.setState({chosenDate: newDate})
      }
      else{
        this.setState({chosenDate: newDate, formattedDate: this.getAndroidFormattedDate(newDate), dateSelected: true})
      }
    }
}