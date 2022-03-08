import React, { Component } from 'react';
// import { Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LoginScreen from './components/login';
import HomeScreen from './components/homescreen';
import LogoutScreen from './components/logout';
import SignUpScreen from './components/signup';
import CameraScreen from './components/camerascreen';
import SettingsPage from './components/settingspage';
import BottomTabNav from './components/tabnavigation';
import FriendsPage from './components/friendspage';
import Profilescreen from './components/profilescreen';
import SearchScreen from './components/searchscreen';
import MyInfoScreen from './components/myinfoscreen';
import Userprofilescreen from './components/userprofilescreen';

const myStack = createNativeStackNavigator();



class App extends Component {

  constructor(props){
    super(props);

  }




  render() {
    //attempt to get logout button in header of stack nav 
//<myStack.Screen name="Logout" component={LogoutScreen} options={{headerRight: () => ( <Button title="Logout" style={style.Button} onPress={() => this.props.navigation.navigate("Logout")} color="#8B0000"/>)}} />

    return (
    
      <NavigationContainer>
        <myStack.Navigator>
        <myStack.Screen name="Login" component={LoginScreen} />
        <myStack.Screen name="HomeScreen" component={BottomTabNav} />
        <myStack.Screen name="Logout" component={LogoutScreen} />
        <myStack.Screen name="SignUp" component={SignUpScreen} />
        <myStack.Screen name="Camerascreen" component={CameraScreen} />
        <myStack.Screen name="Settingspage" component={SettingsPage} />
        <myStack.Screen name="Friendspage" component={FriendsPage} />
        <myStack.Screen name="Profilescreen" component={Profilescreen} />
        <myStack.Screen name="Search" component={SearchScreen} />
        <myStack.Screen name="MyInformation" component={MyInfoScreen} />
        <myStack.Screen name="UserProfile" component={Userprofilescreen} />

        </myStack.Navigator>

      </NavigationContainer>

      
    );
  }

}

// const styles = StyleSheet.create({
// });

export default App

