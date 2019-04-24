import React from 'react';
import {Text, View, WebView, Linking} from 'react-native';
import Styles from './Styles';
import APICacher from '../APICacher';
import LoadingScreen from '../components/LoadingScreen';
import TopBar from './top_bar';
import InternetError from '../components/InternetError';

//This script is used to inject working links into the WebView, as the normal method can't be used due to a react native bug.
const injectScript = `
  (function () {
    window.onclick = function(e) {
      e.preventDefault();
      window.postMessage(e.target.href);
      e.stopPropagation()
    }
  }());
`;

export default class Widgets extends React.Component {
  constructor(props){
    super(props);
    this.state ={isLoading: true, failedToLoad:false}
  }

  componentDidMount(){
    this._getCachedDataAsync().catch(error => this.setState({isLoading:false, failedToLoad:true}));
  }

  render() {
    if(this.state.isLoading){
      mainView = this.getLoadingScreen();
    }
    else if(this.state.failedToLoad){
      mainView = this.getErrorMessage();
    }
    else{
      widgetsHTML = this.state.dataSource.attributes.body;
      mainView = this.getWebView(widgetsHTML)
    }
    return (
      <View style={Styles.wrapper}>
        <View style={Styles.topBarWrapper}>
          <TopBar/>
        </View>
        <View style={Styles.mainViewContent}>
          <Text style ={Styles.title}> Widgets </Text>
          {mainView}
        </View>
      </View>
    )
  }

  getErrorMessage(){
    return(
      <InternetError onRefresh={()=>{
        this.setState({failedToLoad:false, isLoading:true})
        this._getCachedDataAsync().catch(error => this.setState({isLoading: false, failedToLoad:true}))
      }}/>
    );
  }

  getLoadingScreen(){
    return(
      <View>
        <LoadingScreen/>
      </View>
    );
  }

  async _getCachedDataAsync(){
    this.APICacher = new APICacher();
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

  //Opens link when called by WebView
  onMessage({ nativeEvent }) {
    const data = nativeEvent.data;
    if (data !== undefined && data !== null) {
      Linking.openURL(data);
    }
  } 

  getWebView(html){
    return(
      <WebView
        ref={(ref) => { this.webview = ref; }}
        originWhitelist={['*']}
        source={{ html: html }}
        scrollEnabled={true}
        startInLoadingState={false}
        javaScriptEnabled = {true}
        injectedJavaScript={injectScript}
        onMessage = {this.onMessage}
        scalesPageToFit={false}
      />
    )
  }
}