import React from 'react';
import {Text, View, WebView, TextInput} from 'react-native';
import Styles from './Styles';
import CustomButton from './CustomButton'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import EventList from '../EventList'
import APICacher from '../APICacher';
import LoadingScreen from '../components/LoadingScreen';


export default class Widgets extends React.Component {
  constructor(props){
    super(props);
    this.state ={ isLoading: true,                
                  url: "",
                  text: ""}
    this._getCachedDataAsync = this._getCachedDataAsync.bind(this);
    this.APICacher = new APICacher();
  }

  componentDidMount(){
    this._getCachedDataAsync();
  }

  render() {
    widgetsTitle = "";
    widgetsHTML = "";
    webView = null
    searchView = null
    topBar = this.getTopBar();
    if(this.state.isLoading){
      mainView = this.getLoadingScreen();
    }
    else if(this.state.url){
      mainView = this.getSearchView();
    }
    else{
      widgetsTitle = this.state.dataSource.attributes.title;
      widgetsHTML = this.state.dataSource.attributes.body;
      mainView = this.getWebView(widgetsHTML)
    }
    return (
      <View style={Styles.wrapper}>
        {topBar}
        <Text style ={Styles.title}> Widgets </Text>
        {mainView}
      </View>
    )
  }

  getLoadingScreen(){
    return(
      <View>
        <LoadingScreen/>
      </View>
    );
  }

  getTopBar(){
    return(
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
    );
    
  }

  async _getCachedDataAsync(){
    key = "WidgetsData"
    url = "https://api.muncieevents.com/v1/pages/widgets?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
    hasAPIData = await this.APICacher._hasAPIData(key)
    if(hasAPIData){
      await this.APICacher._refreshJSONFromStorage(key, url)
    }
    else{
        await this.APICacher._cacheJSONFromAPIWithExpDate(key, url)
    }
    await this.APICacher._getJSONFromStorage(key)
      .then((response) => this.setState({dataSource: response, isLoading: false}))
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