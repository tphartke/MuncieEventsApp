import React from 'react';
import {View, Text, Picker, TextInput} from 'react-native';
import Styles from './Styles';
import CustomButton from './CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import EventList from '../EventList';
import APICacher from '../APICacher';
import {AppLoading} from 'expo';


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

  fetchCategoryData(){
    fetch("https://api.muncieevents.com/v1/categories?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ")        
    .then((response) => response.json())
    .then((responseJson) => {
      this.categories = responseJson.data.map((category) => {return [category.attributes.name, category.id]})
    })
    .then(() => {this.setState({categorySelectedValue: this.categories[0]})})
    .catch((error) =>{
      console.error(error);
    });
  }   

  fetchTagData(){
    fetch("https://api.muncieevents.com/v1/tags/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ")        
    .then((response) => response.json())
    .then((responseJson) => {
      this.tags = responseJson.data.map((tag) => {return [tag.attributes.name, tag.id]})
    })
    .then(() => {this.setState({isInitialLoading: false, TagSelectedValue: this.tags[0]})})
    .catch((error) =>{
      console.error(error);
    });
  }

  render(){

    mainView = () => {return(<Text></Text>)}
    title = "Advanced Search"
    
    if(this.state.isInitialLoading){
      this.fetchCategoryData();
      this.fetchTagData();
    }
    else if(this.state.resultsLoading){
      url = this.state.searchURL;
      return(
        <AppLoading 
          startAsync={() => this._cacheDataAsync(searchURL)}
          onFinish={() => this.setState({ resultsLoaded: true, resultsLoading: false})}
          onError= {console.error}
        />
      );
    }
    else if(this.state.resultsLoaded){
      mainView = this.getResultsView();
      title = "Search by " + this.state.title
    }
    else{
      mainView = this.getMainView()
    }
    return (
      <View style={Styles.topBarPadding}>
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
  

  /*
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
  */

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

  async _cacheDataAsync(searchURL){
    await this.APICacher._cacheJSONFromAPIAsync("SearchResults", searchURL)
    .then(this.setState({resultsLoaded: true}));
  }
  
}