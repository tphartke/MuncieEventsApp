import React from 'react';
import {View, TextInput, Text} from 'react-native';
import CustomButton from "./CustomButton";
import Styles from './Styles';

export default class ProfileView extends React.Component {
    constructor(props){
        super(props);
        this.state = ({email: ""})
        this.state = ({name: ""})
        this.state = ({statusMessage: ""})
        this.state = ({userid: ""})
        this.state = ({isLoading: true})

      }
      render(){
        contentView = (<Text></Text>)
        if(!this.state.email && this.state.userid){
          this.fetchAPIData(this.state.userid)
        }
        else if(this.state.userid){
          contentView = this.getProfileInformation();
        }
          return(
            <View>
                {contentView}
            </View>
        );
      }

      componentDidMount(){
        this.setState({userid: this.props.userid});
      }

      fetchAPIData(userid){
        fetch("https://api.muncieevents.com/v1/user/" + userid + "?apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1")        
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
            email: responseJson.data.attributes.email,
            name: responseJson.data.attributes.name
          });
        })
        .catch((error) =>{
          console.error(error);
        });
      } 
      
      getLoadingView(){
        return(
            <View style={Styles.loadingViewPadding}>
              <ActivityIndicator/>
            </View>
          );   
      }

      getProfileInformation(){
          return(
              <View>
                <TextInput
                    onChangeText={(name) => this.setState({name})}
                    style={Styles.textBox}
                    placeholder={this.state.name}
                />          
                <TextInput
                    onChangeText={(email) => this.setState({email})}
                    style={Styles.textBox}
                    placeholder={this.state.email}
                />
                <CustomButton 
                    text="Update" 
                    buttonStyle = {Styles.longButtonStyle}
                    textStyle = {Styles.longButtonTextStyle}
                />
              </View>
          )
      }
}