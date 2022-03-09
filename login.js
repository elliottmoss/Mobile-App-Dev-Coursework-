import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, View, Image, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';



class LoginScreen extends Component{
        constructor(props){
            super(props);

            this.state = {
                email: "ash@mmu.ac.uk",
                password: "hello123"
              //email: "",
              //password: ""
            }
        }
        static navigationOptions = {
            header: null
        }
        

    handleEmailInput = (email) => {
        //validate if email is in correct format
        this.setState({email: email})
    }

    handlePasswordInput = (pass) => {
        //validate if password has certain criteria
        this.setState({password: pass})
    }


    login = async () => {

        //Validation for email and password to be added here

        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Invalid email or password';
            }else if(response.status === 500){
                throw 'Server Error';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_id', responseJson.id);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                this.props.navigation.navigate("HomeScreen");
        })
        .catch((error) => {
            console.log(error);
        })
    }


    render(){
        return(
            <View style = {style.Container}>
                <Image source = {require("../assets/loginlogo.jpg")} style={style.image} />

                <TextInput style={style.TextInput} placeholder="Enter Email:" onChangeText={this.handleEmailInput} value={this.state.email} />
                <TextInput style={style.TextInput} placeholder="Enter Password:" onChangeText={this.handlePasswordInput} value={this.state.password} secureTextEntry={true} />
                
                <View style={style.ButtonContainer}>

                <Button title="Login" text={style.text} onPress={() => this.login()} color = "#8B0000" />
                <Button title="Signup"  text={style.text} onPress={() => this.props.navigation.navigate("SignUp")} color = "#8B0000"/>

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

        ,image :{
            marginBottom: 40,
            margintop: 5,
            height: 200,
            width: 200,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
          }

        ,inputView: {
        backgroundColor: "#FF7F7F",
        borderRadius: 30,
        width: "95%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
        textAlign: "center",
        border: "none",
        }

        ,
        ButtonContainer: {
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: "red",
        }

        ,TextInput:{
        borderRadius: 30,
        border: "none",
        height: 50,
        width: "95%",
        marginBottom: 20,
        backgroundColor: "#FF7F7F",
        alignItems: "center",
        textAlign: "center",
        }
    
        ,Button:{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 4,
            elevation: 3,
            backgroundColor: "red",
        }

        ,text: {
            fontSize: 16,
            lineHeight: 21,
            fontWeight: 'bold',
            letterSpacing: 0.25,
            color: 'black',
          },



    

});


export default LoginScreen