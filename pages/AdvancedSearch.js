import React from 'react';
import {View, Button, Text, Picker, TextInput} from 'react-native';
import TopBar from './top_bar';

export default class AdvancedSearch extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <View style={{paddingTop:20}}>

        <View style={{height: 50, flexDirection: 'row'}}>
          <TopBar />
        </View>

        <Text style={{textAlign:"center", fontSize:30, fontWeight:"bold", color:'#efe0d5', backgroundColor: '#cb532b'}}>
            Advanced Search
        </Text>

        <View flexDirection='row' style={{paddingTop: 35, alignItems: 'center'}}>
        <TextInput
            placeholder='Event Name'
            style={{borderColor: 'black', borderWidth: 1, width: 320, backgroundColor: '#fff', paddingTop: 35, alignItems: 'center',
            justifyContent: 'center'}}
        />
        </View>

        <View style={{height: 150, flexDirection: 'row', paddingTop:20,  alignItems: 'center'}}>
          <View style={{flex:5}} >
            <Text>Tags: </Text>
          </View>
          <View style={{flex:5}}>
            <Picker>
              <Picker.Item label="18+" value="18+" />
              <Picker.Item label="Alcohol-free" value="Alcohol-free" />
            </Picker>
          </View>
        </View>

        <View style={{height: 150, flexDirection: 'row', paddingTop:20,  alignItems: 'center'}}>
          <View style={{flex:5}}>
            <Text>Category </Text>
          </View>
          <View style={{flex:5}}>
            <Picker>
              <Picker.Item label="Music" value="music" />
              <Picker.Item label="Food" value="food" />
            </Picker>
          </View>
        </View>

          <Button
            title="Search"
          />
      </View>
    );
  }
}