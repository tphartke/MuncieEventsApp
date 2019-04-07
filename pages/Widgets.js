import React from 'react';
import {Text, View, WebView} from 'react-native';
import Styles from './Styles';
import APICacher from '../APICacher';
import LoadingScreen from '../components/LoadingScreen';
import TopBar from './top_bar';

export default class Widgets extends React.Component {
  constructor(props){
    super(props);
    this.state ={isLoading: true}
    //this._getCachedDataAsync = this._getCachedDataAsync.bind(this);
  }

  componentDidMount(){
    this._getCachedDataAsync();
  }

  render() {
    if(this.state.isLoading){
      mainView = this.getLoadingScreen();
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