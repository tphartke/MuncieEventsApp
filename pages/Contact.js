import React from 'react';
import {Text, View, TextInput, Button} from 'react-native';
import CustomButton from "./CustomButton";
import TopBar from './top_bar';


export default class Contact extends React.Component {
    constructor(props){
      super(props)
      this.state = ({message: ""})
      this.state = ({email: ""})
      this.state = ({name: ""})
      this.state = ({messageSent: false})
    }
    render() {
      statusMessage = (<Text>Please enter a valid Email, Name and Message</Text>)
      if(this.meetsMessageCriteria()){
        statusMessage = (<Text>Success</Text>);
      }
      return (
        <View>
          <View>
            <TopBar />
          </View>
          <View>
          <Text>
            Contact Us
          </Text>

          <Text>Name</Text>
          <TextInput
            onChangeText={(name) => this.setState({name})}
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            placeholder="Name"
          />

          <Text>Email</Text>
          <TextInput
            onChangeText={(email) => this.setState({email})}
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            placeholder="Email"
          />

          <Text>Message</Text>
          <TextInput
            onChangeText={(message) => this.setState({message})}
            style={{height: 160, borderColor: 'gray', borderWidth: 1}}
            placeholder="Type message here..."
          />

          <CustomButton text="Send" onPress = {() => this.sendMessage()}></CustomButton>
          {statusMessage}
          
        </View>
      </View>

      )
    }
  sendMessage(){
    if(this.meetsMessageCriteria()){
      this.setState({messageSent: true})
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
}