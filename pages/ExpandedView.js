import React from 'react';
import {Text, View, WebView, ScrollView, Image, AsyncStorage, Alert, Linking} from 'react-native';
import DateAndTimeParser from "../DateAndTimeParser";
import{ withNavigation } from "react-navigation";
import Styles from './Styles';
import CustomButton from './CustomButton';
import * as Animatable from 'react-native-animatable';
import EventList from '../EventList';
import LoadingScreen from '../components/LoadingScreen';
import EditEvents from './EditEvents'

//All 3 scripts below are used as workarounds for a bug with WebViews not displaying in certain nested Views.
//Once React Native fixes these bugs, the scriptings can be removed
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

//This script is used to inject working links into the WebView, as the normal method can't be used due to a react native bug.
const injectScript = `
  (function () {
    window.onclick = function(e) {
      e.preventDefault();
      window.postMessage(e.target.href);
      e.stopPropagation()
    }
  }());
`;

class ExpandedView extends React.Component {
    constructor(props){
        super(props);
        this.dateAndTimeParser = new DateAndTimeParser();
        this.state = {imageHeight:0,
                      imageWidth:0,
                      isLoading: true,
                      userid: "", 
                      editingEvent: false, 
                      deletingEvent: false}
        this.eventData = null
        this.state={selectedPreviousScreen:false}

      }

    componentDidMount(){
      this.retrieveStoredToken()
    }

    render() {
      renderedInfo = this.getDisplayedScreen()
      return(<View style={Styles.expandedView}>{renderedInfo}</View>)
    }

    getDisplayedScreen(){
        renderedInfo = null
        if(this.state.isLoading != false){
          renderedInfo = this.getLoadingScreen();
        }
        else if(this.state.selectedPreviousScreen){
          useSearchResults = this.props.isFromSearch;
          renderedInfo = (<EventList useSearchResults = {useSearchResults}/>)
        }
        else if(this.state.editingEvent){
          renderedInfo = this.getEditEventsPage()
        }
        else{
          renderedInfo = this.getExpandedView()
        }
        return renderedInfo
    }

    getEditEventsPage(){
      return(
        <ScrollView style={Styles.content} nestedScrollEnabled={true}>
                <CustomButton 
                  text = "Go back"
                  buttonStyle={Styles.longButtonStyle}
                  textStyle = {Styles.longButtonTextStyle}
                  onPress={() => this.setState({editingEvent: false})}
                />
                <EditEvents eventData={this.eventData}/>
            </ScrollView>
      )
    }

    getExpandedView(){
      if(!this.eventData){
        this.eventData = this.props.event;
    }
    if(this.eventData.attributes.images[0] == null){
      imageURL = "None"
    }else{
      imageURL = this.eventData.attributes.images[0].full_url
    }
    mainContent = this.getMainContent()
    return (
        <ScrollView
          style={Styles.expandedView}
        >
          <Animatable.View animation = 'slideInRight' duration = {600}>
            {mainContent}
          </Animatable.View>
        </ScrollView>
      )
    }

    getLoadingScreen(){
      return(
        <View>
          <LoadingScreen/>
        </View>
      );
    }

    getMainContent(){
      return(
        <View>
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
            {this.getEditEventButtons()}
            {this.getURLImage(imageURL)}
            {this.getCostView()}
            {this.getAgeRestrictions()}
            {this.getTimeView()}
            {this.getLocationView()}
            {this.getDescriptionView()}
            {this.getTags()}
            {this.getSource()}
            {this.getAuthorView()}
            {this.padBottom()}
          </View>
        </View>
      );
    }

    getEditEventButtons(){
      eventAuthorID=""
      try{
        eventAuthorID=this.eventData.relationships.user.data.id
      }
      catch(error){
        eventAuthorID=''
      }
      currentUserCreatedEvent = ((this.state.userid == eventAuthorID) && (this.state.userid != ''))
      if(currentUserCreatedEvent){
        return(<View>
            <CustomButton 
              text = "Edit Event"
              buttonStyle={Styles.longButtonStyle}
              textStyle = {Styles.longButtonTextStyle}
              onPress={() => this.setState({editingEvent: true})}
            />
            <CustomButton 
              text = "Delete Event"
              buttonStyle={Styles.longButtonStyle}
              textStyle = {Styles.longButtonTextStyle}
              onPress={() => this.getDeleteEventConfirmation()}
            />
        </View>)
      }
      else{
        return null
      }
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
      <View style={{justifyContent: 'center', alignItems: 'center',}}>
        <Image
        style={{width: 400, height: 400, resizeMode: "contain"}}
        source = {{uri: imageURL}}
        />
      </View>
      ) 
     }
   }

   getCostView(){
    if(this.eventData.attributes.cost){
      return(<View>
                <Text style={Styles.header}>Cost</Text>
                <Text>{this.eventData.attributes.cost}</Text>
            </View>)
   }
   else{
      return null
   }
 }

   getAgeRestrictions(){
    if(this.eventData.attributes.age_restriction){
      return(<View>
                <Text style={Styles.header}>Age Restrictions</Text>
                <Text>{this.eventData.attributes.age_restriction}</Text>
            </View>)
    }
    else{
        return null
    }
   }

   getTags(){
     tagView = ""
     if(this.eventData.attributes.tags){
       tags = this.eventData.attributes.tags;
      for(i = 0; i < tags.length; i++){
        tagView += tags[i].name + ", "
      }
      tagView = tagView.slice(0, -2);
      return(<View>
        <Text style={Styles.header}>Tags</Text>
        <Text>{tagView}</Text>
      </View>)
     }
     else{
       return null
     }
   }

   getSource(){
    if(this.eventData.attributes.source){
      return(<View>
                <Text style={Styles.header}>Source</Text>
                <Text>{this.eventData.attributes.source}</Text>
            </View>)
    }
    else{
        return null
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

   padBottom(){
     return(
      <View>
        <Text>{"\n\n\n"}</Text>
      </View>
     )
   }

  //Opens link when called by WebView
  onMessage({ nativeEvent }) {
    const data = nativeEvent.data;
    if (data !== undefined && data !== null) {
      Linking.openURL(data);
    }
  } 

   getDescriptionView(){
     htmlDescription = this.eventData.attributes.description
     return(
      <View>
        <Text style={Styles.header}>
          Description 
        </Text>
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlDescription + style + script }}
          style={{height:this.state.height}}
          scrollEnabled={false}
          javaScriptEnabled = {true}
          injectedJavaScript={injectScript}
          onMessage = {this.onMessage}
          onNavigationStateChange={
            this.onNavigationChange.bind(this)
          }
        />
      </View>
     );
   }

   getAuthorView(){
     try{
        authorName = this.eventData.attributes.user.name
     }
     catch(error){
        authorName = "Anonymous"
     }
     if(authorName == null){
       authorName = "Anonymous"
     }
     return(<View>
               <Text style={Styles.header}>
                  Author 
              </Text>
              <Text>
                {authorName}
              </Text>
            </View>)
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

  retrieveStoredToken = async() => {
    try {
      const tkn = await AsyncStorage.getItem('Token')
      this.setState({userid: tkn, isLoading: false})
     } catch (error) {
       console.log("Error retrieving token")
        return "NULL"
     }
  }

  getDeleteEventConfirmation(){
    Alert.alert(
      'Are you sure you want to delete this event?',
      '',
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {text: 'Yes', onPress: () => this.setState({deletingEvent: true})},
      ]
    );
  }
} export default withNavigation(ExpandedView)