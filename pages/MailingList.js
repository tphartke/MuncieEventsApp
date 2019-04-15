import React from 'react';
import {View, Text, Switch, TextInput, FlatList, ScrollView} from 'react-native'
import Styles from './Styles'
import CustomButton from './CustomButton';
import LoadingScreen from '../components/LoadingScreen';
import APICacher from '../APICacher'
import InternetError from '../components/InternetError';

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
                        subscribed: false,
                        statusMessage: "",
                        changesMade: false
                     })
        this.APICacher = new APICacher();
        categories = []
    }

    componentDidMount(){
        this._fetchCategoryAndSubscriptionData()
    }

    render(){
        console.log("Render")
        console.log(this.state.category_ids)
        mainView = null
        if(this.state.isLoading){
            mainView = this.getLoadingScreen()
        }
        else if(this.state.changesMade){
            mainView = this.getFinishedView()
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

    getFinishedView(){
        return(<Text>{this.state.statusMessage}</Text>)
    }

    getLoadingScreen(){
        return(
          <View>
            <LoadingScreen/>
          </View>
        );
      }

    getMailingList(){
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
            <Text>{this.state.subscriptionStatus}</Text>
            <Text style={Styles.title}>Email</Text>
            <TextInput
                value={this.state.email}
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
            <Text>{this.state.statusMessage}</Text>
            <CustomButton 
                    text="Update Settings" 
                    onPress={()=>{this.signUpOrUpdate()}} 
                    buttonStyle={Styles.longButtonStyle}
                    textStyle={Styles.longButtonTextStyle}
                />
            <CustomButton 
                    text="Unsubscribe From Mailing List" 
                    onPress={()=>{this.unsubscribeFromMailingList()}} 
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
        isCategoryAlreadySelected = this.isInSelectedCategoryList(category[1])
        console.log(isCategoryAlreadySelected)
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

    isInSelectedCategoryList(id){
        selectedCategoryList = this.state.category_ids
        return selectedCategoryList.includes(id)
    }

    updateSelectedCategoryList(category){
        selectedCategoryList = this.state.category_ids
        categoryNeedsRemoved = this.isInSelectedCategoryList(category[1])
        if(categoryNeedsRemoved){
            index = selectedCategoryList.indexOf(category[1])
            selectedCategoryList.splice(index, 1)
        }
        else{
            selectedCategoryList.push(category[1])
        }
        this.setState({category_ids: selectedCategoryList})
    }

    async _fetchCategoryAndSubscriptionData(){
        key = "Categories"
        url = "https://api.muncieevents.com/v1/categories?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ"
        await this._refreshData(key, url)
        this.categories = await this.APICacher._getJSONFromStorage(key)
        this.categories = this.categories.map((category) => {return [category.attributes.name, category.id]})
        this.getMailingListInformation()
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
        fetch("https://api.muncieevents.com/v1/mailing-list/subscription?userToken=" + this.props.userToken + "&apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ")
        .then((response) => response.json())
        .then((responseJson) => {
          this.determineUserSubscription(responseJson)
        })
        .catch((error) =>{
            console.log(error)
        })
    }

    determineUserSubscription(responseJson){
        if(responseJson.data){
            data = responseJson.data.attributes
            currentCategoryIDs = this.getSelectedCategories(responseJson)
            customEventsIsSelected = false
            if(currentCategoryIDs.length < 10){
                customEventsIsSelected = true
            }
            customFrequencyIsSelected = false
            dailyIsSelected = false
            if(data.daily_mon && data.daily_tue && data.daily_wed && data.daily_thu && data.daily_fri && data.daily_sat && data.daily_sun){
                dailyIsSelected = true
            }
            else if(data.daily_mon || data.daily_tue || data.daily_wed || data.daily_thu || data.daily_fri || data.daily_sat || data.daily_sun){
                customFrequencyIsSelected = true
            }
            this.setState({subscriptionStatus: "You are subscribed to the mailing list. Your current settings are shown below.", subscribed: true, 
                            isLoading:false, userToken: this.props.userToken, all_categories: data.all_categories, daily_fri: data.daily_fri, 
                            daily_mon: data.daily_mon, daily_sat: data.daily_sat, daily_sun: data.daily_sun, daily_thu: data.daily_thu, 
                            daily_tue: data.daily_tue, daily_wed: data.daily_wed, category_ids: currentCategoryIDs, 
                            weekly: data.weekly, customEvents: customEventsIsSelected, customFrequency: customFrequencyIsSelected,
                            daily: dailyIsSelected, email: data.email})
        }
        else{
            this.setState({subscriptionStatus: "You are not subscribed to the mailing list.", isLoading:false, userToken: this.props.userToken})
        }
    }

    getSelectedCategories(responseJson){
        selectedCategories = []
        givencategories = responseJson.data.relationships.categories.data
        givencategories.forEach(function(category){
            selectedCategories.push(category.id)
        })
        return selectedCategories
    }
    
    signUpOrUpdate(){
        if(this.state.subscribed){
            this.updateMailingList()
        }
        else{
            this.signUpToMailingList()
        }
    }

    signUpToMailingList(){
        fetch("https://api.muncieevents.com/v1/mailing-list/subscribe?userToken=" + this.state.userToken + "&apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ", 
          {method: "POST",
          headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/json',
            },
          body: JSON.stringify({
              email: this.state.email, 
              all_categories: this.state.all_categories,
              category_ids: this.state.category_ids,
              weekly: this.state.weekly,
              daily: this.state.daily,
              daily_sun: this.state.daily_sun,
              daily_mon: this.state.daily_mon,
              daily_tue: this.state.daily_tue,
              daily_wed: this.state.daily_wed,
              daily_thu: this.state.daily_thu,
              daily_fri: this.state.daily_fri,
              daily_sat: this.state.daily_sat,
          })
      })
      .then(() => {
        this.setState({changesMade: true, statusMessage: "You are now subscribed to the mailing list."})
      })
        .catch((error) =>{
           console.log(error)
        })
    }

    updateMailingList(){
        fetch("https://api.muncieevents.com/v1/mailing-list/subscription?userToken=" + this.state.userToken + "&apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ", 
          {method: "PUT",
          headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/json',
            },
          body: JSON.stringify({
              email: this.state.email, 
              all_categories: this.state.all_categories,
              category_ids: this.state.category_ids,
              weekly: this.state.weekly,
              daily: this.state.daily,
              daily_sun: this.state.daily_sun,
              daily_mon: this.state.daily_mon,
              daily_tue: this.state.daily_tue,
              daily_wed: this.state.daily_wed,
              daily_thu: this.state.daily_thu,
              daily_fri: this.state.daily_fri,
              daily_sat: this.state.daily_sat,
          })
      })
      .then(() => {
        this.setState({changesMade: true, statusMessage: "Mailing list preferences updated"})
      })
        .catch((error) =>{
           console.log(error)
        })
    }

    unsubscribeFromMailingList(){
        fetch("https://api.muncieevents.com/v1/mailing-list/subscription?userToken=" + this.state.userToken + "&apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ", 
          {method: "DELETE",
          headers: {
            Accept: 'application/vnd.api+json',
            'Content-Type': 'application/json',
            },
      })
      .then(() => {
        this.setState({changesMade: true, statusMessage: "You have been unsubscribed from the mailing list"})
      })
        .catch((error) =>{
           console.log(error)
        })
    }

    isValidEmail(email){
        //this is a regex expression compliant with the rfc that matches 99.99% of active email addresses
        rfc2822 = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return rfc2822.test(email);
      }
}