import React from 'react';
import {View, Text, Picker} from 'react-native';
import Styles from './Styles';
import CustomButton from './CustomButton';
import EventList from '../EventList';
import APICacher from '../APICacher';
import LoadingScreen from '../components/LoadingScreen';
import TopBar from './top_bar';
import InternetError from '../components/InternetError';
import APIKey from '../APIKey'

export default class AdvancedSearch extends React.Component {
  constructor(props){
    super(props);
    this.state ={ 
                isInitialLoading: true,
                failedToLoad: false,
                categorySelectedValue: "",
                categorySelectedName: "",
                tagSelectedValue: "",
                tag: "",
                url: "",
                searchResultsHaveBeenFound: false,
                isSearching: false
              }
    this.categories=[]
    this.tags=[]
    this.APICacher = new APICacher();
    this.APIKey = new APIKey();
  }

  componentDidMount(){
    this._fetchTagAndCategoryData().catch(error => this.catchError());
  }

  catchError(){
    this.setState({isInitialLoading:false, failedToLoad:true, isSearching:false})
  }

  getErrorMessage(){
    return(
      <InternetError onRefresh = {() => {
        this.setState({isInitialLoading:true, failedToLoad:false, isSearching:false})
        this._fetchTagAndCategoryData().catch(error => this.catchError())
      }}/>
    );
  }

  async _fetchTagAndCategoryData(){
    await this._fetchCategoryData()
    await this._fetchTagData()
  }

  async _fetchCategoryData(){
    key = "Categories"
    url = "https://api.muncieevents.com/v1/categories?apikey="+this.APIKey.getAPIKey()
    await this._refreshData(key, url)

    this.categories = await this.APICacher._getJSONFromStorage(key)
    this.categories = this.categories.map((category) => {return [category.attributes.name, category.id]})
    this.setState({categorySelectedValue: this.categories[0][1], categorySelectedName: this.categories[0][0]})
  }   

  async _fetchTagData(){
    key = "Tags"
    url = "https://api.muncieevents.com/v1/tags/future?apikey="+this.APIKey.getAPIKey()
    await this._refreshData(key, url)

    this.tags = await this.APICacher._getJSONFromStorage(key)
    this.tags = this.tags.map((tag) => {return [tag.attributes.name, tag.id]})
    this.setState({tagSelectedValue: this.tags[0][0], isInitialLoading:false})
  }

  async _refreshData(key, url){
    hasAPIData = await this.APICacher._hasAPIData(key)
    if(hasAPIData){
      await this.APICacher._refreshJSONFromStorage(key, url)
    }
    else{
      await this.APICacher._cacheJSONFromAPIWithExpDate(key, url)
    }
  }

  render(){
    title = "Advanced Search"
    if(this.state.isInitialLoading){
      mainView = this.getLoadingScreen();
    }
    else if(this.state.isSearching){
      mainView = this.getLoadingScreen();
      url = this.state.url;
      this._cacheSearchResultsAsync(url).catch(error =>  this.catchError())
    }
    else if(this.state.failedToLoad){
      mainView = this.getErrorMessage();
    }
    else if(this.state.searchResultsHaveBeenFound){
      mainView = this.getResultsView();
    }
    else{
      mainView = this.getMainView()
    }
    return (
      <View style={Styles.wrapper}>
        <View style={Styles.topBarWrapper}>
          <TopBar/>
        </View>
        <View style={Styles.mainViewContent}>
          <Text style={Styles.title}>{title}</Text>
          {mainView}
        </View>
      </View>
    );
  }

  getLoadingScreen(){
    return(
      <View>
        <LoadingScreen/>
      </View>
    );
  }

  getMainView(){
    categoryView = this.getCategorySearch();
    tagView = this.getTagSearch();
    return(
      <View>
        {tagView}
        {categoryView}
      </View>
    );
  }
  
  getResultsView(){
    return(
      <View>        
        <CustomButton 
          text="Go Back"
          buttonStyle = {Styles.longButtonStyle}
          textStyle = {Styles.longButtonTextStyle}
          onPress={() => this.setState({searchResultsHaveBeenFound: false})}/>
        <View style={Styles.advancedSearchResults}>
          <EventList useSearchResults = {true}/>
        </View>
    </View>

  );}

  getCategorySearch(){
    categorylist = this.categories.map( (name) => {
      return <Picker.Item key={name[0]} value={name[1]} label={name[0]} />
    });
    return( 
    <View>
      <View style={Styles.advancedSearchRow}>
        <View style={Styles.advancedSearchColumn}>
          <Text>Category </Text>
        </View>
        <View style={Styles.advancedSearchColumn}>
          <Picker     
            selectedValue = {this.state.categorySelectedValue}
            onValueChange={(value) => {
            this.setState({categorySelectedValue: value, categorySelectedName: value.label});}}>
            {categorylist}
          </Picker>
        </View>
      </View>
      <CustomButton
          text="Search By Category"
          buttonStyle = {Styles.longButtonStyle}
          textStyle = {Styles.longButtonTextStyle}
          onPress = {() => this.returnSearchResults("category")}
        />
    </View>)
  }

  getTagSearch(){
    taglist = this.tags.map( (name) => {
      return <Picker.Item key={name[0]} value={name[0]} label={name[0]} />
    });
    return( 
    <View>
      <View style={Styles.advancedSearchRow}>
        <View style={Styles.advancedSearchColumn}>
          <Text>Tag </Text>
        </View>
        <View style={Styles.advancedSearchColumn}>
          <Picker     
              selectedValue = {this.state.tagSelectedValue}
              onValueChange={(value) => {
              this.setState({tagSelectedValue: value});}}>
              {taglist}
          </Picker>
        </View>
      </View>
      <CustomButton
          text="Search By Tag"
          buttonStyle = {Styles.longButtonStyle}
          textStyle = {Styles.longButtonTextStyle}
          onPress = {() => this.returnSearchResults("tag")}
          />
    </View>)
  }

  returnSearchResults(criteria){
    if(criteria == "tag"){
      searchURL = 'https://api.muncieevents.com/v1/events/future?withTags[]=' + this.state.tagSelectedValue + "&apikey="+this.APIKey.getAPIKey()
    }
    else if(criteria == "category"){
      searchURL = 'https://api.muncieevents.com/v1/events/category/' + this.state.categorySelectedValue + "?apikey="+this.APIKey.getAPIKey()
    }
    this.state.url = searchURL;
    this.setState({
      isSearching: true
    });
    
  }

  async _cacheSearchResultsAsync(searchURL){
    await this.APICacher._cacheJSONFromAPIAsync("SearchResults", searchURL)
    this.setState({searchResultsHaveBeenFound: true, isSearching: false});
  }
  
}