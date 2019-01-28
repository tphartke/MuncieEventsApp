import React from 'react';
import {Text, View} from 'react-native';
import TopBar from './top_bar';
import Styles from './Styles';


export default class AddEditEvent extends React.Component {
    render() {
      return (
        <View style={Styles.topBarPadding}>
            <View>
                <TopBar />
            </View>
            <View>
                <Text style={Styles.title}>
                    Add or Edit Events
                </Text>
            </View>
        </View>
      )
    }
}