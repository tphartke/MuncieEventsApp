import React from 'react';
import{ withNavigation } from "react-navigation";
import DateAndTimeParser from "./DateAndTimeParser";
import TopBar from './pages/top_bar';
import {View, ActivityIndicator, Text, TouchableOpacity, FlatList} from 'react-native';
import * as Animatable from 'react-native-animatable'

class EventList extends React.Component {
    constructor(props){
        super(props);
        this.state ={ isLoading: true}
        this.state ={lastUsedDate: null}
        this.state = {text: ''};
        this.state = {apicall: ''}
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
            <View style={{flex: 1, padding: 20}}>
              <ActivityIndicator/>
            </View>
          );   
      }

      getEventDataView(dataSource){
        return(
          <View >
            <Text style={{textAlign:"center", fontSize:30, fontWeight:"bold", color:'#efe0d5', backgroundColor: '#cb532b'}}>
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
        if(this.state.apicall.length == 0){
            this.setState({apicall: this.props.apicall});
            this.fetchAPIData(this.props.apicall);
        }
        console.log(this.state.apicall);
        var contentView = this.getLoadingView();
        if(!this.state.isLoading){
          contentView = this.getEventDataView(this.state.dataSource);
        }
        return (
          <View style={{paddingTop:20}}>
            <View>
              <TopBar />
            </View>
            {contentView}
          </View>
        );
      }

      generateEventEntryView(eventEntry){   
        var date = this.setDateText(eventEntry);
        var listText = this.setEventEntryText(eventEntry);
        return(
          <Animatable.View animation = "slideInRight" duration = {700}>
            <Text style={{fontWeight: 'bold', fontSize:20, marginHorizontal: 5,}}>
              {date}
            </Text>           
             <TouchableOpacity onPress={() => this.goToFullView(eventEntry)} style={{backgroundColor:'#ddd', fontSize: 14, borderColor:'black', borderWidth:1, paddingHorizontal: 10, borderRadius: 5, marginHorizontal: 5}}>
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

      goToFullView(eventEntry){
        return this.props.navigation.navigate('ExpandedView', {
          event: eventEntry,
        });
      }
} 
export default withNavigation(EventList);