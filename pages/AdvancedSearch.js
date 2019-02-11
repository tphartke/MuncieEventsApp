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
                tag: "",
                searchCriteria: "",
                searchResults: (<Text></Text>)
              }
    this.categories=[]
  }

  fetchCategoryData(){
    fetch("https://api.muncieevents.com/v1/categories?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ")        
    .then((response) => response.json())
    .then((responseJson) => {
      this.categories = responseJson.data.map((category) => {return [category.attributes.name, category.id]})
    })
    .then(() => {this.setState({isLoading: false, categorySelectedValue: this.categories[0]})})
    .catch((error) =>{
      console.error(error);
    });
  }   

  render(){
    searchView = () => {return(<Text>Loading...</Text>)}
    if(this.state.isLoading){
      this.fetchCategoryData();
    }
    else{
      searchView = this.getAdvancedSearch();
    }
    return (
      <View style={Styles.topBarPadding}>
        <View>
          <TopBar />
        </View>

        <Text style={Styles.title}>
          Advanced Search
        </Text>

        <TextInput
          onValueChange={(text) => {this.setState({tag: text})}}
          placeholder='Search by tag...'
          style={Styles.textInput}
        />
        <CustomButton
          text="Search By Tag"
          buttonStyle = {Styles.longButtonStyle}
          textStyle = {Styles.longButtonTextStyle}
          onPress = {() => this.returnSearchResults("tag")}
        />
        {searchView}
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

  getAdvancedSearch(){
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
            this.setState({categorySelectedValue: value});}}>
            {categorylist}
        </Picker>
      </View>
    </View>)
  }

  returnSearchResults(criteria){
    if(criteria == "tag"){
      results = (<EventList apicall=""/>)
    }
    else if(criteria == "category"){
      results = (
        <View>
        <Text style={Styles.title}>
          Search Results
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