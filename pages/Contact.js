import React from 'react';
import {Text, View, TextInput} from 'react-native';
import CustomButton from "./CustomButton";
import TopBar from './top_bar';
import Styles from './Styles';

export default class Contact extends React.Component {
    constructor(props){
      super(props)
      this.state = ({message: ""})
      this.state = ({email: ""})
      this.state = ({name: ""})
      this.state = ({messageSent: false})
      this.state = ({statusMessage: ""})
      this.url = "https://api.muncieevents.com/v1/contact?name=tphartke?email=tphartke@bsu.edu?body=hello?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
    }
    render() {
      return (
        <View style={Styles.topBarPadding}>
          <TopBar />
          <Text style={Styles.title}>
            Contact Us
          </Text>
          <View style={Styles.content}>
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

            <CustomButton text="Send" onPress = {() => this.sendMessage()} />
            <Text>{this.state.statusMessage}</Text>
          
          </View>
        </View>

      )
    }
  sendMessage(){
    if(this.meetsMessageCriteria()){
      this.setState({messageSent: true, statusMessage: "Message Sent. Thanks for your feedback!"});
      this.fetchAPIData("https://api.muncieevents.com/v1/contact?name=" + this.state.name + "?email=" + this.state.email + "?body=" + this.state.message + "?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ")
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

  fetchAPIData(url){
    fetch(url, {method: "POST"})      
    .catch((error) =>{
        console.log(error)
       this.setState({statusMessage: "Error reaching server: " + error})
    });
  }  
}
