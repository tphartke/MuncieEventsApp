import React from 'react';
import EventList from "../EventList"
import {View, Text} from 'react-native';
import Styles from './Styles';
import APICacher from '../APICacher';
import TopBar from './top_bar';
import LoadingScreen from '../components/LoadingScreen';
import InternetError from '../components/InternetError';

export default class SearchResults extends React.Component{
    constructor(props){
        super(props)
        this.state={isLoading:true,
        failedToLoad: false}
        const {navigation} = this.props;
        this.searchInput = navigation.getParam('searchInput', 'No Results Found')
    }

    componentDidMount(){
        this._cacheSearchResults().catch(error => this.catchError())
    }

    catchError(){
        this.setState({isLoading:false, failedToLoad:true});
    }

    render(){
        mainView = null
        if(this.state.isLoading){
            mainView = this.getLoadingView()
        }
        else if(this.state.failedToLoad){
            mainView = this.getErrorMessage()
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
    
    getErrorMessage(){
        return(
            <InternetError onRefresh = {() => {
                this.setState({isLoading:true, failedToLoad:false})
                this._cacheSearchResults().catch(error => this.catchError())
            }}/>
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

    async _cacheSearchResults(){
        beginningSearchURL = 'https://api.muncieevents.com/v1/events/search?q='
        endingSearchURL = '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'
        searchURL = beginningSearchURL + this.searchInput + endingSearchURL
        key = "SearchResults"

        this.APICacher = new APICacher();
        await this.APICacher._cacheJSONFromAPIAsync(key, searchURL)
        this.setState({isLoading:false})
    }
}