import React, {Component} from 'react';  
import {View, Text, Picker, TextInput} from 'react-native';
import Styles from '../pages/Styles';

export default class AddEventsForm extends Component{


    render(){
        return(
            //Event
            <View>
                <View style={Styles.formRow}>
                    <Text style={Styles.formLabel}>Event: </Text>
                    <TextInput               
                        onChangeText={(event) => this.setState({event})}
                        style={[Styles.textBox, Styles.formEntry]}
                    />
                </View>
                <View style={Styles.formRow}>
                    <Text style={Styles.formLabel}></Text>
                </View>
            </View>
        );
    }
}