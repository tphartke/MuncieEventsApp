import React from 'react';
import{ withNavigation } from "react-navigation";
import DateAndTimeParser from "./DateAndTimeParser";
import {View, ActivityIndicator, Text, TouchableOpacity, FlatList} from 'react-native';
import * as Animatable from 'react-native-animatable'
import Styles from './pages/Styles';
import ExpandedView from './pages/ExpandedView'

class EventList extends React.Component {
    constructor(props){
        super(props);
        this.state ={ isLoading: true}
        this.state ={lastUsedDate: null}
        this.state = {text: ''}
        this.state = {apicall: ''}
        this.state = {selectedEvent: null}
        this.dateAndTimeParser = new DateAndTimeParser();
      }

      fetchAPIData(url){
        return fetch(url)        
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

      getEventDataView(dataSource){
        return(
          <View >
            <Text style={Styles.title}>
              EVENTS
            </Text>
            <FlatList
              data={dataSource}
              renderItem={({item}) => 
                this.generateEventEntryView(item)
              }
            />
          </View>
        );
      }

      render(){
        if(!this.state.apicall){
            this.setState({apicall: this.props.apicall});
            this.fetchAPIData(this.props.apicall);
        }
        var contentView = this.getDisplayedPage();
        return (
          <View>
            {contentView}
          </View>
        );
      }

      getDisplayedPage(){
        var contentView = this.getLoadingView();
        if(!this.state.isLoading && !this.state.selectedEvent){
          contentView = this.getEventDataView(this.state.dataSource);
        }
        if(this.state.selectedEvent){
          contentView = this.getExpandedView();
        }
        return contentView;
      }

      getExpandedView(){
        return(<ExpandedView event={this.state.selectedEvent} previousScreen={this.state.apicall}/>)
      }

      generateEventEntryView(eventEntry){   
        var date = this.setDateText(eventEntry);
        var listText = this.setEventEntryText(eventEntry);
        return(
          <Animatable.View animation = "slideInRight" duration = {700}>
            <Text style={Styles.dateText}>
              {date}
            </Text>           
             <TouchableOpacity onPress={() => this.setState({selectedEvent: eventEntry})} style={Styles.eventRow}>
               <Text>
                {listText}
               </Text>
             </TouchableOpacity>
             </Animatable.View>
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
          date = "\n" + this.dateAndTimeParser.formatDate(eventEntry.attributes.date);
          this.state = {lastUsedDate: eventEntry.attributes.date};
        }
        return date;
      }

      isNewDate(date){
        return date != this.state.lastUsedDate;
      }
} 
export default withNavigation(EventList);