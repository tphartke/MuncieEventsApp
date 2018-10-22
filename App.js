import React from 'react';
import {ActivityIndicator, Text, View, FlatList} from 'react-native';
import TopBar from './pages/top_bar';

export default class FetchExample extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    return fetch('https://api.muncieevents.com/v1/events/future?apikey=E7pQZbKGtPcOmKb6ednrQABtnW7vcGqJ')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.data,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }



  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    return(
      <View style={{flex: 10, paddingTop:20}}>
        <TopBar />
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => 
          <Text>{item.attributes.title}, {item.attributes.date} {'\n'}</Text>
          }
          keyExtractor={({id}, index) => id}
        />
</View>
    );
  }
}