import Post from '../Post/index'
import CreatePost from '../createPost/index'
import React, { Component } from "react";
import PopUp from '../popUp'
//import { Get } from 'react-axios'


class PostManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seen: false,
      posts: [],
      refresh: false
    };
    this.data= {
      userId:'',
      postId:'',
      caption:''
    }
    this.selectedPostId='';
  }
  
  getPosts = async () => {
     try{
      const token = this.props.token;
      var bearer = 'Bearer ' + token;
      // console.log(bearer);
    const response = await fetch(
      'https://i77ywsygj4.execute-api.us-east-2.amazonaws.com/dev/todos', {
      method: 'GET',
     
      headers: {
          'Authorization': bearer
          
      }
    }
    )
    const data = await response.json();
    // console.log(data);
    let items = data.items;
    
    this.setState({
      posts: items,
      refresh: true
    });

    // console.log(this.state.posts)
  }
  catch{
    alert("Fetching Posts failed")
  }
    
  }

  togglePopUp(data) {
    this.setState({
      seen: !this.state.seen
      
    });
    if (data){
     
        this.data.caption = data.caption
        this.data.postId=data.postId;
        this.data.userId=data.userId;

    }
  
  };


  async componentDidMount() {
    await this.getPosts()
  }

  componentWillUnmount() {
    clearInterval(this.getPost);
  }
  
  
  render() {
    this.data.userId = this.props.user.sub;
    let name = this.props.user.name;
    let profilePicture = this.props.user.picture;
    return (
      <div>
        <div>{this.state.seen ? 
          <PopUp
            toggle={(data) => this.togglePopUp(data)} 
            dp={profilePicture}
            data={this.data} 
            refreshPosts={async () => await this.getPosts()}/> : null}
        </div>
        <CreatePost 
          avatar={profilePicture}
          deleteOption={false} data={this.data} token={this.props.token}
          refreshPosts={async () => await this.getPosts()}>
          
        </CreatePost>
      {
        this.state.posts.length>0 ? this.state.posts.map((item) => {
          
          let imageUrl = ""
          if (item.attachmentUrl!=="null")
            imageUrl = item.attachmentUrl;

        return (
          
          <Post userId={item.userId} username={name} postId = {item.todoId} 
            avatar={profilePicture} 
            caption={item.name} image={imageUrl} toggle={(data) => this.togglePopUp(data)} 
            refreshPosts={async () => await this.getPosts()}>

          </Post>
        );

        }) : null
      }
      </div>)
      
          }
}
export default PostManager