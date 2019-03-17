import React from 'react';
import {Text, View, WebView, TextInput} from 'react-native';
import Styles from './Styles';
import CustomButton from './CustomButton'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import EventList from '../EventList'
import {AppLoading} from 'expo';
import APICacher from '../APICacher';


export default class About extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true,                
                  url: "",
                  text: ""}
    this._getCachedDataAsync = this._getCachedDataAsync.bind(this);
    this.APICacher = new APICacher();
  }

  render() {
    aboutUsTitle = "";
    aboutUsHTML = "";
    webView = null
    searchView = null
    if(this.state.isLoading){
      return(
        <AppLoading 
          startAsync={this._getCachedDataAsync}
          onFinish={() => this.setState({ isLoading: false })}
          onError= {console.error}
        />
      );
    }
    else if(this.state.url){
      searchView = this.getSearchView();
    }
    else{
      aboutUsTitle = this.state.dataSource.attributes.title;
      aboutUsHTML = this.state.dataSource.attributes.body;
      webView = this.getWebView(aboutUsHTML)
    }
    return (
      <View style={Styles.topBarPadding}>
          <View style={Styles.topBarWrapper}>
            <Animatable.View animation = "slideInRight" duration={500} style={Styles.topBarContent}>
                <CustomButton
                    text="Menu"
                    onPress={() => this.props.navigation.openDrawer()}/>
                <TextInput
                    placeholder=' Search'
                    value={this.state.text} 
                    style={Styles.searchBar}
                    onChangeText={(text) => this.setState({text})}
                    onBlur={() => this.setState({url:'https://api.muncieevents.com/v1/events/search?q=' + this.state.text +  '&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1'})}
                    showLoading='true'
                  />
                <Icon name="ios-search" style={Styles.iosSearch}/>
              </Animatable.View>
            </View>

        <Text style ={Styles.title}> {aboutUsTitle} </Text>
        {searchView}
        {webView}
      </View>
    )
  }

  async _getCachedDataAsync(){
    key = "AboutUsData"
    url = "https://api.muncieevents.com/v1/pages/about?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
    hasAPIData = await this.APICacher._hasAPIData(key)
    if(hasAPIData){
      await this.APICacher._refreshJSONFromStorage(key, url)
    }
    else{
        await this.APICacher._cacheJSONFromAPIWithExpDate(key, url)
    }
    await this.APICacher._getJSONFromStorage(key)
      .then((response) => this.setState({dataSource: response}))
  }

  getSearchView(){
    return(
      <View>
        <CustomButton 
          text="Go Back"
          buttonStyle = {Styles.longButtonStyle}
          textStyle = {Styles.longButtonTextStyle}
          onPress={() => this.setState({url: ""})}/>
        />
        <EventList apicall={this.state.url} />
      </View>
    )
  }

  getWebView(html){
    return(
      <WebView
        originWhitelist={['*']}
        source={{ html: html }}
        scrollEnabled={true}
        startInLoadingState={false}
      />
    )
  }
}