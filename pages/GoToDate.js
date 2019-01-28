import React from 'react';
import {Text, View, Button, Platform, DatePickerAndroid, DatePickerIOS, ActivityIndicator, FlatList, TouchableHighlight} from 'react-native';
import TopBar from './top_bar';
import DateAndTimeParser from "../DateAndTimeParser";
import CustomButton from "./CustomButton";
import Styles from './Styles';

export default class GoToDate extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
    this.state ={lastUsedDate: null}
    this.state = {chosenDate: new Date()}
    this.setDate = this.setDate.bind(this);
    this.dateAndTimeParser = new DateAndTimeParser();
  }

    render() {
      var contentView = this.getLoadingView();
      if(!this.state.isLoading){
        contentView = this.getEventDataView();
      }
      return (
        <View>
          <TopBar />
          <Text style={Styles.title}>
            EVENTS
          </Text>
          <View style={Styles.content}>
            {this.getDatePicker()}
            {contentView}
          </View>
        </View>
      )
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
                  onPress={() => {this.fetchAPIData(this.getFormattedDate());}}
                  buttonStyle={Styles.longButtonStyle}
                  textStyle={Styles.longButtonTextStyle}
                  />
              </View>)
      }
      else if(Platform.OS == 'android'){ 
        return(
          <CustomButton
              text="Select Date"
              onPress={() => {this.getAndroidDatePicker();}}
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
          formattedDate = this.getAndroidFormattedDate(newDate);
          this.fetchAPIData(formattedDate);
          this.setDate(newDate);
        }
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
    }

    setDate(newDate) {
      this.setState({chosenDate: newDate});
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

    fetchAPIData(date){
      return fetch('https://api.muncieevents.com/v1/events?start='+date+'&end='+date+'&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1')
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            dataSource: responseJson.data,
          }, function(){});
        })
        .catch((error) =>{
          console.error(error);
        });
    }

    getLoadingView(){
      return(
        <View style={Styles.loadingViewPadding}>
          <ActivityIndicator/>
        </View>
      );
    }

    getEventDataView(){
      return(
        <View style={{paddingTop: 20}}>
          <FlatList
            data={this.state.dataSource}
            renderItem={({item}) => 
              this.generateEventEntryView(item)
            }
            ListEmptyComponent={() => this.noEventsOnThisDay()}
          />
        </View>
      );
    }

    noEventsOnThisDay(){
      return(
        <Text>No Events found for this day</Text>
      );
    }

    generateEventEntryView(eventEntry){   
      var date = this.setDateText(eventEntry);
      var listText = this.setEventEntryText(eventEntry);
  
      return(
        <View>
          <Text style={Styles.dateText}>
            {date}
          </Text>
          <TouchableHighlight onPress={() => this.goToFullView(eventEntry)} style={Styles.eventRow}>
            <Text>
              {listText}
            </Text>
          </TouchableHighlight>
        </View>
      )
    }

    setEventEntryText(eventEntry) {
      var title = eventEntry.attributes.title;
      var startTimeText = this.dateAndTimeParser.extractTimeFromDate(eventEntry.attributes.time_start);
      var endTimeText = "";
      var locationText = eventEntry.attributes.location;
      if (eventEntry.attributes.time_end != null) {
        endTimeText = " to " + this.dateAndTimeParser.extractTimeFromDate(eventEntry.attributes.time_end);
      }
      var listText = title + '\n' + startTimeText + endTimeText + " @ " + locationText;
      return listText;
    }

    setDateText(eventEntry){
      var date = null;
      if(this.isNewDate(eventEntry.attributes.date)){
        date = this.dateAndTimeParser.formatDate(eventEntry.attributes.date) + "\n";
        this.state = {lastUsedDate: eventEntry.attributes.date};
      }
      return date;
    }

    isNewDate(date){
      return date != this.state.lastUsedDate;
    }

    goToFullView(eventEntry){
      return this.props.navigation.navigate('ExpandedView', {
        event: eventEntry,
      });
    }
}