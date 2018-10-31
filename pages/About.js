import React from 'react';
import {Text, View, Button} from 'react-native';
import TopBar from './top_bar';

export default class About extends React.Component {
    render() {
      return (
        <View style={{paddingTop:20}}>
            <View style={{height: 50, flexDirection: 'row'}}>
              <Button style={{flex: 1}}
                title="Open"
                onPress={() =>
                this.props.navigation.openDrawer()
                }
              />
                <TopBar />
                <Button style={{flex: 1}}
                  title="Advanced Search"
                  onPress={() =>
                    this.props.navigation.navigate('AdvancedSearchScreen')
                  }
                />
                </View>
            <Text> About </Text>
        </View>
      )
    }
}