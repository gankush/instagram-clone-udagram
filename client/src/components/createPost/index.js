// src/components/createPost/index.js
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { v4 as uuidv4 } from 'uuid'
import "./createPost.css";

class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.selectedImage = null;
    this.fileUploadClick = this.fileUploadClick.bind(this);
  }
  
  handleClick() {
    const data = {
      caption: '',
      image: '',
      postId: '',
      userId: ''
    }
    this.props.toggle(data);

    console.log(data)
  };

 

  uploadImage = async (file, postId, userId) => {
    if (file == null) {
      return "null"
    }
    try {
     let postData={
       userId:userId
     }
      console.log("postId: ",postId);
      console.log("File: ",file);
      const response = await fetch(
        `https://i77ywsygj4.execute-api.us-east-2.amazonaws.com/dev/todos/${postId}/attachment`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(postData)
      })
      const data = await response.json();
      let uploadUrl = data.uploadUrl
      console.log("presigned url:   ",uploadUrl);

    await fetch(
      uploadUrl, {
      method: 'PUT',
      
      body: file

    })
    
      console.log("file uploaded");
      return data.newItem.imageUrl
    }
    catch{
      alert("File Upload Failed with presigned url");
      return "null"
    }
  }
  
  createPost = async (postBar, postData) => {
    // console.log(this.props.deleteOption);
    let postId = uuidv4();
    let userId = postData.userId;
    // console.log(postData); 
    let url = await this.uploadImage(this.selectedImage, postId, userId);
    // console.log(url);
    if (!this.props.deleteOption) {
      try {
        let postData = {
          userId: userId,
          todoId: postId,
          name: postBar.value,
          url: url
        }
        console.log(postData);
        const response = await fetch(
          'https://i77ywsygj4.execute-api.us-east-2.amazonaws.com/dev/todos', {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(postData)
        }
        )
        const data = await response.json();
        console.log("Post created:  ", data)
        alert("post submitted");
        postBar.value = "";
        this.selectedImage=null;
        await this.props.refreshPosts();
      }
      catch{
        alert("Fetching Posts failed")
      }
    }
    else {
      try {

        
        let postUpdateData = {
          userId: userId,
          name: postBar.value

        }
        console.log(postData)
        let postId = postData.todoId;
        const response = await fetch(
          `https://i77ywsygj4.execute-api.us-east-2.amazonaws.com/dev/todos/${postId}`, {
          method: 'PATCH',
          mode: 'cors',
          body: JSON.stringify(postUpdateData)
        }
        )
        const data = await response.json();
        console.log("Post Updated:  ", data)
        alert("post Updated");
        //postBar.value = "";
        this.handleClick();
        await this.props.refreshPosts();
      }
      catch (e) {
        console.log(e)
      }
    }

  }

  deletePost = async (userId, postId) => {
    try {
      // const token = this.props.token;
      // var bearer = 'Bearer ' + token;
      let postData = {
        userId: userId
      }
      console.log("trying to delete post", userId, postId);
      const response = await fetch(
        `https://i77ywsygj4.execute-api.us-east-2.amazonaws.com/dev/todos/${postId}`, {
        method: 'DELETE',
        mode: 'cors',
        body: JSON.stringify(postData)
      }
      )
      const data = await response.json();
      console.log("Post Deleted:  ", data);
      alert("Post Deleted");
      this.handleClick();
      await this.props.refreshPosts();
    }
    catch{
      alert("Delete Posts failed")
    }

  }

  UpdatePost = async (userId, postId) => {
    try {
      let postData = {
        userId: userId

      }
      console.log("trying to delete post", userId, postId);
      const response = await fetch(
        `https://i77ywsygj4.execute-api.us-east-2.amazonaws.com/dev/todos/${postId}`, {
        method: 'DELETE',
        mode: 'cors',
        body: JSON.stringify(postData)
      }
      )
      const data = await response.json();
      console.log("Post Deleted:  ", data);
      //alert("Post Deleted");
      this.handleClick();
      await this.props.refreshPosts();
    }
    catch{
      alert("Delete Posts failed")
    }

  }

  fileUploadClick() {
    this.refs.fileUploader.click();
  }
  handleChange(selectorFiles) {
    console.log(selectorFiles);
    this.selectedImage = selectorFiles[0];
  }

  render() {
    let caption = '', userId = '', postId = '';
    if (this.props.data !== undefined) {
      // console.log(this.props)
      caption = this.props.data.caption;
      userId = this.props.data.userId;
      postId = this.props.data.postId;
    }
    const postData = {
      url: '',
      caption: caption,
      userId: userId,
      todoId: postId
    }
    // console.log(this.props.data);
    //console.log("createPost: ", this.props.data)
    const avatar = this.props.avatar;
    const deleteOption = this.props.deleteOption

    return (
      <article className="CreatePostDiv" ref="CreatePost">
        <div className="CreatePost">
          <header>
            <div className="Create-post-user">
              <div className="Create-post-user-avatar">
                <img src={avatar} alt="Chris" />
              </div>
              <div className="Create-post-div">

                <textarea className="Create-post-input" placeholder=".. my post" defaultValue={caption} ref="postContent"></textarea>

                {/* <input type="submit" value="Submit" /> */}
              </div>
            </div>
          </header>
          <div className="ButtonSection">
            <input type="file" id="file" accept="image/png, image/jpeg" onChange={(e) => this.handleChange(e.target.files)} ref="fileUploader" style={{ display: "none" }} />
            {deleteOption ? null : <button className="ButtonClass" onClick={this.fileUploadClick}>Photo</button>}
            <button className="ButtonClass" onClick={async () => await this.createPost(ReactDOM.findDOMNode(this.refs.postContent), postData)}>Post</button>
            {deleteOption ? <button className="ButtonClass" onClick={async () => await this.deletePost(userId, postId)}>Delete</button> : null}
          </div>
        </div>

      </article>
    );
  }
}
export default CreatePost;