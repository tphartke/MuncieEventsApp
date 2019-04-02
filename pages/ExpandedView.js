import React from 'react';
import {Text, View, WebView, ScrollView, Image, AsyncStorage, Alert} from 'react-native';
import DateAndTimeParser from "../DateAndTimeParser";
import{ withNavigation } from "react-navigation";
import Styles from './Styles';
import CustomButton from './CustomButton';
import * as Animatable from 'react-native-animatable';
import EventList from '../EventList';
import LoadingScreen from '../components/LoadingScreen';
import EditEvents from './EditEvents'


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
        this.state = {imageHeight:0,
                      imageWidth:0,
                      isLoading: true,
                      userid: "", 
                      editingEvent: false, 
                      deletingEvent: false}
        this.eventData = null
        this.previousScreen = null
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
          renderedInfo = (<EventList apicall = {this.previousScreen}/>)
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
            <View>
                <CustomButton 
                  text = "Go back"
                  buttonStyle={Styles.longButtonStyle}
                  textStyle = {Styles.longButtonTextStyle}
                  onPress={() => this.setState({editingEvent: false})}
                />
                <EditEvents />
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
            {this.getTimeView()}
            {this.getLocationView()}
            {this.getDescriptionView()}
            {this.getAuthorView()}
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

   getAuthorView(){
     try{
        authorName = this.eventData.attributes.user.name
     }
     catch(error){
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