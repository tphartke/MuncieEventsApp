import React, {Component} from 'react';  
import {ActivityIndicator, View, Text} from 'react-native';
import Styles from '../pages/Styles'

export default class LoadingScreen extends Component{

    render(){
        return(
            <View style={Styles.centeredSingleItemText}>
                <ActivityIndicator size="large" color="#cd5128"/>
                <Text>Loading...</Text>
            </View>
        );
    }

}