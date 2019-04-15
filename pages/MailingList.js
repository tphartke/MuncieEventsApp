import React from 'react';
import {View, Text, Switch, TextInput, FlatList, ScrollView} from 'react-native'
import Styles from './Styles'
import CustomButton from './CustomButton';
import LoadingScreen from '../components/LoadingScreen';
import APICacher from '../APICacher'

export default class MailingList extends React.Component {
    constructor(props){
        super(props);
        this.state = ({
                        userToken: "",
                        email: "",
                        all_categories: false,
                        category_ids: [],
                        weekly: false,
                        daily: false,
                        daily_sun: false,
                        daily_mon: false,
                        daily_tue: false,
                        daily_wed: false,
                        daily_thu: false,
                        daily_fri: false,
                        daily_sat: false,
                        customFrequency: false,
                        customCategories: false,
                        isLoading: true,
                        subscriptionStatus: "",
                        subscribed: false
                     })
        this.APICacher = new APICacher();
        categories = []
    }

    componentDidMount(){
        this._fetchCategoryData()
    }

    render(){
        mainView = null
        if(this.state.isLoading){
            mainView = this.getLoadingScreen()
        }
        else{
            mainView = this.getMailingList()
        }
        return(
            <View style={{flex: 1}}>
                {mainView}
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

    getMailingList(){
        this.getMailingListInformation()
        customFrequencyOptions = null
        customEventOptions = null
        if(this.state.customFrequency){
            customFrequencyOptions = this.getCustomFrequencyOptions()
        }
        if(this.state.customEvents){
            customEventOptions = this.getCustomEventOptions()
        }
        return(
        <ScrollView style={Styles.mailingListScrollView}>
            <Text style={Styles.title}>Email</Text>
            <TextInput
                onChangeText={(email) => this.setState({email})}
                style={Styles.textBox}
                placeholder="Email"
            />
            <Text style={Styles.title}>Frequency</Text>
            <View style={{flexDirection: 'row'}}>
                <Switch
                    value={this.state.weekly}
                    onValueChange={() => this.updateToWeekly()}
                />
                <Text>Weekly (Thursday, next week's events)</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Switch
                    value={this.state.daily}
                    onValueChange={() => this.updateToDaily()}
                />
                <Text>Daily (Every morning, today's events)</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Switch
                    value={this.state.customFrequency}
                    onValueChange={() => this.updateToCustomFrequency()}
                />
                <Text>Custom</Text>
            </View>
            {customFrequencyOptions}

            <Text style={Styles.title}>Event Type</Text>
            <View style={{flexDirection: 'row'}}>
                <Switch
                    value={this.state.all_categories}
                    onValueChange={() => this.updateToAllEvents()}
                />
                <Text>All Events</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Switch
                    value={this.state.customEvents}
                    onValueChange={() => this.updateToCustomEvents()}
                />
                <Text>Custom</Text>
            </View>
            {customEventOptions}
            <CustomButton 
                    text="Update Settings" 
                    onPress={()=>{}} 
                    buttonStyle={Styles.longButtonStyle}
                    textStyle={Styles.longButtonTextStyle}
                />
        </ScrollView>)
    }

    updateToWeekly(){
        this.setState({daily: false, daily_fri: false, daily_mon:false, daily_sat: false, daily_sun: false,
                        daily_thu: false, daily_tue:false, daily_wed: false, customFrequency: false, 
                        weekly: this.updateSwitch(this.state.weekly)})
    }

    updateToDaily(){
        this.setState({weekly: false, daily_fri: false, daily_mon:false, daily_sat: false, daily_sun: false,
                        daily_thu: false, daily_tue:false, daily_wed: false, 
                        daily: this.updateSwitch(this.state.daily), customFrequency: false})
    }

    updateToCustomFrequency(){
        this.setState({customFrequency: this.updateSwitch(this.state.customFrequency), weekly: false, daily: false})
    }
    updateToAllEvents(){
        this.setState({all_categories: this.updateSwitch(this.state.all_categories), customEvents: false, category_ids: []})
    }
    updateToCustomEvents(){
        this.setState({all_categories: false, customEvents: this.updateSwitch(this.state.customEvents)})
    }

    getCustomFrequencyOptions(){
        return(
        <View>
            <View style={Styles.embeddedSwitch}>
                <Switch
                    value={this.state.daily_sun}
                    onValueChange={() => this.setState({daily_sun: this.updateSwitch(this.state.daily_sun)})}
                />
                <Text>Sunday</Text>
            </View>
            <View style={Styles.embeddedSwitch}>
                <Switch
                    value={this.state.daily_mon}
                    onValueChange={() => this.setState({daily_mon: this.updateSwitch(this.state.daily_mon)})}
                />
                <Text>Monday</Text>
            </View>
            <View style={Styles.embeddedSwitch}>
                <Switch
                    value={this.state.daily_tue}
                    onValueChange={() => this.setState({daily_tue: this.updateSwitch(this.state.daily_tue)})}
                />
                <Text>Tuesday</Text>
            </View>
            <View style={Styles.embeddedSwitch}>
                <Switch
                    value={this.state.daily_wed}
                    onValueChange={() => this.setState({daily_wed: this.updateSwitch(this.state.daily_wed)})}
                />
                <Text>Wednesday</Text>
            </View>
            <View style={Styles.embeddedSwitch}>
                <Switch
                    value={this.state.daily_thu}
                    onValueChange={() => this.setState({daily_thu: this.updateSwitch(this.state.daily_thu)})}
                />
                <Text>Thursday</Text>
            </View>
            <View style={Styles.embeddedSwitch}>
                <Switch
                    value={this.state.daily_fri}
                    onValueChange={() => this.setState({daily_fri: this.updateSwitch(this.state.daily_fri)})}
                />
                <Text>Friday</Text>
            </View>
            <View style={Styles.embeddedSwitch}>
                <Switch
                    value={this.state.daily_sat}
                    onValueChange={() => this.setState({daily_sat: this.updateSwitch(this.state.daily_sat)})}
                />
                <Text>Saturday</Text>
            </View>
        </View>)
    }

    getCustomEventOptions(){
        return(
            <View>
                <FlatList
                    style={Styles.embeddedSwitch}
                    data={this.categories}
                    renderItem={({item}) => 
                        this.getCategorySwitch(item)
                    }
                    scrollEnabled='false'
                />
            </View>
        )
    }

    getCategorySwitch(category){
        isCategoryAlreadySelected = this.isInSelectedCategoryList(category)
        return(
            <View style={{flexDirection: 'row'}}>
                <Switch
                    value={isCategoryAlreadySelected}
                    onValueChange={() => this.updateSelectedCategoryList(category)}
                />
                <Text style={{alignSelf:"center"}}>{category[0]}</Text>
            </View>
        );
    }

    isInSelectedCategoryList(category){
        selectedCategoryList = this.state.category_ids
        return selectedCategoryList.includes(category[1])
    }

    updateSelectedCategoryList(category){
        selectedCategoryList = this.state.category_ids
        categoryNeedsRemoved = this.isInSelectedCategoryList(category)
        if(categoryNeedsRemoved){
            index = selectedCategoryList.indexOf(category[1])
            selectedCategoryList.splice(index, 1)
        }
        else{
            selectedCategoryList.push(category[1])
        }
        console.log(selectedCategoryList)
        this.setState({category_ids: selectedCategoryList})
    }

    async _fetchCategoryData(){
        key = "Categories"
        url = "https://api.muncieevents.com/v1/categories?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
        await this._refreshData(key, url)
        this.categories = await this.APICacher._getJSONFromStorage(key)
        this.categories = this.categories.map((category) => {return [category.attributes.name, category.id]})
        this.setState({isLoading:false, userToken: this.props.userToken})
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

    updateSwitch(value){
        if(value){
            return false
        }
        return true
    }

    getMailingListInformation(){
        fetch("https://api.muncieevents.com/v1/mailing-list/subscription?userToken=" + this.state.userToken + "&apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ")
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
        })
        .catch((error) =>{
            console.log(error)
        })
    }

    determineUserSubscription(responseJson){
        if(responseJson.data){
            this.setState({subscriptionStatus: "You are subscribed to the mailing list. Your current settings are shown below.", subscribed: true})
        }
        else{
            this.setState({subscriptionStatus: "You are not subscribed to the mailing list."})
        }
    }

    signUpToMailingList(){

    }

    updateMailingList(){

    }

    unsubscribeFromMailingList(){

    }

    isValidEmail(email){
        //this is a regex expression compliant with the rfc that matches 99.99% of active email addresses
        rfc2822 = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return rfc2822.test(email);
      }
}