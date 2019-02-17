import React from 'react';
import {View, Text, Picker, TextInput} from 'react-native';
import Styles from './Styles';
import CustomButton from './CustomButton'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import EventList from '../EventList'

export default class AdvancedSearch extends React.Component {
  constructor(props){
    super(props);
    this.state ={ 
                isLoading: true,
                categorySelectedValue: "",
                categorySelectedName: "",
                tagSelectedValue: "",
                tag: "",
                searchCriteria: "",
                searchResults: null,
                url: "",
                text: ""
              }
    this.categories=[]
    this.tags=[]
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
    .then(() => {this.setState({isLoading: false, TagSelectedValue: this.tags[0]})})
    .catch((error) =>{
      console.error(error);
    });
  }

  render(){
    categoryView = () => {return(<Text>Loading...</Text>)}
    tagView = () => {return(<Text></Text>)}
    searchView = () => {return(<Text></Text>)}
    resultsView = () => {return(<Text></Text>)}
    
    if(this.state.isLoading){
      this.fetchCategoryData();
      this.fetchTagData();
    }
    else if(this.state.url){
      searchView=this.getSearchView();
    }
    else if(this.state.searchResults){
      resultsView = this.getResultsView();
    }
    else{
      categoryView = this.getCategorySearch();
      tagView = this.getTagSearch();
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

        <Text style={Styles.title}>
          Advanced Search
        </Text>
        {searchView}
        {tagView}
        {categoryView}
        <View>
          {resultsView}
        </View>

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
      onPress={() => this.setState({searchResults: null})}/>
    />
    {this.state.searchResults}
  </View>)
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
    results = (
      <View>
        <Text style={Styles.title}>
          Tag: {this.state.tagSelectedValue}
        </Text>
        <EventList apicall={'https://api.muncieevents.com/v1/events/future?withTags[]=' + this.state.tagSelectedValue +  '&apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ'}/>
      </View>)
    }
    else if(criteria == "category"){
      results = (
        <View>
        <Text style={Styles.title}>
          Category
        </Text>
        <EventList apicall={'https://api.muncieevents.com/v1/events/category/' + this.state.categorySelectedValue +'?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ'} />
        </View>)
    }
    else{
      results = (<Text></Text>)
    }
    this.setState({searchResults: results})
  }
}