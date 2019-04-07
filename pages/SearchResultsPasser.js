import React from 'react';
import {View} from 'react-native';
import Styles from './Styles';
import TopBar from './top_bar';
import LoadingScreen from '../components/LoadingScreen';

export default class SearchResultsPasser extends React.Component{

    componentDidMount(){
        const {navigation} = this.props;
        const searchURL = navigation.getParam('searchURL', 'No URL Found')
        this.props.navigation.navigate("Search Results", {searchURL: searchURL});
    }
    
    render(){
        return(
            <View style={Styles.wrapper}>
                <View style={{flex:.15}}>
                    <TopBar/>
                </View>
                <View style={{flex:.75}}>
                    <LoadingScreen/>
                </View>
            </View>
        )
    }
}