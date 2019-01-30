import React from 'react';
import {View, TextInput} from 'react-native';
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
        if(this.state.userid.length == 0){
            this.setState({userid: this.props.userid});
            this.fetchAPIData(this.state.userid);
        }
        var contentView = this.getLoadingView();
        if(!this.state.isLoading){
          contentView = this.getEventDataView(this.state.dataSource);
        }
          return(
            {contentView}
        );
      }

      fetchAPIData(userid){
        return fetch("https://api.muncieevents.com/v1/user/" + userid + "?apikey= E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ")        
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            dataSource: responseJson.data,
          }, function(){});
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

      getProfileInformation(dataSource){
          this.setState({email: dataSource.attributes.email, name: dataSource.attributes.name})
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
              </View>
          )
      }
}