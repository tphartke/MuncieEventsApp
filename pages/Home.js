import React from 'react';
import {View, ActivityIndicator, Text, TouchableOpacity, FlatList} from 'react-native';
import EventRender from "../EventRenderer"
import TopBar from './top_bar';
import DateAndTimeParser from "../DateAndTimeParser"
import * as Animatable from 'react-native-animatable'

export default class HomeScreen extends React.Component{  
    constructor(props){
        super(props);
        this.state ={ isLoading: true}
        this.state ={lastUsedDate: null}
        this.state = {text: ''};
        this.eventRender = new EventRender();
        this.dateAndTimeParser = new DateAndTimeParser();
      }

      componentDidMount(){
        this.fetchAPIData('https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ');
        this.setState({isLoading: false});
      }

      render(){
        var contentView = this.getLoadingView();
        if(!this.state.isLoading){
          contentView = this.getEventDataView();
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

      getEventDataView(){
        return(
          <View >
            <Text style={{textAlign:"center", fontSize:30, fontWeight:"bold", color:'#efe0d5', backgroundColor: '#cb532b'}}>
              EVENTS
            </Text>
            <FlatList
              data={this.state.dataSource}
              renderItem={({item}) => 
                this.generateEventEntryView(item)
              }
            />
          </View>
        );
      }

      getLoadingView(){
        return(
            <View style={{flex: 1, padding: 20}}>
              <ActivityIndicator/>
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