import React from 'react';
import {Text, View, Button, navigation, WebView, ScrollView} from 'react-native';
import TopBar from './top_bar';
import DateAndTimeParser from "../DateAndTimeParser"

export default class Contact extends React.Component {
    eventData = this.props.navigation.getParam('event', 'No event found');
    constructor(props){
        super(props);
        this.dateAndTimeParser = new DateAndTimeParser();
      }
        
    render() {
      return (
        <View style={{flex:1, paddingTop:20}}>
            <View style={{height: 50, flexDirection: 'row'}}>
              <Button style={{flex: 1}}
                title="Menu"
                onPress={() =>
                this.props.navigation.openDrawer()
                }
              />
              <TopBar />

            </View>
            <ScrollView>
            <View style={{flex:1, paddingTop:30}}>
                  <Button 
                      title = "Go back"
                      onPress={() => this.props.navigation.goBack()}
                      style={{flex:1}}
                  />
                  <Text style={{fontSize:35, fontWeight:'bold'}}>
                    {this.eventData.attributes.title}
                    {"\n"}
                  </Text>
                  <WebView
                    originWhitelist={['*']}
                    source={{ html: this.eventData.attributes.description }}
                  />
                  <Text style={{fontSize:22, fontWeight:'bold'}}>
                  {"\n"}  
                  Location
                  {"\n"}  
                  </Text>
                  <Text>{this.eventData.attributes.location }</Text>
                  <Text style={{fontSize:22, fontWeight:'bold'}}>
                  {"\n"}  
                  Date
                  {"\n"}  
                  </Text>
  
                  <Text> {this.dateAndTimeParser.formatDate(this.eventData.attributes.date)} </Text>

                  <Text style={{fontSize:22, fontWeight:'bold'}}>
                  {"\n"}  
                  Start Time
                  {"\n"}  
                  </Text>

                  <Text> {this.dateAndTimeParser.extractTimeFromDate(this.eventData.attributes.time_start)} </Text>
       
                  <Text style={{fontSize:22, fontWeight:'bold'}}>
                  {"\n"}  
                  End Time
                  {"\n"}  
                  </Text>
                  
                  <Text>{this.getFormattedEndDate()}</Text>
            </View>
            </ScrollView>
        </View>
      )
    }
    getFormattedEndDate(){
      if(this.eventData.attributes.time_end){
        return this.dateAndTimeParser.extractTimeFromDate(this.eventData.attributes.time_end);
      }
      else{
        return 'N/A'
      }
}
}