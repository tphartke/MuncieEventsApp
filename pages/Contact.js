import React from 'react';
import {Text, View, Button, WebView, ScrollView} from 'react-native';
import TopBar from './top_bar';
import DateAndTimeParser from "../DateAndTimeParser"


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

export default class Contact extends React.Component {
    eventData = this.props.navigation.getParam('event', 'No event found');
    constructor(props){
        super(props);
        this.dateAndTimeParser = new DateAndTimeParser();
        this.state = {
          height:0
        }
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
                    
              {this.getTimeView()}
              {this.getLocationView()}
              {this.getDescriptionView()}       
            </View>
          </ScrollView>
        </View>
      )
    }


    onNavigationChange(event) {
      if (event.title) {
        const htmlHeight = Number(event.title)
        this.setState({height:htmlHeight});
      }
   }

   getTimeView(){
     return(
      <View>
        <Text style={{fontSize:22, fontWeight:'bold'}}>
          {"\n"}  
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
        <Text style={{fontSize:22, fontWeight:'bold'}}>
          {"\n"}  
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
        <Text style={{fontSize:22, fontWeight:'bold'}}>
          {"\n"}  
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
}