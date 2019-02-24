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
                    onPress={()=> this.RegisterNewUser()} 
                    buttonStyle={Styles.longButtonStyle}
                    textStyle={Styles.longButtonTextStyle}
                />
                <Text>{this.state.statusMessage}</Text>
            </View>
        );
    }

    RegisterNewUser(){
        if(this.isValidNewUser()){
            this.setState({userregistered: true, statusMessage: this.state.name + " successfully registered!"});  
            this.fetchAPIData("https://api.muncieevents.com/v1/user/register?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ")
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

      fetchAPIData(url){
        fetch(url, {method: "POST", 
                    headers: {
                        Accept: 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json',
                    },
                    body: JSON.stringify({
                        name: this.state.name,
                        password: this.state.password,
                        email: this.state.email,
          })})      
        .catch((error) =>{
            console.log(error)
           this.setState({statusMessage: "Error reaching server: " + error})
        });
      }  
}