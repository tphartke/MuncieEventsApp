import React from 'react';
import {Text, View, FlatList, Button} from 'react-native';
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
      fetchAPIData(){
        return fetch('https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ')
          .then((response) => response.json())
          .then((responseJson) => {
    
            this.setState({
              isLoading: false,
              dataSource: responseJson.data,
            }, function(){
    
            });
    
          })
          .catch((error) =>{
            console.error(error);
          });
      }

    getTimeFromAPI(dateTime){
        //time format is yyyy-mm-ddThh:mm:ss-04:00
        var date = String(dateTime).split("T");
        var times = date[1].split("-");
        var timeUnformatted = times[0].split(":");
        var hours = timeUnformatted[0];
        var minutes = timeUnformatted[1];
        var modifier = "AM";
        if(hours > 12){
          hours -= 12;
          modifier = "PM";
        }
        hours = this.filterOutZeroPadding(hours);
        var finalTime = hours + ":" + minutes + modifier;
        return finalTime;
      }
    
      isLastUsedDate(date){
        return date === this.state.lastUsedDate;
      }
    
      generateListItemView(item){   
        var date = this.generateListItemDate(item);
        var listText = this.generateListItemText(item);
    
        return(
          <View>
            <Text style={{fontWeight: 'bold', fontSize:20}}>
              {date}
            </Text>
            <View style={{backgroundColor:'#ddd', borderColor:'black', borderWidth:1}}>
              <Text>
                {listText}
              </Text>
            </View>
          </View>
        )
      }
    
      generateListItemDate(item){
        var date = null;
        if(!this.isLastUsedDate(item.attributes.date)){
          date = this.formatDate(item.attributes.date) + "\n";
          this.state = {lastUsedDate: item.attributes.date};
        }
        return date;
      }
    
      generateListItemText(item) {
        var title = item.attributes.title;
        var startTimeText = this.getTimeFromAPI(item.attributes.time_start);
        var endTimeText = "";
        var locationText = item.attributes.location;
        if (item.attributes.time_end != null) {
          endTimeText = " to " + this.getTimeFromAPI(item.attributes.time_end);
        }
        var listText = title + '\n' + startTimeText + endTimeText + " @ " + locationText;
        return listText;
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
    
      filterOutZeroPadding(dateOrTimeNumber) {
        if (String(dateOrTimeNumber).charAt(0) == "0") {
          dateOrTimeNumber = String(dateOrTimeNumber).substring(1);
        }
        return dateOrTimeNumber;
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
    
      render(){
        if(this.state.isLoading){
          return(
            <View style={{flex: 1, padding: 20}}>
              <ActivityIndicator/>
            </View>
          );
        }
        return (
            <View style={{paddingTop:20}}>
                <View style={{height: 50, flexDirection: 'row'}}>
              <Button style={{flex: 1}}
                title="Open"
                onPress={() =>
                this.props.navigation.openDrawer()
                }
              />
                <TopBar />
                <Button style={{flex: 1}}
                  title="Advanced Search"
                  onPress={() =>
                    this.props.navigation.navigate('AdvancedSearch')
                  }
                />
                </View>
                <Text style={{textAlign:"center", fontSize:30, fontWeight:"bold", backgroundColor: '#ffa500'}}>
                Events:
                </Text>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({item}) => 
                        this.generateListItemView(item)
                    }
                    keyExtractor={({id}, index) => id}
                />
            </View>
        );
      }
}
