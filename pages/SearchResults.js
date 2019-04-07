import React from 'react';
import EventList from "../EventList"
import {View} from 'react-native';
import Styles from './Styles';
import APICacher from '../APICacher';
import TopBar from './top_bar';
import LoadingScreen from '../components/LoadingScreen';

export default class SearchResults extends React.Component{
    constructor(props){
        super(props)
        this.state={isLoading:true}
    }

    

    componentDidMount(){
        const {navigation} = this.props;
        const searchURL = navigation.getParam('searchURL', 'No URL Found')
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
                <View style={{flex:.15}}>
                    <TopBar/>
                </View>
                <View style={{flex:.75}}>
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