import React from 'react';
import {Text, View, WebView, ScrollView, Image, AsyncStorage, Alert, Linking, TouchableOpacity, FlatList} from 'react-native';
import DateAndTimeParser from "../DateAndTimeParser";
import{ withNavigation } from "react-navigation";
import Styles from './Styles';
import CustomButton from './CustomButton';
import * as Animatable from 'react-native-animatable';
import EventList from '../EventList';
import LoadingScreen from '../components/LoadingScreen';
import EditEvents from './EditEvents';
import APICacher from '../APICacher';

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
                      deletingEvent: false,
                      userToken: "",
                      statusMessage: "", 
                      tagSearchurl: "",
                      searchResultsHaveBeenFound: true, 
                      isSearching: false}
        this.eventData = null
        this.state={selectedPreviousScreen:false}
        this.APICacher = new APICacher();
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
        if(this.state.isLoading){
          renderedInfo = this.getLoadingScreen();
        }
        else if(this.state.isSearching){
          renderedInfo = this.getLoadingScreen();
          url = 'https://api.muncieevents.com/v1/events/future?withTags[]='+  this.state.searchedTag + '&apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ'
          console.log(url)
          this._cacheSearchResultsAsync(url).catch(error =>  this.catchError())
        }
        else if(this.state.searchResultsHaveBeenFound){
          renderedInfo = this.getResultsView();
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
        );
    }

    getLoadingScreen(){
      return(
        <View>
          <LoadingScreen/>
        </View>
      );
    }

    getMainContent(){
      expandedView = null
      if(!this.state.deleteEvent){
        expandedView = this.getExpandedViewInformation(imageURL)
      }
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
            {expandedView}
            {this.state.statusMessage}
          </View>
        </View>
      );
    }

    getExpandedViewInformation(imageURL){
      categoryView = this.getCategoryView()
      initialView = this.getInitialView(imageURL)
      tags = this.getTags()
      finalView = this.getFinalView()
        return(
          <View>
            {categoryView}
            {initialView}
            {tags}
            {finalView}
          </View>
        )
    }

    getCategoryView(){
      return(
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={Styles.title}>{this.eventData.attributes.category.name}</Text>
            {this.getCategoryImage(this.eventData)}
        </View>
      )
    }

    getInitialView(imageURL){
      return(<View>
            {this.getEditEventButtons()}
            {this.getURLImage(imageURL)}
            {this.getCostView()}
            {this.getAgeRestrictions()}
            {this.getTimeView()}
            {this.getLocationView()}
            {this.getDescriptionView()}
      </View>)
    }

    getFinalView(){
        return(<View>
            {this.getSource()}
            {this.getAuthorView()}
            {this.padBottom()}
        </View>)
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
    if(this.eventData.attributes.tags){
      tags = []
      for(i = 0; i < this.eventData.attributes.tags.length; i++){
        tags.push(this.eventData.attributes.tags[i].name)
      }
      let tagView = tags.map((tag, key) => {
      return <View key={key}>
          <TouchableOpacity onPress={()=>this.setState({searchForTag: true, searchedTag: tag, isSearching: true})}>
              <Text style={{color: 'blue'}}>{tag}</Text>
          </TouchableOpacity>
        </View>}) 
     return(
             <View>
                <Text style={Styles.header}>Tags</Text>
                {tagView}
              </View>)
    }
    else{
      return null
    }
  }

  getTagView(tags){
    tagView = []
    for(i = 0; i < tags.length; i++){
      console.log(tagView)
      tagView.push(<View>
        <TouchableOpacity onPress={()=>this.setState({searchForTag: true, searchedTag: tags[i]})}>
           <Text style={{color: 'blue'}}>{tags[i]}</Text>
        </TouchableOpacity>
      </View>)
    }
    return tagView
  }


  getTagLink(tag){
    return(
      <View>
        <TouchableOpacity onPress={()=>this.setState({searchForTag: true, searchedTag: tag})}>
           <Text style={{color: 'blue'}}>{tag}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  getResultsView(){
    return(
      <View>        
        <CustomButton 
          text="Go Back"
          buttonStyle = {Styles.longButtonStyle}
          textStyle = {Styles.longButtonTextStyle}
          onPress={() => this.setState({searchResultsHaveBeenFound: false})}/>
        <View style={Styles.advancedSearchResults}>
          <EventList useSearchResults = {true}/>
        </View>
    </View>
  );}

   getSource(){
    if(this.eventData.attributes.source){
      return(<View>
                <Text style={Styles.header}>Source</Text>
                <TouchableOpacity onPress={()=>this.goToSource(this.eventData.attributes.source)}>
                    <Text style={{color: 'blue'}}>{this.eventData.attributes.source}</Text>
                </TouchableOpacity>
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
          {this.dateAndTimeParser.formatDate(this.eventData.attributes.date)}{"\n"}
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
          {this.eventData.attributes.location }
        </Text>
          <TouchableOpacity onPress={()=>this.openAddress(this.eventData.attributes.address)}>
            <Text style={{color: 'blue'}}>{this.getNullableAttribute(this.eventData.attributes.address)}</Text>
          </TouchableOpacity>
        <Text>
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
      const tkn = await AsyncStorage.getItem('Token');
      const utkn = await AsyncStorage.getItem('UniqueToken');
      this.setState({userid: tkn, userToken: utkn, isLoading: false})
     } catch (error) {
        console.log("Error retrieving token")
        this.setState({isLoading: false})
     }
  }

  getDeleteEventConfirmation(){
    Alert.alert(
      'Are you sure you want to delete this event?',
      '',
      [
        {text: 'No', onPress: () => {}, style: 'cancel'},
        {text: 'Yes', onPress: () => this.deleteEvent()},
      ]
    );
  }

  deleteEvent(){
      console.log("Deleting Event...")
      console.log(this.state.userToken)
      fetch("https://api.muncieevents.com/v1/event/"+this.eventData.id+"?userToken=" + this.state.userToken +"&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1", 
        {method: "DELETE",
        headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/json',
            },
    })
    .then((response) => response.json())
    .then((responseJson) => {this.getStatus(responseJson)
                              console.log(responseJson)})
  .catch((error)=>{
    console.log(error)
  });
  }

  getStatus(responseJson){
    try{
      this.setState({statusMessage: responseJson.errors[0].detail})
    }
    catch(error){
      this.setState({statusMessage: "Event Deleted. It may take up to half an hour for the changes to be reflected in the app.", eventDeleted: true})
    }

  }

  goToSource(source){
    url = source
    Linking.openURL(url)
}

openAddress(addressString){
  if(addressString){
    if(addressString.includes("Muncie, IN") || addressString.includes("Muncie, Indiana"))
    {
    url = "https://www.google.com/maps/search/?api=1&query=" + addressString
    Linking.openURL(url)
    }
    else{
      url = "https://www.google.com/maps/search/?api=1&query=" + addressString + " Muncie, IN"
      Linking.openURL(url) 
    }
  }
}

async _cacheSearchResultsAsync(searchURL){
  await this.APICacher._cacheJSONFromAPIAsync("SearchResults", searchURL)
  this.setState({searchResultsHaveBeenFound: true, isSearching: false});
}

getCategoryImage(eventEntry){
  category = ""
  switch(eventEntry.attributes.category.name){
    case "Music":
    return(
      <View>
        <Image
        style={Styles.categoryIcon}
        source={require('../assets/MuncieEventsAppIcons/music.png')}
        />
      </View>
      )
    case "Art":
      return(
        <View>
          <Image
            style={Styles.categoryIcon}
            source ={require('../assets/MuncieEventsAppIcons/art.png')}
          />
        </View>
      )
    case "Activism":
    return(
      <View>
        <Image
        style={Styles.categoryIcon}
        source ={require('../assets/MuncieEventsAppIcons/activism.png')}
        />
      </View>
      )
    case "Theater":
    return(
      <View>
        <Image
        style={Styles.categoryIcon}
        source ={require('../assets/MuncieEventsAppIcons/theater.png')}
        />
      </View>
      )
    case "Film":
    return(
      <View>
        <Image
        style={Styles.categoryIcon}
        source ={require('../assets/MuncieEventsAppIcons/film.png')}
        />
      </View>
      )
    case "Sports":
    return(
      <View>
        <Image
        style={Styles.categoryIcon}
        source ={require('../assets/MuncieEventsAppIcons/sports.png')}
        />
      </View>
      )
    case "Education":
    return(
      <View>
        <Image
        style={Styles.categoryIcon}
        source ={require('../assets/MuncieEventsAppIcons/education.png')}
        />
      </View>
      )
    case "Government":
    return(
      <View>
        <Image
        style={Styles.categoryIcon}
        source ={require('../assets/MuncieEventsAppIcons/government.png')}
        />
      </View>
      )
    case "Religion":
    return(
      <View>
        <Image
        style={Styles.categoryIcon}
        source ={require('../assets/MuncieEventsAppIcons/religion.png')}
        />
      </View>
      )
    default:
    return(
      <View>
        <Image
        style={Styles.categoryIcon}
        source ={require('../assets/MuncieEventsAppIcons/general.png')}
        />
      </View>
      )
  }
}

} export default withNavigation(ExpandedView)