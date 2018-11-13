import React from 'react';
import {Text, View, Button, navigation, WebView} from 'react-native';
import TopBar from './top_bar';

export default class Contact extends React.Component {
    eventData = this.props.navigation.getParam('event', 'No event found');
    render() {
      return (
        <View style={{flex:1, paddingTop:20}}>
            <View style={{height: 50, flexDirection: 'row'}}>
              <Button style={{flex: 1}}
                title="Menu"
                onPress={() =>
                this.props.navigation.openDrawer()
                }
              />
              <TopBar />

            </View>
            <View style={{flex:1, paddingTop:30}}>
            <Button
              title = "Go back"
              onPress={() => this.props.navigation.goBack()}
              style={{flex:1}}
            />
                  <Text> 
                    Contact
                    {"\n"}
                  </Text>
                  <Text style={{fontSize:30, fontWeight:'bold'}}>
                    {this.eventData.attributes.title}
                    {"\n"}
                  </Text>
                  <WebView
                    originWhitelist={['*']}
                    source={{ html: this.eventData.attributes.description }}
                  />
            </View>
        </View>
      )
    }
}