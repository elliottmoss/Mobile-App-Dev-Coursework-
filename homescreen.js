import React, {Component} from 'react';
import { Button, StyleSheet, TextInput, View, Image, Text, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import bottomTabNav from './tabnavigation';


class MyHomeScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
     // listData: [],
      location: null,
      error_message: null,
      user_id: '',
      text: '',
      textToUpload: '',
      postData:[]
    }
  }

  

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.viewPosts();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  
  handlePostInput = (text) => {
    
    this.setState({text: text})
  }


  //needs work - all posts need to be displayed
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
    })
    .catch((error) => {
        console.log(error);
    })
}

//needs work
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
        throw 'Forbidden - You have already liked this post';
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

//needs work
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
      throw 'Forbidden - No Like to remove';
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render() {

    if (this.state.isLoading){
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    }else{
      return (
        <View style={style.Container}>
          
          <FlatList
          data={this.state.postData}
                renderItem={({item}) => (                    
                    <View>
                      <Text>List of my posts and friends posts: 
                           Post: {item.text}
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
                 

                
  
         <View style={style.Button}>
         <Button title="Logout" style={style.Button} onPress={() => this.props.navigation.navigate("Logout")} color="#8B0000"/>
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
      alignItems: 'flex-start',
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
  width:"100%",
  borderRadius:25,
  height:50,
  alignItems:"center",
  justifyContent:"center",
  marginTop:40,
  backgroundColor:"#8B0000",  
  }
});


export default MyHomeScreen;
