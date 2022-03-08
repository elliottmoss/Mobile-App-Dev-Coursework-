import React, { Component, useState } from 'react';
import { Button, StyleSheet, TextInput, View, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


class SettingsPage extends Component{
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
          
          }



    

});


export default SettingsPage