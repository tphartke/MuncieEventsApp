import React from 'react';
import EventList from "../EventList"

export default class HomeScreen extends React.Component{  
      render(){
        return(
        <EventList 
          apicall='https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ'
          />
        );
      } 
}