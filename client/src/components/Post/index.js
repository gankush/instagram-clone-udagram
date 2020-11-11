// src/components/Post/index.js
import React, { Component } from "react";
//import PopUp from "../popUp"
import "./Post.css";

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = { seen: false};
        this.userId = '';
        this.postId='';

      }
    shoot(a) {
        alert(a);
    }

    handleClick() {
        const data = {
            caption : this.props.caption,
            image : this.props.image,
            postId:this.postId,
            userId:this.userId
        }
        this.props.toggle(data);
        
        console.log(data)
       };

    render() {
        const userId = this.props.userId;
        const postId = this.props.postId;
        const avatar = this.props.avatar;
        const image = this.props.image;
        //console.log(image==="")
        const caption = this.props.caption;
        this.userId = userId;
        this.postId = postId;

        return (
            <article className="Post" ref="Post">
                <header>
                    <div className="Post-user">
                        <div className="Post-user-avatar">
                            <img src={avatar} alt="Chris" />
                        </div>
                        <div className="Post-user-nickname">
                            <span>{userId}</span>
                        </div>
                        <button className="optionButton" onClick={() =>this.handleClick()}>...</button>
                    </div>
                    {/* <div>{this.state.seen ? <PopUp toggle={() =>this.togglePop()} /> : null}</div> */}
                    
                </header >
            <div className="Post-image">
                <div className="Post-image-bg">
                    {image!=="" ? <img alt="Icon Living" src={image} /> : null} 
                </div>
            </div>
            <div className="Post-caption">
                <strong>{userId}</strong> {caption}
            </div>
            </article >
        );
    }
}
export default Post;