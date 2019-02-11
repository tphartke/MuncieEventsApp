import React from 'react';
import {Text, View, Platform, DatePickerAndroid, DatePickerIOS} from 'react-native';
import TopBar from './top_bar';
import CustomButton from "./CustomButton";
import EventList from "../EventList"
import Styles from './Styles';

export default class GoToDate extends React.Component {
  constructor(props){
    super(props);
    this.state = {formattedDate: '', 
                  lastUsedDate: null, 
                  chosenDate: new Date(), 
                  eventView: (<Text></Text>)
                }  
    this.dateSelected = false; 
    this.setDate = this.setDate.bind(this);
  }

    render() {
      return (
        <View style={Styles.topBarPadding}>
          <TopBar />
          <View style={Styles.content}>
            {this.getDatePicker()}
            {this.updateEventView()}
          </View>
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
            <EventList apicall={'https://api.muncieevents.com/v1/events?start='+this.state.formattedDate+'&end='+this.state.formattedDate+'&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'} />
            </View> 
            )
        }

      }
      else{
        results = (<Text></Text>)
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