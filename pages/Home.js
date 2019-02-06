import React from 'react';
import EventList from "../EventList"
import {View} from 'react-native';
import TopBar from '../pages/top_bar';
import Styles from '../pages/Styles';

export default class HomeScreen extends React.Component{  
      render(){
        return(
        <View style={Styles.topBarPadding}>
          <TopBar />
          <EventList 
            apicall='https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ'
          />
        </View>

        );
      } 
}