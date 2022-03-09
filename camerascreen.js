import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, View, Image, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
// import NativeAsyncLocalStorage from 'react-native/Libraries/Storage/NativeAsyncLocalStorage';

import bottomTabNav from './tabnavigation';

class CameraScreen extends Component{
        constructor(props){
            super(props);

            this.state = {
                email: "",
                password: "",
                hasPermission: null,
                type: Camera.Constants.Type.back, //default back camera
                error_message: null
            }
        }

        static navigationOptions = {
            header: null
        }
        
        async componentDidMount(){
            const { status } = await Camera.requestCameraPermissionsAsync();
            this.setState({hasPermission: status === 'granted'});
          }

          sendToServer = async (data) => {
            // Get these from AsyncStorage
            let id = 10; // need changing 
            let token = "a3b0601e54775e60b01664b1a5273d54" //need changing 
      
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

        takePicture = async () => {
            if(this.camera){
                const options = {
                    quality: 0.5, 
                    base64: true,
                    onPictureSaved: (data) => this.sendToServer(data)
                };
                await this.camera.takePictureAsync(options); 
            } 
        }




    render(){
        if(this.state.hasPermission){
            return(
              <View style={style.container}>
                <Camera style={style.camera} type={this.state.type}>
                  <View style={style.buttonContainer}>
                    <TouchableOpacity
                      style={style.button}
                      onPress={() => {
                        let type = type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back;
      
                        this.setState({type: type});
                      }}>
                      <Text style={style.text}> Flip camera </Text>
                    </TouchableOpacity>
                  </View>
                </Camera>
              </View>
            );
          }else{
            return(
              <Text>No access to camera</Text>
            );
          }
    }
    
    
}

const style = StyleSheet.create({

  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },


    

});


export default CameraScreen