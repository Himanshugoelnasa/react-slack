import React from 'react';
import {Comment} from 'semantic-ui-react';
import moment from 'moment';



const isOwnMessage = (message, user) => {
    return message.user.id === user.id? 'message__self' : '';
}

const timeFromNow = (time) => {
    moment(time).fromNow();
}

const Message = ({message, user}) => (
    <Comment key={message.id}>
        <Comment.Avatar src={message.user.avatar} />
        <Comment.Content className={isOwnMessage(message, user)} />
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
        <Comment.Text>{message.content}</Comment.Text>
    </Comment>
);

export default Message;