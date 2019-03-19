import React, {Component} from 'react';  
import {View, Platform, ScrollView, Text, Picker, TextInput, Modal, DatePickerAndroid, TimePickerAndroid, DatePickerIOS} from 'react-native';
import Styles from '../pages/Styles';
import APICacher from '../APICacher'
import CustomButton from '../pages/CustomButton';

export default class AddEventsForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            isLoading: true,
            IOSModalVisible: false,
            chosenDate: new Date(),
            startTime: "12:00 PM",
            endTime: null
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

    getAndroidTimeFields(){
        if(Platform.OS == "android"){
            return(
                <View style={Styles.formRow}>
                    <Text style ={Styles.formLabel}>Time: </Text>
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
            console.log("iOS")
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

                <View>
                    <DatePickerIOS 
                        date={this.state.chosenDate}
                        onDateChange={(date) => {
                            this.highlightedDate = date
                        }}
                        mode={'date'}
                    />
                    <Text>Start Time:</Text>
                    <DatePickerIOS 
                        mode= "time"
                        onDateChange={(time) => {
                            this.highlightedStartTime = time
                        }}/>
                    <Text>End Time:</Text>
                    <DatePickerIOS 
                        mode= "time"
                        onDateChange={(time) => {
                            this.highlightedEndTime = time
                        }}
                    />
                    {/*select button*/}
                    <CustomButton
                        text="Select"
                        buttonStyle={Styles.mediumButtonStyle}
                        textStyle={Styles.mediumButtonTextStyle}
                        onPress = {() => {
                            this.setState({chosenDate: this.highlightedDate, startTime: this.highlightedStartTime, endTime: this.highlightedEndTime, IOSModalVisible: false})
                    }}/>
                    {/*cancel button*/}
                    <CustomButton
                        text="Cancel"
                        buttonStyle={Styles.mediumButtonStyle}
                        textStyle={Styles.mediumButtonTextStyle}
                        onPress = {() => {
                            this.setState({IOSModalVisible: false})
                    }}/>
                </View>
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
        IOSDatePickerModal = this.getIOSDatePicker()
        androidTimePicker = this.getAndroidTimeFields()
        if(this.state.isLoading){;
            return(
            <View>
                <Text>Loading...</Text>
            </View>
            );
        }
        else{
            return(
                //<ScrollView contentContainerStyle={{ flexGrow: 0, height:1000 }}>
                    <View style={{flex:1}}>
                        {IOSDatePickerModal}
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
                        <View style={Styles.formRow}>
                            <Text style={Styles.formLabel}>Date </Text>
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
                            <Text style={Styles.formLabel}>Location </Text>
                            <TextInput               
                                onChangeText={(location) => this.setState({location})}
                                style={[Styles.textBox, Styles.formEntry]}
                            />
                        </View>
                        <View style={Styles.formRow}>
                            <Text style={Styles.formLabel}>Location Details </Text>
                            <TextInput               
                                onChangeText={(locationDetails) => this.setState({locationDetails})}
                                style={[Styles.textBox, Styles.formEntry]}
                                placeholder = "upstairs, room 149, etc."
                            />
                        </View>
                        <View style ={Styles.formRow}>
                            <Text style={Styles.formLabel}>Address </Text>
                            <TextInput               
                                onChangeText={(address) => this.setState({address})}
                                style={[Styles.textBox, Styles.formEntry]}
                            />
                        </View>
                        <View style={Styles.formRow}>
                            <Text style={Styles.formLabel}>Description </Text>
                            <TextInput               
                                onChangeText={(description) => this.setState({description})}
                                style={[Styles.textArea, Styles.formEntry]}
                            />
                        </View>
                        <View style={Styles.formRow}>
                            <Text style={Styles.formLabel}>Tags </Text>
                        </View>
                        <View style = {Styles.formRow}>
                            <Text style={Styles.formLabel}>Cost </Text>
                            <TextInput               
                                onChangeText={(cost) => this.setState({cost})}
                                style={[Styles.textBox, Styles.formEntry]}
                                placeholder = "Leave this blank if the event is free"
                            />
                        </View>
                        <View style = {Styles.formRow}>
                            <Text style={Styles.formLabel}>Age Restriction </Text>
                            <TextInput               
                                onChangeText={(ageRestriction) => this.setState({ageRestriction})}
                                style={[Styles.textBox, Styles.formEntry]}
                                placeholder = "Leave this blank if there is no age restriction"
                            />
                        </View>
                        <View style={Styles.formRow}>
                            <Text style={Styles.formLabel}>Source </Text>
                            <TextInput               
                                onChangeText={(source) => this.setState({source})}
                                style={[Styles.textBox, Styles.formEntry]}
                                placeholder = "Did you get this information from a website, newspaper, flyer, etc?"
                            />
                        </View>
                        <View style={Styles.formRow}>
                            <CustomButton
                                text="Submit"
                                buttonStyle={Styles.mediumButtonStyle}
                                textStyle={Styles.mediumButtonTextStyle}
                                onPress={() => this.submitForm()}
                            />
                        </View>
                    </View>
                    
                //</ScrollView>
            );
        }

    }
}