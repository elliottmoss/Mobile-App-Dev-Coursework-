import React, { Component, useState } from 'react';
import { Button, StyleSheet, TextInput, View, Image, Text, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import bottomTabNav from './tabnavigation';


class Userprofilescreen extends Component{
        constructor(props){
            super(props);

            this.state = {
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                isLoading: true,
                myData: {},
                 listData: [],
                 location: null,
                 error_message: null,
                 user_id: '',
                 text: '',
                 textToUpload: '',
                 postData:[],
                // id:''
            }

           
        }
        static navigationOptions = {
            header: null
        }
        
        componentDidMount() {
            this.unsubscribe = this.props.navigation.addListener('focus', () => {
              this.checkLoggedIn();
            });
          
            this.getUserInfo();
          }
        
          componentWillUnmount() {
            this.unsubscribe();
          }

        /*  handleEmailInput = (email) => {
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
        }*/

        checkLoggedIn = async () => {
            const value = await AsyncStorage.getItem('@session_token');
            if (value == null) {
                this.props.navigation.navigate('Login');
            }
          };

           //needs work - all posts need to be displayed - and for the user of profile you are looking at
  viewPosts = async () => {
    let id = await AsyncStorage.getItem('@session_id');
    let token = await AsyncStorage.getItem('@session_token');
    //let friends = await AsyncStorage.getItem();
    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
        method: 'get',
        headers: {
           // 'Content-Type': 'application/json',
            "X-Authorization": token
        }
    })
    .then((response) => {
        if(response.status === 200){
            console.log(response);
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
        this.setState({
            isLoading: false,
            postData: responseJson
          })
       //   console.log(responseJson);
    })
    .catch((error) => {
        console.log(error);
    })
}

//needs work and for the user of profile you are looking at
likePost = async (user_id) => {
  let to_send = {
    user_id: parseInt(this.state.id)
  };

  let id = await AsyncStorage.getItem('@session_id');
  let token = await AsyncStorage.getItem('@session_token');
  //let friends = await AsyncStorage.getItem();
  return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + user_id + "/like", {
      method: 'post',
      headers: {
          "X-Authorization": token
      }
  })
  .then((response) => {
      if(response.status === 200){
         // console.log(response);
          return response.json()
      }else if(response.status === 401){
          throw 'Unauthorised';
      }else if(response.status === 403){
        throw 'Forbidden - You may have already liked this post or you may not be friends with this person';
    }else if(response.status === 404){
      throw 'Not Found';
  }else if(response.status === 500){
    throw 'Server Error';
}else{
          throw 'Something went wrong';
      }
  })
  .then(async (responseJson) => {
    this.setState({
      isLoading: false,
      postData: responseJson
    })
      console.log('Post Liked');
  })
  .catch((error) => {
      console.log(error);
  })
}

//needs work and for the user of profile you are looking at
removeLikePost = async (user_id) => {
  let to_send = {
    user_id: parseInt(this.state.id)
  };

  let id = await AsyncStorage.getItem('@session_id');
  let token = await AsyncStorage.getItem('@session_token');
  //let friends = await AsyncStorage.getItem();
  return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + user_id + "/like", {
      method: 'DELETE',
      headers: {
          "X-Authorization": token
      }
  })
  .then((response) => {
      if(response.status === 200){
         // console.log(response);
          return response.json()
      }else if(response.status === 401){
        throw 'Unauthorised';
    }else if(response.status === 403){
      throw 'Forbidden - No Like to remove or you may not be friends with this person';
  }else if(response.status === 404){
    throw 'Not Found';
}else if(response.status === 500){
  throw 'Server Error';
}else{
        throw 'Something went wrong';
    }
  })
  .then(async (responseJson) => {
    this.setState({
      isLoading: false,
      postData: responseJson
    })
      console.log('Post unliked');
  })
  .catch((error) => {
      console.log(error);
  })
}
// needs work 
  uploadPost = async (text) => {

    let to_send = {
      text: text,
    };

  let id = await AsyncStorage.getItem('@session_id');
  let token = await AsyncStorage.getItem('@session_token');
  //let friends = await AsyncStorage.getItem();
  return fetch("http://localhost:3333/api/1.0.0/user/" + id +"/post", {
      method: 'post',
      headers: {
         'Content-Type': 'application/json',
          "X-Authorization": token
      },
      body: JSON.stringify(to_send)
  })
  .then((response) => {
      if(response.status === 201){
          return response.json()
      }else if(response.status === 401){
          throw 'Unauthorised';
      }else if(response.status === 404){
        throw 'Not found';
      }else if(response.status === 500){
        throw 'Server Error';
       }else{
          throw 'Something went wrong';
      }
  })
  .then(async (responseJson) => {
      console.log('Post Uploaded');
  })
  .catch((error) => {
      console.log(error);
  })
}

