import React from 'react';
import{ withNavigation } from "react-navigation";
import DateAndTimeParser from "./DateAndTimeParser";
import {View, Text, TouchableOpacity, FlatList, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Styles from './pages/Styles';
import ExpandedView from './pages/ExpandedView';
import APICacher from './APICacher';
import PropTypes from 'prop-types';
import LoadingScreen from './components/LoadingScreen';

class EventList extends React.Component {
    constructor(props){
        super(props);
        this.state ={
          isLoading: true,
          lastUsedDate: null,
          selectedEvent: null,
        }
        this.dateAndTimeParser = new DateAndTimeParser();
        this._getCachedDataAsync = this._getCachedDataAsync.bind(this);
        this.APICacher = new APICacher();
      }

    componentDidMount(){
      this._getCachedDataAsync()
    }

    getLoadingView(){
        return(
            <View>
              <LoadingScreen/>
            </View>
          );   
      }

      getEventDataView(){
        dataSource = this.state.dataSource
        return(
          <View>
            <FlatList
              style={Styles.eventList}
              data={dataSource}
              renderItem={({item}) => 
                this.generateEventEntryView(item)
              }
              ListEmptyComponent={() => this.noEventsFound()}
            />
          </View>
        );
      }

      noEventsFound(){
        return(
          <Text>No events found</Text>
        );
      }

      render(){
        if(this.state.isLoading){
          contentView = this.getLoadingView()
        }
        else{
          contentView = this.getDisplayedPage();
        }
        return (
          <View>
            {contentView}
          </View>
        );
      }

      async _getCachedDataAsync(){
        const {useSearchResults} = this.props;
        key = "APIData"
        if (useSearchResults){
          key = "SearchResults"
        }
        data = await this.APICacher._getJSONFromStorage(key);
        this.setState({dataSource: data, isLoading:false})
      }

      getDisplayedPage(){
        if(!this.state.selectedEvent){
          contentView = this.getEventDataView();
        }
        if(this.state.selectedEvent){
          contentView = this.getExpandedView();
        }
        return contentView;
      }

      getExpandedView(){
        const {useSearchResults} = this.props;
        return(<ExpandedView event={this.state.selectedEvent} isFromSearch = {useSearchResults}/>)
      }

      generateEventEntryView(eventEntry){   
        var date = this.setDateText(eventEntry);
        var listText = this.setEventEntryText(eventEntry);
        if(eventEntry.attributes.images[0] == null){
          imageURL = "None"
        }else{
          imageURL = eventEntry.attributes.images[0].tiny_url
        }
        return(
          <Animatable.View animation = "slideInRight" duration = {700}>
            <Text style={Styles.dateText}>
              {date}
            </Text>           
             <TouchableOpacity onPress={() => this.setState({selectedEvent: eventEntry})} style={Styles.eventRow}>
              <View style={{flexDirection:'row', flex:1}}>
                {this.getCategoryImage(eventEntry)}
               <Text style={Styles.eventRowText}>
                {listText}
               </Text>
               {this.getURLImage(imageURL)}
               </View>
             </TouchableOpacity>
            </Animatable.View>
        )
      }

      getCategoryImage(eventEntry){
        category = ""
        switch(eventEntry.attributes.category.name){
          case "Music":
          return(
            <View>
              <Image
              style={{flex: 1, resizeMode: 'contain', width: 60, height: 60}}
              source={require('./assets/MuncieEventsAppIcons/music.png')}
              />
            </View>
            )
          case "Art":
            return(
              <View>
                <Image
                  style={{flex: 1, resizeMode: 'contain', width: 60, height: 60}}
                  source ={require('./assets/MuncieEventsAppIcons/art.png')}
                />
              </View>
            )
          case "Activism":
          return(
            <View>
              <Image
              style={{flex: 1, resizeMode: 'contain', width: 60, height: 60}}
              source ={require('./assets/MuncieEventsAppIcons/activism.png')}
              />
            </View>
            )
          case "Theater":
          return(
            <View>
              <Image
              style={{flex: 1, resizeMode: 'contain', width: 60, height: 60}}
              source ={require('./assets/MuncieEventsAppIcons/theater.png')}
              />
            </View>
            )
          case "Film":
          return(
            <View>
              <Image
              style={{flex: 1, resizeMode: 'contain', width: 60, height: 60}}
              source ={require('./assets/MuncieEventsAppIcons/film.png')}
              />
            </View>
            )
          case "Sports":
          return(
            <View>
              <Image
              style={{flex: 1, resizeMode: 'contain', width: 60, height: 60}}
              source ={require('./assets/MuncieEventsAppIcons/sports.png')}
              />
            </View>
            )
          case "Education":
          return(
            <View>
              <Image
              style={{flex: 1, resizeMode: 'contain', width: 60, height: 60}}
              source ={require('./assets/MuncieEventsAppIcons/education.png')}
              />
            </View>
            )
          case "Government":
          return(
            <View>
              <Image
              style={{flex: 1, resizeMode: 'contain', width: 60, height: 60}}
              source ={require('./assets/MuncieEventsAppIcons/government.png')}
              />
            </View>
            )
          case "Religion":
          return(
            <View>
              <Image
              style={{flex: 1, resizeMode: 'contain', width: 60, height: 60}}
              source ={require('./assets/MuncieEventsAppIcons/religion.png')}
              />
            </View>
            )
          default:
          return(
            <View>
              <Image
              style={{flex: 1, resizeMode: 'contain', width: 60, height: 60}}
              source ={require('./assets/MuncieEventsAppIcons/general.png')}
              />
            </View>
            )
        }
      }

      setEventEntryText(eventEntry) {
        var title = eventEntry.attributes.title;
        var startTimeText = this.dateAndTimeParser.extractTimeFromDate(eventEntry.attributes.time_start);
        var endTimeText = "";
        var locationText = eventEntry.attributes.location;
        if (eventEntry.attributes.time_end != null) {
          endTimeText = " to " + this.dateAndTimeParser.extractTimeFromDate(eventEntry.attributes.time_end);
        }
        var listText = title + '\n' + startTimeText + endTimeText + "\n" + locationText;
        return listText;
      }

      setDateText(eventEntry){
        var date = null;
        if(this.isNewDate(eventEntry.attributes.date)){
          date = "\n" + this.dateAndTimeParser.formatDate(eventEntry.attributes.date);
          this.state = {lastUsedDate: eventEntry.attributes.date};
        }
        return date;
      }

      isNewDate(date){
        return date != this.state.lastUsedDate;
      }

      getURLImage(imageURL){
        if(imageURL == "None"){
          return
        }else{
         return(
          <View>
            <Image
            style={Styles.eventRowImage}
            source = {{uri: imageURL}}
            />
          </View>
          ) 
         }
       }
} 
export default withNavigation(EventList);

EventList.propTypes = {
  useSearchResults: PropTypes.bool
};

EventList.defaultPropts = {
  useSearchResults: false
}