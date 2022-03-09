import React, { Component, useState } from 'react';
import { Button, StyleSheet, TextInput, View, Image, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import CameraScreen from './camerascreen';
import MyHomeScreen from './homescreen';
import Profilescreen from './profilescreen';
import FriendsPage from './friendspage';
import SearchScreen from './searchscreen';

const Tab = createBottomTabNavigator();



        
        

    const BottomTabNav = () => {
        return( 
                 <Tab.Navigator screenOptions={{
                      tabBarInactiveBackgroundColor: "#8B0000",
                      tabBarActiveBackgroundColor: "#ffcccb",
                      tabBarInactiveTintColor: "white",
                      tabBarActiveTintColor: "grey",
                      justifyContent: "flex-end",
                      headerShown: false
                  }
                  }
                  text={style.TabText}
                  >

                    <Tab.Screen 
                    name="MyHomescreen" 
                    component={MyHomeScreen} 
                    options={{
                        title: 'Home',
                        //tabBarLabel:({ focused,color })=>(<Text style= {{color:focused?"black":"grey"}}>Home</Text>),
                        tabBarIcon: ({size,focused,color}) => {
                          return (
                            <Image
                              style={{ width: size, height: size }}
                              source={{
                                uri:
                                "https://cdn3.iconfinder.com/data/icons/user-interface-48/53/home-screen-512.png",
                              }}
                            />
                          );
                        },
                      }} />

                    <Tab.Screen 
                    name="Camerascreen" 
                    component={CameraScreen} 
                    options={{
                        title: 'Camera',
                        tabBarIcon: ({size,focused,color}) => {
                          return (
                            <Image
                              style={{ width: size, height: size }}
                              source={{
                                uri:
                                "http://cdn.onlinewebfonts.com/svg/img_211436.png",
                              }}
                            />
                          );
                        },
                      }} />


                    <Tab.Screen 
                    name="Profilescreen" 
                    component={Profilescreen} 
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({size,focused,color}) => {
                          return (
                            <Image
                              style={{ width: size, height: size }}
                              source={{
                                uri:
                                "http://cdn.onlinewebfonts.com/svg/img_206976.png",
                              }}
                            />
                          );
                        },
                      }}
                    />

                    <Tab.Screen 
                    name="Friendspage" 
                    component={FriendsPage} 
                    options={{
                        title: 'Friends',
                        tabBarIcon: ({size,focused,color}) => {
                          return (
                            <Image
                              style={{ width: size, height: size }}
                              source={{
                                uri:
                                "https://th.bing.com/th/id/R.e15fcad0d694dd4364003bd99818c05c?rik=kolI7ScoEqK1eg&riu=http%3a%2f%2fpluspng.com%2fimg-png%2ftwo-friends-png-black-and-white-collaboration-icon-2-1200.png&ehk=wNcmGoLjACDJeYb67nY9RcKMbLS8txxsAI63imKXC3o%3d&risl=&pid=ImgRaw&r=0",
                              }}
                            />
                          );
                        },
                      }}
                    />

                    <Tab.Screen 
                    name="Search" 
                    component={SearchScreen} 
                    options={{
                        title: 'Search',
                        tabBarIcon: ({size,focused,color}) => {
                          return (
                            <Image
                              style={{ width: size, height: size }}
                              source={{
                                uri:
                                "https://th.bing.com/th/id/R.9cd163493f44f92bae49015d62ca1031?rik=2ko1XWcdjUu%2fnw&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fdownload_591.png&ehk=%2bMfzynkyB5BC0mlGFuUDqkPvM9%2ftJ4cQ05hz02f7d3A%3d&risl=&pid=ImgRaw&r=0",
                              }}
                            />
                          );
                        },
                      }}
                    />

                </Tab.Navigator>
        );
    }
    
    


const style = StyleSheet.create({

        Container:{
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'bottom',
        }

        ,TabText:{
          color: "black",
          fontWeight: "bold",
          fontSize: 20
          
        }

        ,image :{
          
          }



    

});


export default BottomTabNav