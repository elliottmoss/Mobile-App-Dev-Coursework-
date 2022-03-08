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
                password: ""
            }
        }
        static navigationOptions = {
            header: null
        }

        
        
        
    

    render(){
        return(
            <View style = {style.Container}>
            <Image source = {require("../assets/defaultphoto.png")} style={style.ProfileImage} />


            <View style = {style.ButtonContainer}>
            <Button title="Edit My Profile:" text={style.text} onPress={() => this.props.navigation.navigate("MyInformation")} color="#8B0000"/>          
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