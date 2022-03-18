import React, { Component, useState } from 'react';
import { Button, StyleSheet, TextInput, View, Image, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

//import bottomTabNav from './tabnavigation';


class SinglePostPage extends Component{
        constructor(props){
            super(props);

            this.state = {
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                isLoading: true,
                data:'',
                myData: {},
                user_id: '',
                post_id: ''
            }

           
        }
        static navigationOptions = {
            header: null
        }
        
        componentDidMount() {
            this.unsubscribe = this.props.navigation.addListener('focus', () => {
              this.checkLoggedIn();
            });

            let { user_id } = this.props.route.params
            this.setState({user_id: user_id})
            let { post_id } = this.props.route.params
            this.setState({post_id: post_id})
            this.viewSinglePost();
          }
        
          componentWillUnmount() {
            this.unsubscribe();
          }

          

        checkLoggedIn = async () => {
            const value = await AsyncStorage.getItem('@session_token');
            if (value == null) {
                this.props.navigation.navigate('Login');
            }
          };

        
          viewSinglePost = async () => {
            //user_id=this.state.user_id
            //post_id=this.state.post_id
            let user_id = await AsyncStorage.getItem('@user_id');
            let post_id = await AsyncStorage.getItem('@post_id');
            //console.log(user_id)

            let token = await AsyncStorage.getItem('@session_token');
    
            return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
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
                }else if(response.status === 403){
                    throw 'Can only view the posts of yourself or your friends';
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
            })
            .catch((error) => {
                console.log(error);
            })
        }
        
    

    render(){
        return(
            <View style = {style.Container}>
                                   
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


export default SinglePostPage