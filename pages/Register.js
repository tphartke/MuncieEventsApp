import React from 'react';
import {Text, View, TextInput} from 'react-native';
import CustomButton from "./CustomButton";

export default class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = ({message: ""})
        this.state = ({email: ""})
        this.state = ({name: ""})
        this.state = ({userregistered: false})
        this.state = ({statusMessage: ""})
      }

    render (){
        return(
            <View>
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
  
                <Text>Password</Text>
                <TextInput
                    onChangeText={(message) => this.setState({message})}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    placeholder="Password"
                    secureTextEntry={true}
                />

                <Text>Confirm Password</Text>
                <TextInput
                    onChangeText={(message) => this.setState({message})}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    placeholder="Retype Password"
                    secureTextEntry={true}
                />

                <CustomButton 
                    text="Register" 
                    onPress={()=> this.RegisterNewUser()} 
                    buttonStyle={{width:400, height:25}}
                    textStyle={{fontSize:18}}
                />
                <Text>{this.state.statusMessage}</Text>
            </View>
        );
    }

    RegisterNewUser(){
        if(this.isValidNewUser()){
            this.setState({userregistered: true, statusMessage: this.state.name + " successfully registered!"});  
            this.fetchAPIData("https://api.muncieevents.com/v1/user/register?name=" + this.state.name + "?email=" + this.state.email + "?password=" + this.state.password + "?apikey= E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ")
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
        fetch(url, {method: "POST"})      
        .catch((error) =>{
            console.log(error)
           this.setState({statusMessage: "Error reaching server: " + error})
        });
      }  
}