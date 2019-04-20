import React from 'react';
import {Text, View, TextInput, Switch} from 'react-native';
import CustomButton from './CustomButton';
import Styles from './Styles';
import InternetError from '../components/InternetError';


export default class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = ({ password: "",
                        confirmpassword: "",
                        email: "",
                        name: "",
                        userregistered: false,
                        statusMessage: "",
                        mailingList: false,
                        failedToLoad: false
                    })
        dataSource = null
      }

    render (){
        displayedPage = null
        if(this.state.failedToLoad){
            return(
                <InternetError onRefresh = {()=>{
                    this.setState({failedToLoad:false})
                }}/>
            )
        }
        if(this.state.userregistered){
            displayedPage = this.getCompletedRegisterView();

        }
        else{
            displayedPage = this.getRegisterView();
        }
        return(
            <View>
                {displayedPage}
            </View>
        )
    }


    getCompletedRegisterView(){
        return(
            <View>
                <Text style={Styles.centeredSingleItemText}>Successfully Registered. Welcome to Muncie Events!</Text>
            </View>
        )
    }

    getRegisterView(){
        return(
            <View>
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
  
                <Text>Password</Text>
                <TextInput
                    onChangeText={(password) => this.setState({password})}
                    style={Styles.textBox}
                    placeholder="Password"
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                />

                <Text>Confirm Password</Text>
                <TextInput
                    onChangeText={(confirmpassword) => this.setState({confirmpassword})}
                    style={Styles.textBox}
                    placeholder="Retype Password"
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                />
                <Text>Join mailing list</Text>
                <Switch
                    value={this.state.mailingList}
                    onValueChange={(value) => this.setState({mailingList: value})}
                />
                <Text>The personalized mailing list delivers daily or weekly emails about all upcoming events or only the categories 
                that you're interested in. After registering, you'll be able to go to a page where you can customize your subscription.</Text>

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
        return !(this.state.name == "" || this.state.password != this.state.confirmpassword || !this.isValidEmail(this.state.email))
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
                name: this.state.name,
                join_mailing_list: this.state.mailingList
              })
          })
          .then((response) => response.json())
          .then((responseJson) => {this.getStatus(responseJson)
                                    console.log(responseJson)})
        .catch((error) =>{
            this.setState({failedToLoad:true})
        });
      }  

    getStatus(responseJson){
        try{
            this.setState({statusMessage: responseJson.errors[0].detail})
        }
        catch(error){this.setState({statusMessage: '', userregistered: true})}
    }
}