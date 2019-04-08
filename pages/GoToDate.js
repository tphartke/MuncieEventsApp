import React from 'react';
import {Text, View, Platform, DatePickerAndroid, DatePickerIOS} from 'react-native';
import CustomButton from "./CustomButton";
import EventList from "../EventList"
import Styles from './Styles';
import APICacher from '../APICacher'
import LoadingScreen from '../components/LoadingScreen';
import TopBar from './top_bar';
import InternetError from '../components/InternetError';

export default class GoToDate extends React.Component {
  constructor(props){
    super(props);
    this.state = {formattedDate: '', 
                  lastUsedDate: null, 
                  chosenDate: new Date(), 
                  searchURL: "",
                  searchResultsFound: false,
                  isSearching: false,
                  failedToLoad:false
                }  
    this.dateSelected = false; 
    this.setDate = this.setDate.bind(this);
    this.APICacher = new APICacher();
  }

    render() {
      titleView = this.getTitle();
      mainView = this.getDatePicker()
      if(this.state.searchResultsFound){
        mainView = this.getResultsScreen()
      }
      else if(this.state.isSearching){
        mainView = this.getLoadingScreen();
        url = this.state.searchURL
        this._cacheSearchResults(url);
      }
      else if(this.state.failedToLoad){
        mainView = this.getErrorMessage();
      }
      return (
        <View style={Styles.wrapper}>
          <View style={Styles.topBarWrapper}>
            <TopBar/>
          </View>
          <View style={Styles.mainViewContent}>
            {titleView}
            {mainView}
          </View>
        </View>
      )
    }
  
  getErrorMessage(){
    return(
      <InternetError onRefresh = {() => {
        this.setState({failedToLoad:false, isSearching:false, searchResultsFound: false})
      }}/>
    );
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

    async _cacheSearchResults(searchURL){
      try{
        await this.APICacher._cacheJSONFromAPIAsync("SearchResults", searchURL)
        this.setState({ searchResultsFound: true, isSearching: false});
      }
      catch(error){
        this.setState({failedToLoad:true, isSearching:false})
      }
    }

    getResultsScreen(){
      return (   
        <View>        
          <CustomButton 
            text="Go Back"
            buttonStyle = {Styles.longButtonStyle}
            textStyle = {Styles.longButtonTextStyle}
            onPress={() => this.setState({searchResultsFound: false})}/>
          <View style={Styles.GoToDateSearchResults}>
            <EventList useSearchResults = {true}/>
          </View>
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
                  onPress={()=>this.setState({isSearching: true})}
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
          this.setState({isSearching: true});
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