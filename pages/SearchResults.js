import React from 'react';
import EventList from "../EventList"
import {View, Text} from 'react-native';
import Styles from './Styles';
import APICacher from '../APICacher';
import TopBar from './top_bar';
import LoadingScreen from '../components/LoadingScreen';

export default class SearchResults extends React.Component{
    constructor(props){
        super(props)
        this.state={isLoading:true}
        const {navigation} = this.props;
        this.searchInput = navigation.getParam('searchInput', 'No Results Found')
    }

    componentDidMount(){
        beginningSearchURL = 'https://api.muncieevents.com/v1/events/search?q='
        endingSearchURL = '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'
        searchURL = beginningSearchURL + this.searchInput + endingSearchURL
        this._cacheSearchResults(searchURL)
    }

    render(){
        mainView = null
        if(this.state.isLoading){
            mainView = this.getLoadingView()
        }
        else{
            mainView = this.getSearchResultsView()
        }
        return(
            <View style={Styles.wrapper}>
                <View style={Styles.topBarWrapper}>
                    <TopBar/>
                </View>
                <View style={Styles.mainViewContent}>
                    <Text style={Styles.title}>Search Results For "{this.searchInput}"</Text>
                    {mainView}
                </View>
            </View>
            );
          }

    getLoadingView(){
        return(
            <View>
                <LoadingScreen/>
            </View>
        );
    }

    getSearchResultsView(){
        return(
            <View>
                <EventList useSearchResults = {true} style={Styles.eventList}/>
            </View>
        );
    }

    async _cacheSearchResults(searchURL){
        key = "SearchResults"
        this.APICacher = new APICacher();
        await this.APICacher._cacheJSONFromAPIAsync(key, searchURL)
        this.setState({isLoading:false})
    }
}