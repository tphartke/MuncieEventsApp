import React from 'react';
import {Text, View, Button, ScrollView} from 'react-native';
import TopBar from './top_bar';

export default class About extends React.Component {
    render() {
      return (
        <View style={{paddingTop:20}}>
            <View style={{height: 50, flexDirection: 'row'}}>
                <TopBar />
                </View>
                <View style={{paddingTop:30}}>
                
                  <Text style ={{textAlign:"center", fontSize:30, fontWeight:"bold", color:'#efe0d5', backgroundColor: '#cb532b'}}> About </Text>
                  <ScrollView>
                  <Text style ={{}}>
Muncie Events is a comprehensive event promotion tool provided to the city of Muncie, Indiana by the Muncie Arts and Culture Council and the Center for Business and Economic Research at Ball State University.
</Text>
<Text style={{paddingTop:5,paddingBottom:5}}>
  This service is guided by the following principles:
</Text>

<Text>
  <Text style ={{fontWeight:"bold"}}>Free:</Text> A community calendar should be free for everyone to view and contribute to.
</Text>
<Text>
  <Text style ={{fontWeight:"bold"}}>Democratic:</Text> The contents and function of a community calendar should be determined by the community.
</Text>
<Text>
  <Text style ={{fontWeight:"bold"}}>Egalitarian:</Text> All demographics, event types, and genres of expression should be promoted equally in order to break down social barriers and unite disparate components of the community.
</Text>
<Text>
  <Text style ={{fontWeight:"bold"}}>Decentralized:</Text> A decentralized, multifaceted approach to distributing a database of event information allows it to reach a wider audience by a variety of methods and with the participation of community partners.
</Text>
<Text>
  <Text style ={{fontWeight:"bold"}}>Evolving:</Text> The development of an online community calendar should be an ongoing process, guided by the community that it serves and the advancement of web technology.
</Text>

<Text style ={{fontWeight:"bold"}}>
Where Credit's Due
</Text>

<Text style ={{fontWeight:"bold"}}>
People</Text>
<Text>

Graham Watson - Web Developer, Administrator{"\n"} 

Erica Dee Fox - Web Developer {"\n"}
Benjamin Easley - Graphic Designer {"\n"}
Nicholas Boyum - Artist (map of Muncie background image){"\n"}
</Text>

<Text style = {{fontWeight:"bold"}}>Organizations</Text>
<Text>
Muncie Arts and Culture Council
{"\n"}
Center for Business and Economic Research
</Text>
<Text style= {{fontWeight:"bold"}}>
Software
</Text>
<Text>
CakePHPSite  -  framework
{"\n"}
jQuery  -  Javascript framework
{"\n"}
jQuery UI  -  User interface magic
{"\n"}
Magnific Popup  -  Elegant media popups
{"\n"}
jPicker  -  Color picker
{"\n"}
reCAPTCHA  -  Spam defense
{"\n"}
Google Analytics  -  Traffic analysis
{"\n"}
PhpStorm  -  IDE of choice
{"\n"}
Atom  -  Other IDE of choice
{"\n"}
Travis CI  -   Testing
{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}
 </Text>
 </ScrollView>
 
                </View>
        </View>
      )
    }
}