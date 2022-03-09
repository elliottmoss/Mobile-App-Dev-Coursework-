import React, { Component, useState } from 'react';
import { Button, StyleSheet, TextInput, View, Image, FlatList, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


class MyInfoScreen extends Component{
        constructor(props){
            super(props);

            this.state = {
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                isLoading: true,
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

          getMyInfo = async () => {

            let id = await AsyncStorage.getItem('@session_id');
            let token = await AsyncStorage.getItem('@session_token');
    
            return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": token
                },
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

        updateMyInfo = async () => {

            let to_send = {};

            if (this.state.first_name != this.state.myData.first_name){
              to_send['first_name'] = this.state.first_name;
            }
        
            if (this.state.last_name != this.state.myData.last_name){
              to_send['last_name'] = this.state.last_name;
            }
        
            if (this.state.email != this.state.myData.email){
              to_send['email'] = this.state.email;
            }
        
          
        
            console.log(JSON.stringify(to_send));

            let id = await AsyncStorage.getItem('@session_id');
            let token = await AsyncStorage.getItem('@session_token');
    
            return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Authorization": token
                },
                body: JSON.stringify(to_send)  
            })
            .then((response) => {
                if(response.status === 200){
                    console.log('Updated!')
                }else if(response.status === 400){
                    throw 'Bad Request';
                }else if(response.status === 401){
                    throw 'Unauthorised';
                }else if(response.status === 403){
                    throw 'Forbidden';
                }else if(response.status === 404){
                    throw 'Not found';
                }else if(response.status === 500){
                    throw 'Server Error';
                }else{
                    throw 'Something went wrong';
                }
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
                        <View>
                          <Text style={style.myText}>Current Information: 
                               My First Name: {this.state.myData.first_name},  
                               My Second Name: {this.state.myData.last_name}, 
                               My Email: {this.state.myData.email}, 
                               My Number of Friends: {this.state.myData.friend_count}    
                          </Text>
                        
                         
                        
                        
                         <TextInput  placeholder="First Name:" onChangeText={this.handleFirstNameInput} value={this.state.first_name} style={style.firstNameBox} />
                         <TextInput  placeholder="Second Name:" onChangeText={this.handleSecondNameInput} value={this.state.last_name} style={style.secondNameBox} />
                         <TextInput  placeholder="Email" onChangeText={this.handleEmailInput} value={this.state.email} style={style.emailBox} />
                         
                         <View style={style.ButtonContainer}>
                         <Button title="Update my information" text={style.text} color = "#8B0000" onPress={() => this.updateMyInfo()} />   
                         </View>
                        </View>
              
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

        

        ,myText:{
            fontWeight: 'bold',
            fontColor: 'red',
            fontFamily: 'lucida grande',
        }

        ,ButtonContainer: {
            margin: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
            color: "red",
            flex: 5
            }

        ,image :{
          
          }

        ,firstNameBox :{
        flex: 2,
        borderRadius: 30,
        border: "none",
        height: 50,
        width: "95%",
        marginBottom: 20,
        backgroundColor: "#FF7F7F",
        alignItems: "center",
        textAlign: "center",
        }
        ,secondNameBox :{
        flex: 2,
        borderRadius: 30,
        border: "none",
        height: 50,
        width: "95%",
        marginBottom: 20,
        backgroundColor: "#FF7F7F",
        alignItems: "center",
        textAlign: "center",
        }
        ,emailBox :{
        flex: 3,
        borderRadius: 30,
        border: "none",
        height: 50,
        width: "95%",
        marginBottom: 20,
        backgroundColor: "#FF7F7F",
        alignItems: "center",
        textAlign: "center",
        }
        ,passwordBox :{
        flex: 4,
        borderRadius: 30,
        border: "none",
        height: 50,
        width: "95%",
        marginBottom: 20,
        backgroundColor: "#FF7F7F",
        alignItems: "center",
        textAlign: "center",
        }



    

});


export default MyInfoScreen