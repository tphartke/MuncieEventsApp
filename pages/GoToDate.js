import React from 'react';
import {Text, View, Platform, DatePickerAndroid, DatePickerIOS, TextInput} from 'react-native';
import CustomButton from "./CustomButton";
import EventList from "../EventList"
import Styles from './Styles';
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'

export default class GoToDate extends React.Component {
  constructor(props){
    super(props);
    this.state = {formattedDate: '', 
                  lastUsedDate: null, 
                  chosenDate: new Date(), 
                  eventView: null,
                  searchurl: '',
                  text: ''
                }  
    this.dateSelected = false; 
    this.setDate = this.setDate.bind(this);
  }

    render() {
      datePicker = null
      eventView =  this.updateEventView()
      searchView = null
      if(this.state.searchurl){
        searchView = this.getSearchView()
      }
      else if(!eventView){
        datePicker = this.getDatePicker()
      }
      return (
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
                    onBlur={() => this.setState({searchurl:'https://api.muncieevents.com/v1/events/search?q=' + this.state.text +  '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'})}
                    showLoading='true'
                  />
                <Icon name="ios-search" style={Styles.iosSearch}/>
              </Animatable.View>
            </View>
          <View style={Styles.content}>
            {searchView}
            {datePicker}
            {eventView}
          </View>
        </View>
      )
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
          <EventList apicall={this.state.searchurl} />
        </View>
      )
    }

    updateEventView(){
      if(this.state.dateSelected){
        if(Platform.OS == 'ios'){
          results = (   
            <View>        
            <Text style={Styles.title}>
            EVENTS
            </Text>
            <CustomButton 
            text="Go Back"
            buttonStyle = {Styles.longButtonStyle}
            textStyle = {Styles.longButtonTextStyle}
            onPress={() => this.setState({dateSelected: false})}/>
          />
            <EventList apicall={'https://api.muncieevents.com/v1/events?start='+this.getFormattedDate()+'&end='+this.getFormattedDate()+'&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'} />
            </View> 
            )
        }
        else{
          results = (   
            <View>        
            <Text style={Styles.title}>
            EVENTS
            </Text>
            <CustomButton 
            text="Go Back"
            buttonStyle = {Styles.longButtonStyle}
            textStyle = {Styles.longButtonTextStyle}
            onPress={() => this.setState({eventView: null})}/>
          />
            <EventList apicall={'https://api.muncieevents.com/v1/events?start='+this.state.formattedDate+'&end='+this.state.formattedDate+'&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'} />
            </View> 
            )
        }

      }
      else{
        results = null
      }
      return results
    }

    getDatePicker(){
      if(Platform.OS == 'ios'){
        return (
              <View>
                <DatePickerIOS 
                  date={this.state.chosenDate}
                  onDateChange={this.setDate}
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
          this.setDate(newDate);
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

    getFormattedDate(){
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
      return year + '-' + month + '-' + day;
    }
}