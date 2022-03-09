import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, View, Image, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LogoutScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            token: ''
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });        
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate("Login");
        }
    }

    logout = async () => {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate("Login");
            }else if(response.status === 401){
                throw 'Unauthorised';
            }else if(response.status === 500){
                throw 'Server Error';
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return (
            <View>
                <Text style={{fontSize:18, fontWeight:'bold', padding:5, margin:5}}> You're Now Logging Out </Text>
                <Button title="Click here to confirm logout" onPress={() => this.logout()} color="#8B0000"/>
                <Button title="Click here to cancel logout" onPress={() => this.props.navigation.navigate("HomeScreen")} color="#8B0000"/>
            </View>
        )
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
  width:"95%",
  borderRadius:25,
  height:50,
  alignItems:"center",
  justifyContent:"center",
  marginTop:40,
  backgroundColor:"#8B0000",  
  }
});

export default LogoutScreen;