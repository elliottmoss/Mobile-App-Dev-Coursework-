import React, { Component, useState } from 'react';
import { Button, StyleSheet, TextInput, View, Image, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import bottomTabNav from './tabnavigation';


class Profilescreen extends Component{
        constructor(props){
            super(props);

            this.state = {
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                isLoading: true,
                data:'',
                myData: {}
            }

           
        }
        static navigationOptions = {
            header: null
        }
        
        componentDidMount() {
            this.unsubscribe = this.props.navigation.addListener('focus', () => {
              this.checkLoggedIn();
            });

            let { data } = this.props.route.params
            this.setState({data: data})
            this.getMyInfo();
          }
        
          componentWillUnmount() {
            this.unsubscribe();
          }

          handleEmailInput = (email) => {
            //validate if email is in correct format
            this.setState({email: email})
        }
    
        handlePasswordInput = (pass) => {
            //validate if password has certain criteria
            this.setState({password: pass})
        }

        handleFirstNameInput = (first) => {
            //any validation for name
            this.setState({first_name: first})
        }

        handleSecondNameInput = (last) => {
            //any validation for name
            this.setState({last_name: last})
        }

        checkLoggedIn = async () => {
            const value = await AsyncStorage.getItem('@session_token');
            if (value == null) {
                this.props.navigation.navigate('Login');
            }
          };

          getMyInfo = async () => {

            let id = await AsyncStorage.getItem('@session_id');
            let token = await AsyncStorage.getItem('@session_token');
    
            return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": token
                },
                //body: JSON.stringify(this.state)
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                    throw 'Unauthorised';
                }else if(response.status === 404){
                    throw 'Not Found';
                }else if(response.status === 500){
                    throw 'Server Error';
                }else{
                    throw 'Something went wrong';
                }
            })
            .then(async (responseJson) => {
                    console.log(responseJson);
                    this.setState({
                        isLoading: false,
                        myData: responseJson,
                        first_name: responseJson.first_name,
                        last_name: responseJson.last_name,
                        email: responseJson.email
                      })
            })
            .catch((error) => {
                console.log(error);
            })
        }

        updateMyProfPic = async (data) => {
     
            let id = await AsyncStorage.getItem('@session_id');
            let token = await AsyncStorage.getItem('@session_token');
            let res = await fetch(data.base64);
            let blob = await res.blob();
      
            return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
                method: "POST",
                headers: {
                    "Content-Type": "image/png",
                    "X-Authorization": token
                },
                body: blob
            })
            .then((response) => {
                console.log("Picture added", response);
            })
            .catch((err) => {
                console.log(err);
            })
        }
        
        
    

    render(){
        return(
            <View style = {style.Container}>
            <Image source = {require(this.state.data)} style={style.ProfileImage} />

            
            <View style = {style.ButtonContainer}>
            <Text style={style.myText}>Current Information: 
                               My First Name: {this.state.myData.first_name},  
                               My Second Name: {this.state.myData.last_name}, 
                               My Email: {this.state.myData.email}, 
                               My Number of Friends: {this.state.myData.friend_count}    
                          </Text>
            <Button title="Edit My Profile:" text={style.text} onPress={() => this.props.navigation.navigate("MyInformation")} color="#8B0000"/> 

            <Button title="Update my profile photo" text={style.text} color = "#8B0000" onPress={() => this.updateMyProfPic(this.state.data)} />   
                                 
            </View>  

           
                
                
            </View>
        );
    }
    
    
}

const style = StyleSheet.create({

        Container:{
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        }

        ,ProfileImage:{
            flex:1,
            marginBottom: 40,
            margintop: 40,
            height: 200,
            width: 200,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
        }

        ,ButtonContainer:{
            flex: 2,
            backgroundColor: '#fff',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        }

        ,image :{
          
          }

        



    

});


export default Profilescreen