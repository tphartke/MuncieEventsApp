import React, {Component} from 'react';  
import {ActivityIndicator, View, Text} from 'react-native';

export default class LoadingScreen extends Component{

    render(){
        return(
            <View style={{flexDirection:'row', alignItems:'center', justifyContent: 'center',paddingTop: '50%'}}>
                <ActivityIndicator size="large" color="#cd5128"/>
                <Text>Loading...</Text>
            </View>
        );
    }

}