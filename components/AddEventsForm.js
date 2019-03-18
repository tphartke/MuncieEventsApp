import React, {Component} from 'react';  
import {View, ScrollView, Text, Picker, TextInput} from 'react-native';
import Styles from '../pages/Styles';
import APICacher from '../APICacher'
import AppLoading from 'expo';

export default class AddEventsForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
        }
        this.APICacher = new APICacher();
    }

    componentDidMount(){
        this._fetchTagAndCategoryData()
    }

    async _fetchTagAndCategoryData(){
        console.log("Fetching tag and category data")
        await this._fetchCategoryData();
        await this._fetchTagData();
        this.setState({isLoading: false});
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
        this.setState({tagSelectedValue: this.tags[0]})
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

    getCategoryPicker(){
        categorylist = this.categories.map( (name) => {
            return <Picker.Item key={name[0]} value={name[1]} label={name[0]} />
        });
        return(
            <View style = {[Styles.formEntry, {borderColor:'black', borderRadius: 10, borderWidth: 1}]}>
                <Picker     
                    selectedValue = {this.state.categorySelectedValue}
                    onValueChange={(value) => {
                    this.setState({categorySelectedValue: value, categorySelectedName: value.label});}}
                >
                    {categorylist}
                </Picker>
            </View>
            
        );
    }

    render(){
        if(this.state.isLoading){
            return(
            <View>
                <Text>Loading...</Text>
            </View>
            );
        }
        else{
            return(
                <ScrollView>
                    <View style={Styles.formRow}>
                        <Text style={Styles.formLabel}>Event </Text>
                        <TextInput               
                            onChangeText={(event) => this.setState({event})}
                            style={[Styles.textBox, Styles.formEntry]}
                        />
                    </View>
                    <View style={Styles.formRow}>
                        <Text style={Styles.formLabel}>Category </Text>
                        {this.getCategoryPicker()}
                    </View>
                </ScrollView>
            );
        }

    }
}