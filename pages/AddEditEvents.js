import React from 'react';
import {Text, View, TextInput, ScrollView} from 'react-native';
import Styles from './Styles';
import CustomButton from "./CustomButton";
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import EventList from '../EventList'
import AddEventsForm from "../components/AddEventsForm"

export default class AddEditEvent extends React.Component {
    constructor(props){
        super(props)
        this.state = ({url: "",
                       text: ""})
      }

    render() {
        AddEventsView = null
        searchView = null
        if(this.state.url){
            searchView = this.getSearchView()
        }
        else{
            AddEventsView = this.getAddEventsView()
        }
        return (
            <View style={Styles.wrapper}>
            <View style={Styles.topBarWrapper}>
                <Animatable.View animation = "slideInRight" duration={500} style={Styles.topBarContent}>
                    <CustomButton
                        text="Menu"
                        onPress={() => this.props.navigation.openDrawer()}/>
                    <TextInput
                        placeholder=' Search'
                        value={this.state.text} 
                        style={Styles.searchBar}
                        onChangeText={(text) => this.setState({text})}
                        onBlur={() => this.setState({url:'https://api.muncieevents.com/v1/events/search?q=' + this.state.text +  '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'})}
                        showLoading='true'
                    />
                    <Icon name="ios-search" style={Styles.iosSearch}/>
                </Animatable.View>
                </View>
                {searchView}
                <Text style={Styles.title}>
                    Add an Event
                </Text>
                <ScrollView style={Styles.content}>
                    {AddEventsView}
                </ScrollView>
            </View>
      );
    }

    getAddEventsView(){
        return(
            <View>
                <AddEventsForm />
            </View>
        )
    }

    getSearchView(){
        return(
          <View>
            <CustomButton 
              text="Go Back"
              buttonStyle = {Styles.longButtonStyle}
              textStyle = {Styles.longButtonTextStyle}
              onPress={() => this.setState({url: ""})}/>
            />
            <EventList apicall={this.state.url} />
          </View>
        )
      }
}