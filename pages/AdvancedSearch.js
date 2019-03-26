import React from 'react';
import {View, Text, Picker, TextInput} from 'react-native';
import Styles from './Styles';
import CustomButton from './CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import EventList from '../EventList';
import APICacher from '../APICacher';
import LoadingScreen from '../components/LoadingScreen';

export default class AdvancedSearch extends React.Component {
  constructor(props){
    super(props);
    this.state ={ 
                isInitialLoading: true,
                categorySelectedValue: "",
                categorySelectedName: "",
                tagSelectedValue: "",
                tag: "",
                searchCriteria: "",
                searchResults: null,
                url: "",
                text: "",
                resultsLoaded: false,
                resultsLoading: false
              }
    this.categories=[]
    this.tags=[]
    this.APICacher = new APICacher();
  }

  componentDidMount(){
    this._fetchTagAndCategoryData();
  }

  async _fetchTagAndCategoryData(){
    await this._fetchCategoryData()
    await this._fetchTagData()
  }

  async _fetchCategoryData(){
    key = "Categories"
    url = "https://api.muncieevents.com/v1/categories?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
    await this._refreshData(key, url)

    this.categories = await this.APICacher._getJSONFromStorage(key)
    this.categories = this.categories.map((category) => {return [category.attributes.name, category.id]})
    this.setState({categorySelectedValue: this.categories[0]})
  }   

  async _fetchTagData(){
    key = "Tags"
    url = "https://api.muncieevents.com/v1/tags/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
    await this._refreshData(key, url)

    this.tags = await this.APICacher._getJSONFromStorage(key)
    this.tags = this.tags.map((tag) => {return [tag.attributes.name, tag.id]})
    this.setState({tagSelectedValue: this.tags[0], isInitialLoading:false})
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
    else if(this.state.resultsLoading){
      mainView = this.getLoadingScreen();
      url = this.state.searchURL;
      this._cacheSearchResultsAsync(searchURL)
    }
    else if(this.state.resultsLoaded){
      mainView = this.getResultsView();
      title = "Search by " + this.state.title
    }
    else{
      mainView = this.getMainView()
    }
    return (
      <View style={Styles.wrapper}>
        {this.getTopBar()}
        <Text style={Styles.title}>
          {title}
        </Text>
        <View>
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
    )
  }
  
  getResultsView(){
    return(
      <View>        
        <CustomButton 
          text="Go Back"
          buttonStyle = {Styles.longButtonStyle}
          textStyle = {Styles.longButtonTextStyle}
          onPress={() => this.setState({resultsLoaded: false})}/>
        <EventList useSearchResults = {true} />
    </View>

  );}
  

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
      searchURL = 'https://api.muncieevents.com/v1/events/future?withTags[]=' + this.state.tagSelectedValue + "&apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
      newTitle = "Tag: " + this.state.tagSelectedValue
    }
    else if(criteria == "category"){
      searchURL = 'https://api.muncieevents.com/v1/events/category/' + this.state.categorySelectedValue + "?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
      newTitle = "Category: " + this.state.categorySelectedValue
    }
    console.log(searchURL)
    this.state.title = newTitle;
    this.state.url = searchURL;
    this.setState({
      resultsLoading: true
    });
    
  }

  async _cacheSearchResultsAsync(searchURL){
    await this.APICacher._cacheJSONFromAPIAsync("SearchResults", searchURL)
    .then(this.setState({resultsLoaded: true, resultsLoading: false}));
  }
  
}