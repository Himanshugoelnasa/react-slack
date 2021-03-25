import React from 'react';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
//import Message from './Message';
import firebase from 'firebase/app';
import moment from 'moment';
import {Segment, Comment, Image} from 'semantic-ui-react';

class Messages extends React.Component {

    state= {
        messages: [],
        messageLoading : true,
        messageRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser
    }

    componentDidMount() {
        const {channel, user} = this.state;
        if(channel && user) {
            this.addListener(channel.id);
        }
    }

    addListener = (channelId) => {
        this.addMessageListener(channelId);
    }

    addMessageListener = (channelId) => {
        let loadedMessage = [];
        this.state.messageRef.child(channelId).on('child_added', snap=> {
            loadedMessage.push(snap.val());
            this.setState({
                messages: loadedMessage,
                messageLoading: false
            });
        });
    }

    displayMessages = messages => {
        
        messages.map(msg => (
            <Comment>
                
                <Comment.Text>{msg.content}</Comment.Text>
            </Comment>
        ))
    }

    isOwnMessage = (message, user) => {
        return message.user.id === user.id? 'message__self' : '';
    }
    
    timeFromNow = (time) => {
        moment(time).fromNow();
    }

    isImage = (message) => {
        return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
    }

    render() {

        const {messageRef, channel, messages, user} = this.state;
        return (
            <React.Fragment>
                <MessagesHeader />

                <Segment>
                    <Comment.Group className="messages">
                        {/* {this.displayMessages(messages)} */}
                        {messages.map(message => (
                                <Comment key={message.timestamp}>
                                    <Comment.Avatar src={message.user.avatar} />
                                    <Comment.Content className={message.user.id === user.id ? 'message__self' : ''} >
                                        <Comment.Author as="a">{message.user.name}</Comment.Author>
                                        <Comment.Metadata>{this.timeFromNow(message.timestamp)}</Comment.Metadata>
                                        <Comment.Text>{message.content}</Comment.Text>
                                        {this.isImage(message) ? 
                                            <Image src={message.image} className="message__image"  /> :
                                            <Comment.Text>{message.content}</Comment.Text>
                                        }
                                    </Comment.Content>
                                </Comment>
                            ))
                        }
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messageRef={messageRef}
                    currentChannel={channel}
                    currentUser ={user}
                />
                
            </React.Fragment>
        )
    } 
}

export default Messages;