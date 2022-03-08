import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, View, Image, FlatList, Text } from 'react-native';
//import { SearchBar } from "react-native-elements";
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import bottomTabNav from './tabnavigation';

class SearchScreen extends Component{
        constructor(props){
            super(props);

            this.state = {
                email: "",
                password: "",
                isLoading: true,
                first_name: '',
                last_name: '',
                listData: []
            }
        }
        static navigationOptions = {
            header: null
        }

        componentDidMount() {
            this.unsubscribe = this.props.navigation.addListener('focus', () => {
              this.checkLoggedIn();
            });
          
            this.showFriends();
          }
        
          componentWillUnmount() {
            this.unsubscribe();
          }

          handleSearchInput = (first_name) => {
            //validate if email is in correct format
            this.setState({first_name: first_name})
        }

          showFriends = async (first_name) => {
            const value = await AsyncStorage.getItem('@session_token');
            return fetch("http://localhost:3333/api/1.0.0/search?q=" + first_name, {
                  'headers': {
                    'X-Authorization':  value
                  }
                })
                .then((response) => {
                    if(response.status === 200){
                        return response.json()
                    }else if(response.status === 401){
                      this.props.navigation.navigate("Login");
                    }else{
                        throw 'Something went wrong';
                    }
                })
                .then((responseJson) => {
                  this.setState({
                    isLoading: false,
                    listData: responseJson
                  })
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
                <TextInput style={style.TextInput} placeholder="Enter Name to search" onChangeText={this.handleSearchInput} value={this.state.first_name} />
                <Button title="Search" text={style.text} onPress={ this.showFriends(this.state.first_name) } color = "#8B0000" />
                    <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                    <View>
                      <Text>{item.user_givenname} {item.user_familyname}</Text>
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


export default SearchScreen