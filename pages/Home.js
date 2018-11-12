import React from 'react';
import {Text, View, FlatList, Button, TouchableHighlight, ActivityIndicator} from 'react-native';
import TopBar from './top_bar';

export default class HomeScreen extends React.Component{  
    constructor(props){
        super(props);
        this.state ={ isLoading: true}
        this.state ={lastUsedDate: null}
      }
      componentDidMount(){
        this.fetchAPIData();
      }

      render(){
        var contentView = this.getLoadingView();
        if(!this.state.isLoading){
          contentView = this.getEventDataView();
        }
        return (
          <View style={{paddingTop:20}}>
            <View style={{height: 50, flexDirection: 'row'}}>
              <Button
                title="Menu"
                onPress={() =>
                this.props.navigation.openDrawer()
                }
              />
              <TopBar />
            </View>
            {contentView}
          </View>
        );
      }

      fetchAPIData(){
        return fetch('https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ')
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

      getEventDataView(){
        return(
          <View style={{paddingTop: 20}}>
            <Text style={{textAlign:"center", fontSize:30, fontWeight:"bold", backgroundColor: '#ffa500'}}>
              Events:
            </Text>
            <FlatList
              data={this.state.dataSource}
              renderItem={({eventEntry}) => 
                this.generateEventEntryView(eventEntry)
              }
            />
          </View>
        );
      }

      generateEventEntryView(item){   
        var date = this.extractEventEntryDate(item);
        var listText = this.createEventEntryText(item);
    
        return(
          <View>
            <Text style={{fontWeight: 'bold', fontSize:20}}>
              {date}
            </Text>
            <TouchableHighlight onPress={() => this.goToFullView(item)} style={{backgroundColor:'#ddd', borderColor:'black', borderWidth:1}}>
              <Text>
                {listText}
              </Text>
            </TouchableHighlight>
          </View>
        )
      }

      createEventEntryText(eventEntry) {
        var title = eventEntry.attributes.title;
        var startTimeText = this.extractTimeFromDate(eventEntry.attributes.time_start);
        var endTimeText = "";
        var locationText = eventEntry.attributes.location;
        if (eventEntry.attributes.time_end != null) {
          endTimeText = " to " + this.extractTimeFromDate(eventEntry.attributes.time_end);
        }
        var listText = title + '\n' + startTimeText + endTimeText + " @ " + locationText;
        return listText;
      }

      
      extractEventEntryDate(eventEntry){
        var date = null;
        if(this.isNewDate(eventEntry.attributes.date)){
          date = this.formatDate(eventEntry.attributes.date) + "\n";
          this.state = {lastUsedDate: eventEntry.attributes.date};
        }
        return date;
      }

      isNewDate(date){
        return date != this.state.lastUsedDate;
      }

      formatDate(date){
        //date formate is yyyy-mm-dd
        var dates = date.split("-");
        var year = dates[0];
        var day = this.formatDayNumber(dates[2]);
        var month = this.getShorthandMonthByNumber(dates[1]);
        return month + " " + day + ", " + year;
      }

      formatDayNumber(dayNumber){
        dayNumber = this.filterOutZeroPadding(dayNumber);
        var daySuffix = this.deriveDayNumberSuffix(dayNumber);
        const formattedDayNumber = dayNumber + daySuffix;
        return formattedDayNumber;
      }
   
      filterOutZeroPadding(dateOrTimeNumber) {
        if (String(dateOrTimeNumber).charAt(0) == "0") {
          dateOrTimeNumber = String(dateOrTimeNumber).substring(1);
        }
        return dateOrTimeNumber;
      }
    
      deriveDayNumberSuffix(dayNumber) {
        const lastDigitLocation = String(dayNumber).length - 1;
        const dayNumberLastDigit = String(dayNumber).charAt(lastDigitLocation);
        var daySuffix = "th";
        if((dayNumber != "11") & (dayNumber != "12") & (dayNumber != "13")){
          switch (dayNumberLastDigit) {
            case ("1"):
              daySuffix = "st";
              break;
            case ("2"):
              daySuffix = "nd";
              break;
            case ("3"):
              daySuffix = "rd";
              break;
          }
        }
        return daySuffix;
      }

      getShorthandMonthByNumber(month){
        switch(month){
          case("01"):
            return "Jan";
          case("02"):
            return "Feb";
          case("03"):
            return "Mar";
          case("04"):
            return "Apr";
          case("05"):
            return "May";
          case("06"):
            return "Jun";
          case("07"):
            return "Jul";
          case("08"):
            return "Aug";
          case("09"):
            return "Sep";
          case("10"):
            return "Oct"
          case("11"):
            return "Nov";
          case("12"):
            return "Dec";
        }
      }

      static navigationOptions = {
        drawerLabel: 'Home',
      };

      goToFullView(eventEntry){
        return this.props.navigation.navigate('Contact', {
          event: eventEntry,
        });
      }
}
