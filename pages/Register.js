import React from 'react';
import {Text, View, TextInput} from 'react-native';
import CustomButton from './CustomButton';
import Styles from './Styles';

export default class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = ({ password: "",
                        confirmpassword: "",
                        email: "",
                        name: "",
                        userregistered: false,
                        statusMessage: ""})
        dataSource = null
      }

    render (){
        return(
            <View>
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
  
                <Text>Password</Text>
                <TextInput
                    onChangeText={(password) => this.setState({password})}
                    style={Styles.textBox}
                    placeholder="Password"
                    secureTextEntry={true}
                />

                <Text>Confirm Password</Text>
                <TextInput
                    onChangeText={(confirmpassword) => this.setState({confirmpassword})}
                    style={Styles.textBox}
                    placeholder="Retype Password"
                    secureTextEntry={true}
                />

                <CustomButton 
                    text="Register" 
                    onPress={()=> this.registerNewUser()} 
                    buttonStyle={Styles.longButtonStyle}
                    textStyle={Styles.longButtonTextStyle}
                />
                <Text>{this.state.statusMessage}</Text>
            </View>
        );
    }

    registerNewUser(){
        if(this.isValidNewUser()){
            this.fetchAPIData()
        }
        else{
            this.setState({statusMessage: "Please ensure your password matches and your email is valid"});
        }
    }

    isValidNewUser(){
        if(this.state.name == "" || this.state.password != this.state.confirmpassword || !this.isValidEmail(this.state.email)){
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
            fetch("https://api.muncieevents.com/v1/user/register?apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1", 
              {method: "POST",
              headers: {
                  Accept: 'application/vnd.api+json',
                  'Content-Type': 'application/json',
                  },
              body: JSON.stringify({
                password: this.state.password,
                email: this.state.email,
                name: this.state.name
              })
          })
          .then((response) => response.json())
          .then((responseJson) => this.getStatus(responseJson))
        .catch((error) =>{
            console.log(error)
        });
      }  

    getStatus(responseJson){
        try{
            this.setState({statusMessage: responseJson.errors[0].detail})
        }
        catch(error){
            this.setState({statusMessage: this.state.name + " successfully registered!"})
        }
    }
}