import React from 'react';
import {Text, View, WebView, ScrollView, Image} from 'react-native';
import DateAndTimeParser from "../DateAndTimeParser";
import { NavigationActions } from 'react-navigation';
import{ withNavigation } from "react-navigation";
import Styles from './Styles';
import CustomButton from './CustomButton';
import * as Animatable from 'react-native-animatable';
import EventList from '../EventList'

const script = `
  <script>
    window.location.hash = 1;
      var calculator = document.createElement("div");
      calculator.id = "height-calculator";
      while (document.body.firstChild) {
          calculator.appendChild(document.body.firstChild);
      }
    document.body.appendChild(calculator);
    document.title = calculator.scrollHeight;
  </script>
`;
const style = `
  <style>
  body, html, #height-calculator {
      margin: 0;
      padding: 0;
  }
  #height-calculator {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
  }
  </style>
`;

class ExpandedView extends React.Component {
    constructor(props){
        super(props);
        this.dateAndTimeParser = new DateAndTimeParser();
        this.state = {height:0}
        this.eventData = null
        this.previousScreen = null
        this.state={selectedPreviousScreen:false}
      }

    render() {
      renderedInfo = this.getExpandedView()
      if(this.state.selectedPreviousScreen){
        renderedInfo = (<EventList apicall = {this.previousScreen}/>)
      }
      return(
        <View>
          {renderedInfo}
        </View>
      )

    }

    getExpandedView(){
      if(!this.eventData){
        this.eventData = this.props.event;
        this.previousScreen = this.props.previousScreen;
    }
    if(this.eventData.attributes.images[0] == null){
      imageURL = "None"
    }else{
      imageURL = this.eventData.attributes.images[0].full_url
    }
    return (
      <Animatable.View animation = 'slideInRight' duration = {600}>
        <ScrollView>
          <Text style={Styles.title}>
            {this.eventData.attributes.title}
          </Text>
          <View style={Styles.content}>
            <CustomButton 
              text = "Go back"
              buttonStyle={Styles.longButtonStyle}
              textStyle = {Styles.longButtonTextStyle}
              onPress={() => this.goBackOnce()}
            />
            {this.getURLImage(imageURL)}
            {this.getTimeView()}
            {this.getLocationView()}
            {this.getDescriptionView()}    
          </View>
        </ScrollView>
      </Animatable.View>
    )

    }

    goBackOnce(){
      if(!this.state.selectedPreviousScreen){
        this.setState({selectedPreviousScreen: true})
      }
    }

    onNavigationChange(event) {
      if (event.title) {
        const htmlHeight = Number(event.title)
        this.setState({height:htmlHeight});
      }
   }


   getURLImage(imageURL){
    if(imageURL == "None"){
      return
    }else{
     return(
      <View>
        <Image
        style={{width: 300, height: 500}}
        source = {{uri: imageURL}}
        />
      </View>
      ) 
     }
   }

   getTimeView(){
     return(
      <View>
        <Text style={Styles.header}> 
          When
        </Text>
        <Text> 
          {this.dateAndTimeParser.formatDate(this.eventData.attributes.date)} {"\n"}
          {this.dateAndTimeParser.extractTimeFromDate(this.eventData.attributes.time_start)}
          {this.getFormattedEndDate()}
        </Text>
      </View>
     );
   }

   getLocationView(){
    return(
      <View>
        <Text style={Styles.header}>  
          Where 
        </Text>
        <Text>
          {this.eventData.attributes.location } {"\n"}
          {this.getNullableAttribute(this.eventData.attributes.address)} {"\n"}
          {this.getNullableAttribute(this.eventData.attributes.location_details)}
        </Text> 
      </View>
    );
   }

   getDescriptionView(){
     return(
      <View>
        <Text style={Styles.header}>
          Description 
        </Text>
        <WebView
          originWhitelist={['*']}
          source={{ html: this.eventData.attributes.description + style + script }}
          style={{height:this.state.height}}
          scrollEnabled={false}
          javaScriptEnabled = {true}
          onNavigationStateChange={this.onNavigationChange.bind(this)}
        />
      </View>
     );
   }

   getNullableAttribute(eventAttribute){
    if(eventAttribute == null){
      return "";
    }
    return eventAttribute;
   }

   getFormattedEndDate(){
    if(this.eventData.attributes.time_end){
      return " to " + this.dateAndTimeParser.extractTimeFromDate(this.eventData.attributes.time_end);
    }
    return "";
  }
} export default withNavigation(ExpandedView)