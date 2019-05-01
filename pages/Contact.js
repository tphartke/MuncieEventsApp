import React from 'react';
import {Text, View, TextInput} from 'react-native';
import CustomButton from "./CustomButton";
import Styles from './Styles';
import TopBar from './top_bar';
import InternetError from '../components/InternetError';
import APIKey from '../APIKey'

export default class Contact extends React.Component {
    constructor(props){
      super(props)
      this.state = ({message: '',
                     email: '',
                     name: '',
                     messageSent: false,
                     statusMessage: "",
                     failedToLoad:false
                    })
       this.APIKey = new APIKey();
    }


  render() {
    if(this.state.failedToLoad){
      contactView = this.getErrorMessage();
    }
    else if(this.state.messageSent){
      contactView = this.getMessageSentView();
    }
    else{
      contactView = this.getContactView();
    }
    return (
      <View style={Styles.wrapper}>
        <View style={Styles.topBarWrapper}>
          <TopBar/>
        </View>
        <View style={Styles.mainViewContent}>
          {contactView}
        </View>
      </View>
    );
  }

  getErrorMessage(){
    return(
      <InternetError onRefresh = {() => {
        this.setState({failedToLoad:false})
      }}/>
    );
  }

  getMessageSentView(){
    return(
      <View>
        <Text style={Styles.centeredSingleItemText}>{this.state.statusMessage}</Text>
      </View>)
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
        underlineColorAndroid="transparent"
      />

      <Text>Email</Text>
      <TextInput
        onChangeText={(email) => this.setState({email})}
        style={Styles.textBox}
        placeholder="Email"
        underlineColorAndroid="transparent"
      />

      <Text>Message</Text>
      <TextInput
      onChangeText={(message) => this.setState({message})}
      style={Styles.textArea}
      placeholder="Type message here..."
      multiline={true}
      underlineColorAndroid="transparent"
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
      this.setState({messageSent: true, statusMessage: "Message Sent. Thanks for your feedback!"})
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
    return !(this.state.name == "" || this.state.message == "" || !this.isValidEmail(this.state.email))
  }

  isValidEmail(email){
    //this is a regex expression compliant with the rfc that matches 99.99% of active email addresses
    rfc2822 = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return rfc2822.test(email);
  }

  fetchAPIData(){
      fetch("https://api.muncieevents.com/v1/contact?apikey="+this.APIKey.getAPIKey(), 
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
    .catch(error => this.setState({failedToLoad:true, statusMessage: "", messageSent:false}));
  }
}

