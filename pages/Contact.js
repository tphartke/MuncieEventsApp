import React from 'react';
import {Text, View, TextInput} from 'react-native';
import CustomButton from "./CustomButton";
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import EventList from '../EventList'
import Styles from './Styles';

export default class Contact extends React.Component {
    constructor(props){
      super(props)
      this.state = ({message: 'This is a test of the MuncieEvents app',
                     email: 'tphartke@bsu.edu',
                     name: 'Timothy Hartke',
                     messageSent: false,
                     statusMessage: "",
                     dataSource: "",
                     url: "",
                     text: ""})
    }
    render() {
      contactView = null
      searchView = null
      if(this.state.url){
        searchView = this.getSearchView();
      }
      else{
        contactView = this.getContactView();
      }
      return (
        <View style={Styles.topBarPadding}>
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
          {contactView}
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

  getContactView(){
    return(
    <View style={Styles.content}>
      <Text style={Styles.title}>
        Contact Us
      </Text>
      <Text>Name</Text>
      <TextInput
        onChangeText={(name) => this.setState({name})}
        style={Styles.textBox}
        placeholder="Name" 
      />

      <Text>Email</Text>
      <TextInput
        onChangeText={(email) => this.setState({email})}
        style={Styles.textBox}
        placeholder="Email"
      />

      <Text>Message</Text>
      <TextInput
      onChangeText={(message) => this.setState({message})}
      style={Styles.textArea}
      placeholder="Type message here..."
      />

      <CustomButton 
        text="Send" 
        onPress = {() => this.sendMessage()} 
        buttonStyle = {Styles.longButtonStyle}
        textStyle = {Styles.longButtonTextStyle}
      />
      <Text>{this.state.statusMessage}</Text>
    </View>)
  }

  sendMessage(){
    if(this.meetsMessageCriteria() && !this.state.messageSent){
      this.setState({messageSent: true, statusMessage: "Message Sent. Thanks for your feedback!"});
      this.fetchAPIData()
    }
    else if(this.state.messageSent){
      this.setState({statusMessage: "Message Sent. Thanks for your feedback!"});
    }
    else{
      this.setState({statusMessage: "Please enter a valid name, message, and email address"});
    }
  }

  meetsMessageCriteria(){
    if(this.state.name == "" || this.state.message == "" || !this.isValidEmail(this.state.email)){
        return false;
    }
    else{
      return true;
    }
  }

  isValidEmail(email){
    //this is a regex expression compliant with the rfc that matches 99.99% of active email addresses
    rfc2822 = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return rfc2822.test(email);
  }

  fetchAPIData(){
    fetch("https://api.muncieevents.com/v1/contact?apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1", 
      {method: "POST",
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        body: this.state.message
      }),
  })
  .then((response) => console.log(response))
  .then((responseJSON) => console.log(responseJSON))
    .catch((error) =>{
        console.log(error)
       this.setState({statusMessage: "Error reaching server: " + error})
    });
  }
}

