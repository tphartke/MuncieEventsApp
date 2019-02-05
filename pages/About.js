import React from 'react';
import {Text, View, WebView} from 'react-native';
import TopBar from './top_bar';
import Styles from './Styles';

export default class About extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  fetchAPIData(){
    return fetch('https://api.muncieevents.com/v1/pages/about?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ')        
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

  render() {
    aboutUsTitle = "";
    aboutUsHTML = "";
    this.fetchAPIData();
    if(!this.state.isLoading){
      aboutUsTitle = this.state.dataSource.attributes.title;
      aboutUsHTML = this.state.dataSource.attributes.body;
    }
    return (
      <View style={Styles.topBarPadding}>
        <TopBar />
        <Text style ={Styles.title}> {aboutUsTitle} </Text>
        {this.getWebView(aboutUsHTML)}
      </View>
    )
  }

  getWebView(html){
    return(
      <WebView
        originWhitelist={['*']}
        source={{ html: html }}
        scrollEnabled={true}
        startInLoadingState={true}
      />
    )
  }
}