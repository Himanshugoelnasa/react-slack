import React from 'react';
import firebase from '../Auth/firebase';
import {Menu, Icon, Modal, Form, FormField, Button, Input } from 'semantic-ui-react';
import {connect} from 'react-redux';
import {setCurrentChannel} from '../../actions';

class Channels extends React.Component {

    state = {
        activeChannel: '',
        user: this.props.currentUser,
        channels : [], 
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        modal: false,
        firstLoad: true
    };

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val()); 
            this.setState({channels :loadedChannels}, () => this.seFirstChannel());
        });
        
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    seFirstChannel = () => {
        const fistChannel = this.state.channels[0];
        if(this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(fistChannel);
            this.setActiveChannel(fistChannel);
        }
        this.setState({firstLoad: false});
    }
 
    

    closeModal = () => this.setState({ modal:false });
    openModal = () => this.setState({ modal:true });

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    }

    changeChannel = channel => {
        this.setActiveChannel(channel); 
        this.props.setCurrentChannel(channel);
    }

    setActiveChannel = channel => {
        this.setState({activeChannel: channel.id});
    }

    displayChannels = (channels) => (
        
        channels.length > 0 && channels.map(channel => (
            <Menu.Item 
                key={channel.id}
                name={channel.name}
                onClick={() => this.changeChannel(channel)}
                style={{opacity: 0.7}}
                active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ))
    )

    addChannel = () => {

        const {channelsRef, channelName, channelDetails, user} = this.state;
        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({channelName:'', channelDetails: ''});
                this.closeModal();
               // console.log('Channel Added');
            })
            .catch(err => {
                //console.error(err);
            });

    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid(this.state)) {
           // console.log('Channel Added');
            this.addChannel();
        }
    }

    isFormValid = ({channelName, channelDetails}) => channelName && channelDetails;


    render() {

        const {modal, channels} = this.state;
        return (
            <React.Fragment>
            <Menu.Menu style={{paddingBottom: '2em'}}>
                <Menu.Item>
                    <span>
                        <Icon name="exchange" />CHANNELS
                    </span>
                    ({channels.length})<Icon name="add" onClick={this.openModal} />
                </Menu.Item>
                {this.displayChannels(channels)}
            </Menu.Menu>

            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <FormField>
                                <Input 
                                    fluid
                                    label="Name of Channel"
                                    name="channelName"
                                    onChange={this.handleChange}
                                />
                            </FormField>
                            <FormField>
                                <Input 
                                    fluid
                                    label="About the Channel"
                                    name="channelDetails"
                                    onChange={this.handleChange}
                                />
                            </FormField>
                        </Form>
                    </Modal.Content>
                </Modal.Header>
                <Modal.Actions>
                    <Button color="green" inverted onClick={this.handleSubmit}>
                        <Icon name="checkmark" />Add
                    </Button>
                    <Button color="red" inverted onClick={this.closeModal} >
                        <Icon name="remove" />Cancel
                    </Button>
                </Modal.Actions>
            </Modal>

            

           </React.Fragment>

        );
    }
}


export default connect(null, {setCurrentChannel})(Channels);