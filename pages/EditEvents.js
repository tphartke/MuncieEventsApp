import React from 'react';  
import {View, Platform, Text, Picker, TextInput, Modal, DatePickerAndroid, TimePickerAndroid, DatePickerIOS, FlatList, Switch, ScrollView, AsyncStorage} from 'react-native';
import Styles from './Styles';
import APICacher from '../APICacher'
import CustomButton from './CustomButton';
import LoadingScreen from "../components/LoadingScreen";
import InternetError from '../components/InternetError';

export default class EditEvents extends React.Component {
    constructor(props){
      super(props); 
      this.state = {
        isLoading: true,
        IOSModalVisible: false,
        tagModalVisable: false,
        chosenDate: new Date(),
        startTime: null,
        endTime: null,
        selectedTagArray: [],
        filter: null,
        statusMessage: "",
        userToken: null,
        location: null,
        categorySelectedName: null,
        categorySelectedValue: 24,
        tagSelectedValue: null,
        event: null,
        source: null,
        ageRestriction: null,
        cost: null,
        description: null,
        address: null,
        locationDetails: null,
        id: null,
        failedToLoad: false
    }
    this.event = null
    this.tags=[]
    this.APICacher = new APICacher();
    }


    componentDidMount(){
      this._fetchTagAndCategoryData().catch(error => this.setState({failedToLoad: true}))
    }

