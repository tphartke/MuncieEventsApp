import React from 'react';
import {View, Text, Picker, TextInput} from 'react-native';
import TopBar from './top_bar';
import Styles from './Styles';
import CustomButton from './CustomButton'
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
                searchResults: (<Text></Text>)
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
    if(this.state.isLoading){
      this.fetchCategoryData();
      this.fetchTagData();
    }
    else{
      categoryView = this.getCategorySearch();
      tagView = this.getTagSearch();
    }
    return (
      <View style={Styles.topBarPadding}>
        <View>
          <TopBar />
        </View>

        <Text style={Styles.title}>
          Advanced Search
        </Text>
        {tagView}
        <CustomButton
          text="Search By Tag"
          buttonStyle = {Styles.longButtonStyle}
          textStyle = {Styles.longButtonTextStyle}
          onPress = {() => this.returnSearchResults("tag")}
        />
        {categoryView}
        <CustomButton
          text="Search By Category"
          buttonStyle = {Styles.longButtonStyle}
          textStyle = {Styles.longButtonTextStyle}
          onPress = {() => this.returnSearchResults("category")}
        />
        <View>
          {this.state.searchResults}
        </View>

      </View>
    );
  }

  getCategorySearch(){
    categorylist = this.categories.map( (name) => {
      return <Picker.Item key={name[0]} value={name[1]} label={name[0]} />
    });
    return( 
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
    </View>)
  }

  getTagSearch(){
    taglist = this.tags.map( (name) => {
      return <Picker.Item key={name[0]} value={name[0]} label={name[0]} />
    });
    return( 
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