import React from 'react';
import {Text, View, TextInput} from 'react-native';
import CustomButton from './CustomButton';
import Styles from './Styles';
import InternetError from '../components/InternetError';

export default class ForgotPassword extends React.Component {
    constructor(props){
        super(props);
        this.state = ({ email: "",
                        statusMessage: "",
                        failedToLoad: false,
                        messageSent: false})
        dataSource = null
      }

      render(){
          displayedPage = null
          if(this.state.failedToLoad){
            <InternetError onRefresh={()=>{
                this.setState({failedToLoad:false})
            }}/>
          }
          if(this.state.messageSent){
                displayedPage = this.getMessageSentView();
          }
          else{
            displayedPage = this.getForgotPasswordView();
          }
          return(<View>{displayedPage}</View>)
          
      }

      getForgotPasswordView(){
        return (
            <View>
                <Text>Please enter the email associated with your account</Text>
                <TextInput
                    onChangeText={(email) => this.setState({email})}
                    style={Styles.textBox}
                    placeholder="Name"
                />
                <CustomButton 
                    text="Send Recovery Email" 
                    onPress={()=> this.sendForgotPasswordRequest()} 
                    buttonStyle={Styles.longButtonStyle}
                    textStyle={Styles.longButtonTextStyle}
                />
                <Text>{this.state.statusMessage}</Text>
            </View>
          );
      }

      getMessageSentView(){
          return(
                <View>
                    <Text style={Styles.centeredSingleItemText}>{this.state.statusMessage}</Text>
                </View>
          )
      }
    
      sendForgotPasswordRequest(){
        fetch("https://api.muncieevents.com/v1/user/forgot-password?apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1", 
            {method: "POST",
                headers: {
                    Accept: 'application/vnd.api+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: this.state.email})
        })
        .then((responseJson) => this.getStatus(responseJson))
        .catch((error) =>{
            this.setState({failedToLoad:true})
        })
      }

      getStatus(responseJson){
        try{
            this.setState({statusMessage: responseJson.errors[0].detail})
        }
        catch(error){
            this.setState({statusMessage: "Email sent with instructions on changing password to " + this.state.email, messageSent: true})
        }
      }

}