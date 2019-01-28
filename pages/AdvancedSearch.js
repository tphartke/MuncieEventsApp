import React from 'react';
import {View, Text, Picker, TextInput} from 'react-native';
import TopBar from './top_bar';
import Styles from './Styles';
import CustomButton from './CustomButton'

export default class AdvancedSearch extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <View style={Styles.topBarPadding}>
        <View>
          <TopBar />
        </View>

        <Text style={Styles.title}>
          Advanced Search
        </Text>

        <View flexDirection='row' style={Styles.advancedSearchRow}>
          <TextInput
            placeholder='Event Name'
            style={Styles.textInput}
          />
        </View>

        <View style={Styles.advancedSearchRow}>
          <View style={Styles.advancedSearchColumn} >
            <Text>Tags: </Text>
          </View>
          <View style={Styles.advancedSearchColumn}>
            <Picker>
              <Picker.Item label="18+" value="18+" />
              <Picker.Item label="Alcohol-free" value="Alcohol-free" />
            </Picker>
          </View>
        </View>

        <View style={Styles.advancedSearchRow}>
          <View style={Styles.advancedSearchColumn}>
            <Text>Category </Text>
          </View>
          <View style={Styles.advancedSearchColumn}>
            <Picker>
              <Picker.Item label="Music" value="music" />
              <Picker.Item label="Food" value="food" />
            </Picker>
          </View>
        </View>

        <CustomButton
          text="Search"
          buttonStyle = {Styles.longButtonStyle}
          textStyle = {Styles.longButtonTextStyle}
        />
      </View>
    );
  }
}