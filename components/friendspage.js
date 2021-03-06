import React, { Component, useState } from 'react';
import { Button, StyleSheet, TextInput, View, Image, FlatList, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import bottomTabNav from './tabnavigation';

class FriendsPage extends Component{
        constructor(props){
            super(props);

            this.state = {
                email: "",
                password: "",
                isLoading: true,
                friendsData: [],
                friendsReqData: [],
            }
        }
        static navigationOptions = {
            header: null
        }

        componentDidMount() {
            this.unsubscribe = this.props.navigation.addListener('focus', () => {
              this.checkLoggedIn();
            });
          
            this.viewFriends();
            this.viewFriendRequests(); //NEEDS IMPLEMENTING
          }
        
          componentWillUnmount() {
            this.unsubscribe();
          }

        viewFriends = async () => {
            let id = await AsyncStorage.getItem('@session_id');
            let token = await AsyncStorage.getItem('@session_token');
            //let friends = await AsyncStorage.getItem();
            return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/friends", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": token
                }
            })
            .then((response) => {
                if(response.status === 200){
                   // console.log(response);
                    return response.json()
                }else if(response.status === 400){
                    throw 'Invalid request';
                }else{
                    throw 'Something went wrong';
                }
            })
            .then(async (responseJson) => {
                this.setState({
                    isLoading: false,
                    friendsData: responseJson
                  })
            })
            .catch((error) => {
                console.log(error);
            })
        }

        //needs implementing 
        viewFriendRequests = async () => {
            let id = await AsyncStorage.getItem('@session_id');
            let token = await AsyncStorage.getItem('@session_token');
            //let friends = await AsyncStorage.getItem();
            return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": token
                }
            })
            .then((response) => {
                if(response.status === 200){
                   // console.log(response);
                    return response.json()
                }else if(response.status === 401){
                    throw 'Need to login';
                }else if(response.status === 500){
                    throw 'Server error occured';
                }else{
                    throw 'Something went wrong';
                }
            })
            .then(async (responseJson) => {
                this.setState({
                    isLoading: false,
                    friendsReqData: responseJson
                  })
            })
            .catch((error) => {
                console.log(error);
            })
        }

        
        acceptFriend = async (friendToAccept) => {
            //let id = await AsyncStorage.getItem('@session_id');
            let token = await AsyncStorage.getItem('@session_token');
            //let friends = await AsyncStorage.getItem();
            return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + friendToAccept, {
                method: 'post',
                headers: {
                    //'Content-Type': 'application/json',
                    "X-Authorization": token
                }
            })
            .then((response) => {
                if(response.status === 200){
                   this.viewFriendRequests()
                }else if(response.status === 401){
                    throw 'Make sure you log in ';
                }else if(response.status === 403){
                    throw 'User has already been added';
                }else if(response.status === 404){
                    throw 'Nothing has been found';
                }else{
                    throw 'Something went wrong';
                }
            })
            .then(async (responseJson) => {
                console.log('Friend Request Accepted');
            })
            .catch((error) => {
                console.log(error);
            })
        }


        //needs work 
        declineFriend = async (friendToDecline) => {
            let token = await AsyncStorage.getItem('@session_token');
            return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + friendToDecline, {
                method: 'DELETE',
                headers: {
                    //'Content-Type': 'application/json',
                    "X-Authorization": token
                }
            })
            .then((response) => {
                if(response.status === 200){
                    this.viewFriendRequests()
                }else if(response.status === 401){
                    throw 'Make sure you log in ';
                }else if(response.status === 403){
                    throw 'User has already been removed';
                }else if(response.status === 404){
                    throw 'Nothing has been found';
                }else{
                    throw 'Something went wrong';
                }
            })
            .then(async (responseJson) => {
                console.log('Friend Request Declined')
            })
            .catch((error) => {
                console.log(error);
            })
        }
    
        checkLoggedIn = async () => {
            const value = await AsyncStorage.getItem('@session_token');
            if (value == null) {
                this.props.navigation.navigate('Login');
            }
          };


    render(){
        //check loaded 
        if (this.state.isLoading){
            return(  
                <View>
                <Text> loading... </Text>
                </View>          
           );
        }
        else {
            return(
                <View>
          <FlatList
          data={this.state.friendsData}
                renderItem={({item}) => (                    
                    <View>
                      <Text>Friend: 
                           Friend First Name: {item.user_givenname},  
                           Friend Second Name: {item.user_familyname}, 
                           Friend Email: {item.user_email} 
                      </Text>
                    </View>                 
                )}  
                keyExtractor={(item,index) => item.user_id.toString()}         
         />

        <FlatList
          data={this.state.friendsReqData}
                renderItem={({item}) => (                    
                    <View>
                      <Text>Friend Requests:
                           First Name: {item.first_name},  
                           Second Name: {item.last_name},  
                      </Text>
                      <View style={style.ButtonContainer}>
                
                      <Button title="Accept" text={style.text} onPress={() => this.acceptFriend(item.user_id)} color = "#8B0000" />
                      <Button title="Decline" text={style.text} onPress={() => this.declineFriend(item.user_id)} color = "#8B0000" />
                        </View>  
                    </View>                 
                )}  
                keyExtractor={(item,index) => item.user_id.toString()}         
         />


        </View>
                );
        }  

    }   
}

const style = StyleSheet.create({

        Container:{
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        }

        ,image :{
          
          }



    

});


export default FriendsPage