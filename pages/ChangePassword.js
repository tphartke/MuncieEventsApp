import React from 'react';
import {View, TextInput, Text} from 'react-native';
import CustomButton from "./CustomButton";
import Styles from './Styles';

export default class ChangePassword extends React.Component {
    constructor(props){
        super(props);
        this.state = ({
                    userid: "",
                    newPassword: "", 
                    confirmNewPassword: "", 
                    statusMessage: ""
        })
    }

    componentDidMount(){
        this.setState({userid: this.props.userid});
    }
    render(){
        return(
            <View>
                <TextInput 
                    onChangeText={(newPassword) => this.setState({newPassword})}
                    style={Styles.textBox}
                    placeholder="Enter new password"
                    secureTextEntry={true}/>
                <TextInput 
                    onChangeText={(confirmNewPassword) => this.setState({confirmNewPassword})}
                    style={Styles.textBox}
                    placeholder="Confirm new password"
                    secureTextEntry={true}/>
                <CustomButton 
                    text="Confirm" 
                    buttonStyle = {Styles.longButtonStyle}
                    textStyle = {Styles.longButtonTextStyle}
                    onPress = {()=>this.attemptUpdatePassword()}
                />
                <Text>{this.state.statusMessage}</Text>
            </View>
        )
    }

    attemptUpdatePassword(){
        if(!this.passwordsMatch()){
            this.setState({statusMessage: "ERROR: Passwords do not match"})
        }
        else if(this.state.newPassword.length < 1){
            this.setState({statusMessage: "ERROR: Empty passwords not allowed"})
        }        
        else{
            this.updatePassword();
        }
    }

    updatePassword(){
        fetch("https://api.muncieevents.com/v1/user/password?userToken=" + this.state.userid +"apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1", 
          {method: "PATCH",
          headers: {
              'Content-Type': 'application/json',
              },
          body: JSON.stringify({
            password: this.state.newPassword
          })
      })
      .then((responseJson)=>console.log(responseJson))
        .catch((error) =>{
           console.log(error)
           this.setState({statusMessage: "Error reaching server: " + error})
        })
      }

    passwordsMatch(){
        if(this.state.newPassword === this.state.confirmNewPassword){
            return true;
        }
        return false;
    }

}