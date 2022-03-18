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
      text: "",
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
    //console.log(this.state.text)
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
       //   console.log(responseJson);
    })
    .catch((error) => {
        console.log(error);
    })
}

//needs work
likePost = async (post_id) => {
  let to_send = {
    post_id: parseInt(this.state.id)
  };

  let id = await AsyncStorage.getItem('@session_id');
  let token = await AsyncStorage.getItem('@session_token');
  //let friends = await AsyncStorage.getItem();
  return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id + "/like", {
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

//needs work
removeLikePost = async (post_id) => {
  let to_send = {
    post_id: parseInt(this.state.id)
  };

  let id = await AsyncStorage.getItem('@session_id');
  let token = await AsyncStorage.getItem('@session_token');
  //let friends = await AsyncStorage.getItem();
  return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id + "/like", {
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
    this.viewPosts()
})
.catch((error) => {
    console.log(error);
})
}


removePost = async (post_id) => {
  let to_send = {
    post_id: parseInt(this.state.id)
  };

  let token = await AsyncStorage.getItem('@session_token');
  let id = await AsyncStorage.getItem('@session_id');
  return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id, {
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
    this.viewPosts()
      console.log('Post Removed')
  })
  .catch((error) => {
      console.log(error);
  })
}

editPost = async (post_id,text) => {
 
  let to_send = {};

  if (this.state.post_id != this.state.myData.post_id){
    to_send['post_id'] = this.state.post_id;
  }

  if (this.state.text != this.state.myData.text){
    to_send['text'] = this.state.text;
  }


  let token = await AsyncStorage.getItem('@session_token');
  let id = await AsyncStorage.getItem('@session_id');
  return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + post_id, {
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
    this.viewPosts()
      console.log('Post Edited')
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
             
          <Text style={style.Title}>My Wall</Text>
          <FlatList
          style = {style.list}
          data={this.state.postData}
                renderItem={({item}) => (                    
                    <View>
                      
                      <Text style={style.subTitle}> 
                           Name: {item.author.first_name + ""} {item.author.last_name + " "}
                           Posted: {item.text}
                      </Text>
                      <Button title="Like" style={style.Button} onPress={() => this.likePost(item.post_id)} color="#8B0000"/>
                      <Button title="Remove Like" style={style.Button} onPress={() => this.removeLikePost(item.post_id)} color="#8B0000"/>
                      <Button title="Delete Post" style={style.Button} onPress={() => this.removePost(item.post_id)} color="#8B0000"/>
                      <Button title="View Post" style={style.Button} onPress={() => this.props.navigation.navigate("SinglePostScreen",{user_id:item.author.user_id,post_id:item.post_id})} color="#8B0000"/>

                      <TextInput style={style.TextInput} placeholder="Enter Text To Post" onTextChange= {(text) => this.setState({text})}/>              
                      <Button title="Edit Post" style={style.Button} onPress={() => this.editPost(item.author.user_id, item.text)} color="#8B0000"/>              
                     
                    </View>                 
                )}  
               keyExtractor={(item,index) => item.id}
              
               //  ADD THIS FOR UPLOAD  <Button title="Edit Post" style={style.Button} onPress={() => this.editPost(item.post_id, item.text)} color="#8B0000"/>              
                    //<TextInput style={style.TextInput} placeholder="Enter Text To Post" onTextChange= {(text) => this.setState({text})}/>              
         /> 

                <TextInput style={style.TextInput} placeholder="Enter Text To Post" onTextChange= {(text) => this.setState({text})} />
               
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
      marginLeft:15,
      marginRight:15
      //alignItems: 'center',
      //justifyContent: 'center',
     // height:'100%',
     // width:'100%'  
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
  },

  Title:{
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#8B0000",
    color: "#20232a",
    alignContent: "center",
    fontSize: 30,
    fontWeight: "bold"
  },

  list:{
    marginBottom: 15
  },

  subTitle:{
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'center',
      color: 'black',
      fontWeight: 'bold',
      fontSize: 15
  }
});


export default MyHomeScreen;
