import React from 'react';
import {ActivityIndicator, Text, View, FlatList} from 'react-native';
import Moment from 'moment';
import TopBar from './pages/top_bar';

export default class FetchExample extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
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

  generateListItem(item){   

    var title = item.attributes.title;
    var startTimeText = this.getTimeFromAPI(item.attributes.time_start);
    var endTimeText = null;
    var locationText = item.attributes.location;

    if(!(item.attributes.time_end == null)){
        endTimeText = " to " + this.getTimeFromAPI(item.attributes.time_end);
    }

    var listText = title + '\n' + startTimeText + endTimeText + " @ " + locationText;

    return(
      <Text>{listText} {'\n'}</Text>
    )
   
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