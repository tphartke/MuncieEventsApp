import React, {Component} from 'react';  
import {ActivityIndicator, View, Text} from 'react-native';

export default class LoadingScreen extends Component{

    render(){
        return(
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <ActivityIndicator size="large" color="#cd5128"/>
                <Text style={{flex:1}}>Loading from MuncieEvents server...</Text>
            </View>
        );
    }

}