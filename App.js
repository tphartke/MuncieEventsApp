import React from 'react';
import {ActivityIndicator, Text, View, FlatList} from 'react-native';
import Moment from 'moment';
import TopBar from './pages/top_bar';

export default class FetchExample extends React.Component {


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
    var date = String(dateTime).split("T");
    var times = date[1].split("-");
    var timeUnformatted = times[0].split(":");
    var hours = timeUnformatted[0];
    var minutes = timeUnformatted[1];
    var modifier = "AM"
    if(hours > 12){
      hours -= 12;
      modifier = "PM";
    }
    var finalTime = hours + ":" + minutes + " " + modifier
    return finalTime;
  }

  isLastUsedDate(date){
    return date === this.state.lastUsedDate;
  }

  generateListItem(item){   
    var date = null;
    var title = item.attributes.title;
    var startTimeText = this.getTimeFromAPI(item.attributes.time_start);
    var endTimeText = "";
    var locationText = item.attributes.location;

    if(!this.isLastUsedDate(item.attributes.date)){
      date = this.formatDate(item.attributes.date) + "\n";
      this.state ={lastUsedDate: item.attributes.date}
    }

    if(!(item.attributes.time_end == null)){
        endTimeText = " to " + this.getTimeFromAPI(item.attributes.time_end);
    }

    var listText = title + '\n' + startTimeText + endTimeText + " @ " + locationText;

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

  formatDate(date){
    var dates = date.split("-");
    var year = dates[0];
    var day = dates[2];
    var month = this.getShorthandMonthByNumber(dates[1]);

    return month + " " + day + ", " + year;
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

  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    return(
      <View style={{flex: 10, paddingTop:20}}>
        <TopBar />
        <Text style={{textAlign:"center", fontSize:30, fontWeight:"bold"}}>
          Events:
        </Text>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => 
            this.generateListItem(item)
          }
          keyExtractor={({id}, index) => id}
        />
    </View>
    );
  }
}