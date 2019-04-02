import React from 'react';
import {Text, View, Platform, DatePickerAndroid, DatePickerIOS, TextInput, TouchableOpacity} from 'react-native';
import CustomButton from "./CustomButton";
import EventList from "../EventList"
import Styles from './Styles';
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import APICacher from '../APICacher'
import LoadingScreen from '../components/LoadingScreen';

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
      titleView = this.getTitle();
      mainView = this.getDatePicker()
      if(this.state.resultsLoaded){
        mainView = this.getResultsScreen()
      }
      else if(this.state.resultsLoading){
        mainView = this.getLoadingScreen();
        url = this.state.searchURL
        this._cacheSearchResults(url);
      }
      return (
        <View style={Styles.wrapper}>
          {this.getTopBar()}
          <View style={Styles.content}>
            {titleView}
            {mainView}
          </View>
        </View>
      )
    }

  getLoadingScreen(){
    return(
      <View>
        <LoadingScreen/>
      </View>
    );
  }

  getAndroidFormattedDate(newDate){
      day = newDate.getDate();
      month = newDate.getMonth()+1;
      year = newDate.getFullYear();
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
        <Icon name="ios-menu" style = {Styles.menuIcon} size={34}
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

   getTitle(){
      return(
        <Text style={Styles.title}>
          GO TO DATE
        </Text>
      );
    }

    updateEventView(date){
        if(Platform.OS == 'ios'){
          formattedDate = this.getIOSFormattedDate(date)
        }
        else{
          formattedDate = this.getAndroidFormattedDate(date)
        }
        url = 'https://api.muncieevents.com/v1/events?start='+formattedDate+'&end='+formattedDate+'&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'
        this.setState({searchURL: url, chosenDate: date});
    }

    startLoadingResults(){
      this.setState({resultsLoading: true})
    }

    async _cacheSearchResults(searchURL){
      await this.APICacher._cacheJSONFromAPIAsync("SearchResults", searchURL)
      this.setState({ resultsLoaded: true, resultsLoading: false});
    }

    getResultsScreen(){
      return (   
        <View>        
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
                  onDateChange={(date) => this.updateEventView(date)}
                  mode={'date'}
                />
                <CustomButton
                  text="Search"
                  onPress={()=>this.setState({resultsLoading: true})}
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
          this.setState({resultsLoading: true});
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
    }

    getIOSFormattedDate(date){
      console.log("The nonformatted date is: " + date)
      day = date.getDate();
      month = date.getMonth()+1;
      year = date.getFullYear();
      console.log("day: " + day + " month: " + month + " year: " + year)
      //pad month if needed for api
      if(date.getMonth()+1 < 10){
         month="0" + (date.getMonth()+1).toString();
      }
      //pad day if needed for api
      if(date.getDate() < 10){
        day='0' +date.getDate().toString();
      }
      return year + '-' + month + '-' + day;
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