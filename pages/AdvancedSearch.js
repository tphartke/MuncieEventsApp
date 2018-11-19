import React from 'react';
import {View, Button} from 'react-native';
import TopBar from './top_bar';

export default class AdvancedSearch extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <View style={{paddingTop:20}}>
        <View style={{height: 50, flexDirection: 'row'}}>
          <Button
            title="Menu"
            onPress={() =>
            this.props.navigation.openDrawer()
            }
          />
          <TopBar />
        </View>
      </View>
    );
  }
}