import React from 'react';
import EventList from "../EventList"
import TopBar from '../pages/top_bar';
import Styles from '../pages/Styles';
import {View} from 'react-native';

export default class SearchOutput extends React.Component {
    constructor(props){
        super(props);
        this.state = {SearchInput: this.props.navigation.getParam('searchInput', '')};
    }

    render(){
        return(
            <View style={Styles.topBarPadding}>
            <TopBar />
            <EventList 
                apicall={'https://api.muncieevents.com/v1/events/search?q=' + this.state.SearchInput +  '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'}
            />
            </View>
        );
    }
}