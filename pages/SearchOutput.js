import React from 'react';
import EventList from "../EventList"

export default class SearchOutput extends React.Component {
    constructor(props){
        super(props);
        this.state = {SearchInput: this.props.navigation.getParam('searchInput', '')};
    }

    render(){
        return(
            <EventList 
                apicall={'https://api.muncieevents.com/v1/events/search?q=' + this.state.SearchInput +  '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'}
            />
        );
    }
}