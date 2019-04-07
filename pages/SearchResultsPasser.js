import React from 'react';
import {View} from 'react-native';
import Styles from './Styles';
import TopBar from './top_bar';
import LoadingScreen from '../components/LoadingScreen';

export default class SearchResultsPasser extends React.Component{

    //NOTE This page is a middle man for navigational purposes. All it does is pass the URL to the main search page. Whenever you are searching, navigate to this page instead.

    componentDidMount(){
        const {navigation} = this.props;
        const userInput = navigation.getParam('searchInput', 'No Results Found')
        this.props.navigation.navigate("Search Results", {searchInput: userInput});
    }
    
    render(){
        return(
            <View style={Styles.wrapper}>
                <View style={Styles.topBarWrapper}>
                    <TopBar/>
                </View>
                <View style={Styles.mainViewContent}>
                    <LoadingScreen/>
                </View>
            </View>
        )
    }
}