//needs work 
removePost = async (user_id) => {
  let to_send = {
    user_id: parseInt(this.state.id)
  };

  let token = await AsyncStorage.getItem('@session_token');
  let id = await AsyncStorage.getItem('@session_id');
  return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + user_id, {
      method: 'DELETE',
      headers: {
          //'Content-Type': 'application/json',
          "X-Authorization": token
      }
  })
  .then((response) => {
      if(response.status === 200){
          this.viewPosts()
      }else if(response.status === 401){
          throw 'Unauthorised';
      }else if(response.status === 403){
          throw 'Forbidden - you can only delete your own posts';
      }else if(response.status === 404){
          throw 'Nothing has been found';
      }else if(response.status === 500){
        throw 'Server Error';
     }else{
          throw 'Something went wrong';
      }
  })
  .then(async (responseJson) => {
      console.log('Post Removed')
  })
  .catch((error) => {
      console.log(error);
  })
}

//needs work - check all post stuff is working correctly for other users profile 
editPost = async (user_id,text) => {
 
  let to_send = {};

  if (this.state.user_id != this.state.myData.user_id){
    to_send['user_id'] = this.state.user_id;
  }

  if (this.state.text != this.state.myData.text){
    to_send['text'] = this.state.text;
  }


  let token = await AsyncStorage.getItem('@session_token');
  let id = await AsyncStorage.getItem('@session_id');
  return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + user_id, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          "X-Authorization": token
      },
      body: JSON.stringify(to_send)
  })
  .then((response) => {
      if(response.status === 200){
          this.viewPosts()
      }else if(response.status === 401){
          throw 'Unauthorised';
      }else if(response.status === 403){
          throw 'Forbidden - you can only edit your own posts';
      }else if(response.status === 404){
          throw 'Nothing has been found';
      }else if(response.status === 500){
        throw 'Server Error';
     }else{
          throw 'Something went wrong';
      }
  })
  .then(async (responseJson) => {
      console.log('Post Removed')
  })
  .catch((error) => {
      console.log(error);
  })
}
// needs work 
          getUserInfo = async () => {

            let id = await AsyncStorage.getItem('@session_id');
            //PULL IN USERS ID OF PROFILE IT IS 

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
        
        
    

    render(){
        return(
            <View style = {style.Container}>
            <Image source = {require("../assets/defaultphoto.png")} style={style.ProfileImage} />
            <Text style={style.Title}>User Wall</Text>
            
            <View style = {style.ButtonContainer}>
            <Text style={style.myText}>Current Information: 
                               User First Name: {this.state.myData.first_name},  
                               User Second Name: {this.state.myData.last_name}, 
                               User Email: {this.state.myData.email}, 
                               User Number of Friends: {this.state.myData.friend_count}    
                          </Text>
             </View>  

             
          <FlatList
          data={this.state.postData}
                renderItem={({item}) => (                    
                    <View>
                      
                      <Text> 
                           Name: {item.author.first_name + ""} {item.author.last_name}
                           Posted: {item.text}
                      </Text>
                      <Button title="Like" style={style.Button} onPress={() => this.likePost(item.post_id)} color="#8B0000"/>
                      <Button title="Remove Like" style={style.Button} onPress={() => this.removeLikePost(item.post_id)} color="#8B0000"/>
                      <Button title="Delete Post" style={style.Button} onPress={() => this.removePost(item.post_id)} color="#8B0000"/>
                    </View>                 
                )}  
               keyExtractor={(item,index) => item.id}
               //keyExtractor={(item,index) => item.user_id.toString()} 
               //  ADD THIS FOR UPLOAD  <Button title="Edit Post" style={style.Button} onPress={() => this.editPost(item.post_id, item.text)} color="#8B0000"/>              
         />

                  
                <TextInput style={style.TextInput} placeholder="Enter Text To Post" onTextChange= {(text) => this.setState({text})}/>
               
                <View>
                <Button title="Upload Post" text={style.Button} onPress={() => this.uploadPost(this.state.text)} color = "#8B0000" />
               
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
        },

        

        Title:{
            //flex:2,
            marginTop: 10,
            marginBottom: 10,
            paddingVertical: 8,
            borderWidth: 4,
            borderColor: "#20232a",
            borderRadius: 6,
            backgroundColor: "#8B0000",
            color: "#20232a",
            alignContent: "center",
            fontSize: 30,
            fontWeight: "bold"
        }

        



    

});


export default Userprofilescreen