  async _fetchTagAndCategoryData(){
      console.log("Fetching tag and category data")
      await this._fetchCategoryData();
      await this._fetchTagData();
      utoken = await this.retrieveStoredToken();
      console.log(utoken)
      this.setState({isLoading: false, userToken: utoken});
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
          <View style = {[{borderColor:'black', borderRadius: 10, borderWidth: 1}]}>
              <Picker     
                  selectedValue = {this.state.categorySelectedValue}
                  style={{height:50}} 
                  itemStyle={{height:50}}
                  onValueChange={(value) => {
                  this.setState({categorySelectedValue: value, categorySelectedName: value.label});}}
              >
                  {categorylist}
              </Picker>
          </View>
      );
  }

  getTagListModal(){
      tagFlatList = this.getSelectableTagsList();
      return(
          <Modal
          animationType ="slide"
          transparent={false}
          visible= {this.state.tagModalVisable}
          onRequestClose={() => {
              console.log("Modal has been closed")
          }}>
              {tagFlatList}
          </Modal>
      );

  }

  getSelectableTagsList(){
      fullTagList = this.tags.map((name) =>{
          return(name[0])
      });
      if(this.state.filter){
          filteredTagList = fullTagList.filter(tag => tag.includes(this.state.filter.toLowerCase()))
      }
      else{
          filteredTagList = fullTagList
      }
      return(
          <View style={{flex: 1}}>
              <View>
                  <Text style={Styles.title}>Select Tags</Text>
              </View>
              <View style={{flex: .1, paddingBottom: 35}}>
              {/*Second view for just padding was added to avoid spacing issues with the filter textinput and the clear button*/}
                  <View style={{paddingBottom: 5}}>
                      <TextInput               
                          onChangeText={(userInput) => this.setState({filter: userInput})}
                          style={[Styles.textBox]}
                          ref={input => this.filterInput = input}
                          placeholder="Filter tags"
                      />
                  </View>
                  <CustomButton
                      text="Clear Filter"
                      buttonStyle={[Styles.mediumButtonStyle, {alignSelf:"center"}]}
                      textStyle={Styles.mediumButtonTextStyle}
                      onPress={() => {
                          this.filterInput.clear()
                          this.setState({filter:null})
                      }}
                  />
              </View>
              <View style={{flex: .80, backgroundColor:'#eee'}}>
                  <FlatList
                      data={filteredTagList}
                      renderItem={({item}) => 
                          this.getSelectableTag(item)
                      }
                      ListEmptyComponent={() => this.getNoTagsFoundMessage()}
                      nestedScrollEnabled= {true}
                  />
              </View>
              {/*Due to issues with how flatlists use padding, there needed to be a seperate view that was just padding.*/}
              <View style={{paddingBottom:5}}></View>
              <View style={{alignItems:"center", flex: .1}}>
                  <CustomButton
                      text="Close"
                      buttonStyle={[Styles.mediumButtonStyle]}
                      textStyle={Styles.mediumButtonTextStyle}
                      onPress={() => {
                          this.filterInput.clear()
                          this.setState({tagModalVisable: false, filter: null})}
                      }
                  />
              </View>
              
          </View>
      );
  }s

  getSelectableTag(tag){
      isTagAlreadySelected = this.isInSelectedTagList(tag)
      return(
          <View style={{flexDirection: 'row'}}>
              <Switch
                  value={isTagAlreadySelected}
                  onValueChange={() => this.updateSelectedTagList(tag)}
              />
              <Text style={{alignSelf:"center"}}>{tag}</Text>
          </View>
      );
  }

  isInSelectedTagList(tag){
      selectedTagList = this.state.selectedTagArray
      return selectedTagList.includes(tag)
  }

  getNoTagsFoundMessage(){
      return(
          <Text>No tags found.</Text>
      );
  }

  updateSelectedTagList(tag){
      selectedTagList = this.state.selectedTagArray
      tagNeedsRemoved = this.isInSelectedTagList(tag)
      if(tagNeedsRemoved){
          index = selectedTagList.indexOf(tag)
          selectedTagList.splice(index, 1)
      }
      else{
          selectedTagList.push(tag)
      }
      this.setState({selectedTagArray: selectedTagList})
  }

  getAndroidTimeFields(){
      if(Platform.OS == "android"){
          return(
              <View style={Styles.formRow}>
                  <Text style ={Styles.formLabel}>Time </Text>
                  <CustomButton 
                      buttonStyle={Styles.mediumButtonStyle}
                      textStyle={Styles.mediumButtonTextStyle}
                      text="Select Time"
                      onPress = {() => this.getAndroidTimePicker()}
                  />
              </View>
          );
      }
      else{
          //return nothing if on IOS
          return(
              <View></View>
          );
      }
  }

  async getAndroidTimePicker(){
      try {
          const {action, hour, minute} = await TimePickerAndroid.open({
            hour: 12,
            minute: 0,
            is24Hour: false,
          });
          if (action !== TimePickerAndroid.dismissedAction) {
            time = hour + ":" + minute
            this.setState({startTime: time})
          }
        } catch ({code, message}) {
          console.warn('Cannot open time picker', message);
        }
  }


  getIOSDatePicker(){
      highlightedDate = new Date()
      highlightedStartTime = new Date()
      highlightedEndTime = new Date()
      return(
          <Modal
              animationType ="slide"
              transparent={false}
              visible= {this.state.IOSModalVisible}
              onRequestClose={() => {
                  console.log("Modal has been closed")
          }}>
              <ScrollView style={{paddingTop: 10}}>
                  <Text style={Styles.title}>Date:</Text>
                  <View style = {[{borderColor:'black', borderRadius: 10, borderWidth: 1}]}>
                      <DatePickerIOS 
                          date={this.state.chosenDate}
                          onDateChange={(date) => {
                              this.highlightedDate = date
                          }}
                          mode={'date'}
                          itemStyle={{height:50}}
                      />
                  </View>
                  <Text style={Styles.title}>Start Time:</Text>
                  <View style = {[{borderColor:'black', borderRadius: 10, borderWidth: 1}]}>
                      <DatePickerIOS 
                          date={new Date()}
                          mode= "time"
                          onDateChange={(time) => {
                              this.highlightedStartTime = time
                          }}
                          itemStyle={{height:50}}
                      />
                  </View>
                  <Text style={Styles.title}>End Time:</Text>
                  <View style = {[{borderColor:'black', borderRadius: 10, borderWidth: 1}]}>
                      <DatePickerIOS 
                          date={new Date()}
                          mode= "time"
                          onDateChange={(time) => {
                              this.highlightedEndTime = time
                          }}
                          itemStyle={{height:50}}
                      />
                  </View>
                  {/*select button*/}
                  <CustomButton
                      text="Select"
                      buttonStyle={Styles.longButtonStyle}
                      textStyle={Styles.longButtonTextStyle}
                      onPress = {() => {
                          this.setState({chosenDate: this.highlightedDate, startTime: this.highlightedStartTime, endTime: this.highlightedEndTime, IOSModalVisible: false})
                  }}/>
                  {/*cancel button*/}
                  <CustomButton
                      text="Cancel"
                      buttonStyle={Styles.longButtonStyle}
                      textStyle={Styles.longButtonTextStyle}
                      onPress = {() => {
                          this.setState({IOSModalVisible: false})
                  }}/>
              </ScrollView>
          </Modal>
      );
  }

  async getAndroidDatePicker(){
      try {
          const {action, year, month, day} = await DatePickerAndroid.open({
            date: new Date()
          });
          if (action == DatePickerAndroid.dateSetAction) {
            newDate = new Date(year, month, day);
            this.setState({chosenDate: newDate})
          }
        } catch ({code, message}) {
          console.warn('Cannot open date picker', message);
        }
  }

  selectDatePickerFromOS(){
      if(Platform.OS == "ios"){
          this.setState({IOSModalVisible: true})
      }
      else{
          this.getAndroidDatePicker()
      }
  }

  submitForm(){
      console.log("The form was submitted")
      console.log("Event: " + this.state.event)
  }

  render(){
      if(!this.event){
        this.event = this.props.eventData
        this.setStatesForEventData()
      }
      if(this.state.isLoading){;
          return(
          <View>
              <LoadingScreen/>
          </View>
          );
      }
      else if(this.state.failedToLoad){
        return(
            <InternetError onRefresh = {() => {
                this._fetchTagAndCategoryData().catch(error => this.setState({failedToLoad:true}))
                this.setState({failedToLoad:false, isLoading: true})
            }}/>
        );
      }
      else{
          IOSDatePickerModal = this.getIOSDatePicker();
          androidTimePicker = this.getAndroidTimeFields();
          tagListModal = this.getTagListModal();
          return(
                  <View style={{flex:1}}>
                      {IOSDatePickerModal}
                      {tagListModal}
                      <View style={Styles.formRow}>
                          <Text style={Styles.formLabel}>Title <Text style={Styles.requiredField}>*required</Text></Text>
                          <TextInput    
                              value={this.state.event}           
                              onChangeText={(event) => this.setState({event})}
                              style={[Styles.textBox, Styles.formEntry]}
                          />
                      </View>
                      <View style={Styles.formRow}>
                          <Text style={Styles.formLabel}>Category <Text style={Styles.requiredField}>*required</Text></Text>
                          {this.getCategoryPicker()}
                      </View>
                      <View style={Styles.formRow}>
                          <Text style={Styles.formLabel}>Date <Text style={Styles.requiredField}>*required</Text></Text>
                          <CustomButton
                              text="Select Date"
                              buttonStyle={[Styles.mediumButtonStyle]}
                              textStyle={Styles.mediumButtonTextStyle}
                              onPress={() => this.selectDatePickerFromOS()}
                          />
                      </View>
                      {androidTimePicker}
                      <View style={Styles.formRow}>
                          <Text>{this.state.chosenDate.toString()}</Text>
                      </View>
                      <View style={Styles.formRow}>
                          <Text>{this.state.startTime.toString()}</Text>
                      </View>
                      <View style={Styles.formRow}>
                          <Text style={Styles.formLabel}>Location <Text style={Styles.requiredField}>*required</Text></Text>
                          <TextInput
                              value={this.state.location}                
                              onChangeText={(location) => this.setState({location})}
                              style={[Styles.textBox, Styles.formEntry]}
                          />
                      </View>
                      <View style={Styles.formRow}>
                          <Text style={Styles.formLabel}>Location Details </Text>
                          <TextInput              
                              value={this.state.locationDetails}  
                              onChangeText={(locationDetails) => this.setState({locationDetails})}
                              style={[Styles.textBox, Styles.formEntry]}
                              placeholder = "upstairs, room 149, etc."
                          />
                      </View>
                      <View style ={Styles.formRow}>
                      
                          <Text style={Styles.formLabel}>Address </Text>
                          <TextInput 
                              value={this.state.address}               
                              onChangeText={(address) => this.setState({address})}
                              style={[Styles.textBox, Styles.formEntry]}
                          />
                      </View>
                      <View style={Styles.formRow}>
                          <Text style={Styles.formLabel}>Description <Text style={Styles.requiredField}>*required</Text></Text>
                          <TextInput     
                              value={this.state.description}          
                              onChangeText={(description) => this.setState({description})}
                              style={[Styles.textArea, Styles.formEntry]}
                              multiline={true}
                          />
                      </View>
                      <View style={Styles.formRow}>
                          <Text style={Styles.formLabel}>Tags </Text>
                          <CustomButton
                              text="Add Tags"
                              buttonStyle={[Styles.mediumButtonStyle]}
                              textStyle={Styles.mediumButtonTextStyle}
                              onPress={() => this.setState({tagModalVisable: true})}
                          />
                      </View>
                      <View style={Styles.formRow}>
                          <Text style={Styles.formLabel}>Chosen Tags </Text>
                          <Text style={Styles.formEntry}>{this.state.selectedTagArray.toString()}</Text>
                      </View>
                      <View style = {Styles.formRow}>
                          <Text style={Styles.formLabel}>Cost </Text>
                          <TextInput      
                              value={this.state.cost}         
                              onChangeText={(cost) => this.setState({cost})}
                              style={[Styles.textBox, Styles.formEntry]}
                              placeholder = "Leave this blank if the event is free"
                          />
                      </View>
                      <View style = {Styles.formRow}>
                          <Text style={Styles.formLabel}>Age Restriction </Text>
                          <TextInput      
                              value={this.state.ageRestriction}         
                              onChangeText={(ageRestriction) => this.setState({ageRestriction})}
                              style={[Styles.textBox, Styles.formEntry]}
                              placeholder = "Leave this blank if there is no age restriction"
                          />
                      </View>
                      <View style={Styles.formRow}>
                          <Text style={Styles.formLabel}>Source </Text>
                          <TextInput
                              value={this.state.source}               
                              onChangeText={(source) => this.setState({source})}
                              style={[Styles.textBox, Styles.formEntry]}
                              placeholder = "Did you get this information from a website, newspaper, flyer, etc?"
                          />
                      </View>
                      <View style={Styles.formRow}>
                          <CustomButton
                              text="Submit"
                              buttonStyle={Styles.longButtonStyle}
                              textStyle={Styles.longButtonTextStyle}
                              onPress={() => this.submitEvent()}
                          />
                      </View>
                      <Text>{this.state.statusMessage}</Text>
                  </View>
          );
      }
  }

  setStatesForEventData(){
    this.setState({
      chosenDate: new Date(this.event.attributes.date),
      startTime: new Date(this.event.attributes.time_start),
      endTime: new Date(this.event.attributes.time_end),
      selectedTagArray: this.getTags(),
      location: this.event.attributes.location,
      categorySelectedName: this.event.attributes.category.name,
      categorySelectedValue: this.event.relationships.category.data.id,
      event: this.event.attributes.title,
      source: this.event.attributes.source,
      ageRestriction: this.event.attributes.age_restriction,
      cost: this.event.attributes.cost,
      description: this.event.attributes.description,
      address: this.event.attributes.address,
      locationDetails: this.event.attributes.location_details,
      id: this.event.id,
    })
  }

  getTags(){
    tagsArray = []
    if(this.event.attributes.tags){
      tags = this.event.attributes.tags;
     for(i = 0; i < tags.length; i++){
       tagsArray.push(tags[i].name)
     }
     return tagsArray
  }
}

  retrieveStoredToken = async() => {
      try {
        const utoken = await AsyncStorage.getItem('UniqueToken')
        return utoken
       } catch (error) {
          return "NULL"
       }
    }

  attemptEventSubmission(){
      if(this.requiredFieldsAreFilled()){
          this.submitEvent()
      }
      else{
          this.setState({statusMessage: "ERROR: One or more required fields not completed"})
      }
  }

  requiredFieldsAreFilled(){
      console.log("date: " + this.state.chosenDate + '\n' + 
                  "start: " + this.state.startTime  + '\n' + 
                  "end: " + this.state.endTime + '\n' + 
                  "tag_names: " + this.state.selectedTagArray + '\n' + 
                  "location: " + this.state.location + '\n' + 
                  "category_id: " + this.state.categorySelectedValue + '\n' + 
                  "title: " + this.state.event + '\n' + 
                  "source: " + this.state.source + '\n' + 
                  "age_restriction: " + this.state.ageRestriction + '\n' + 
                  "cost: " + this.state.cost + '\n' + 
                  "description: " + this.state.description + '\n' + 
                  "address: " + this.state.address + '\n' + 
                  "location_details: " + this.state.locationDetails)
      if(this.state.category_id && this.state.event && this.state.chosenDate && this.state.startTime 
          && this.state.description && this.state.location){
              return true;
      }
      return false;
  }

  submitEvent(){
      console.log("date: " + this.state.chosenDate + '\n' + 
                  "time_start: " + this.state.startTime  + '\n' + 
                  "time_end: " + this.state.endTime + '\n' + 
                  "tag_names: " + this.state.selectedTagArray + '\n' + 
                  "location: " + this.state.location + '\n' + 
                  "category_id: " + this.state.categorySelectedValue + '\n' + 
                  "title: " + this.state.event + '\n' + 
                  "source: " + this.state.source + '\n' + 
                  "age_restriction: " + this.state.ageRestriction + '\n' + 
                  "cost: " + this.state.cost + '\n' + 
                  "description: " + this.state.description + '\n' + 
                  "address: " + this.state.address + '\n' + 
                  "location_details: " + this.state.locationDetails)
      if(this.state.userToken){
          url = "https://api.muncieevents.com/v1/events?userToken=" + this.state.userToken + "&apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1"
      }
      else{
          url = "https://api.muncieevents.com/v1/events?apikey=3lC1cqrEx0QG8nJUBySDxIAUdbvHJiH1"
      }
      fetch(url,
      {method: "POST",
      headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/json',
          },
      body: JSON.stringify({
          date: this.state.chosenDate,
          start: this.state.startTime,
          time_end: this.state.endTime,
          tag_names: this.state.selectedTagArray,
          location: this.state.location,
          category_id: this.state.categorySelectedValue,
          title: this.state.event,
          source: this.state.source,
          age_restriction: this.state.ageRestriction,
          cost: this.state.cost,
          description: this.state.description,
          address: this.state.address,
          location_details: this.state.locationDetails
      })
  })
  .then((response) => response.json())
  .then((responseJson) => console.log(responseJson))
  .then((responseJson) => this.handelAPIResponse(responseJson))
    .catch((error) =>{
       this.setState({failedToLoad:true})
    })
  }

  handelAPIResponse(responseJson){
      try{
          this.setState({statusMessage: responseJson.errors[0].detail})
      }
      catch(error){
          this.setState({statusMessage: "Event successfully submitted!"})
      }

  }
}