import React, { Component } from 'react';
import firebase from './firebase';
import md5 from 'md5';

import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    };

    isFormValid = () => {

        let errors = [];
        let error;

        if(this.isFormEmpty(this.state)) {
            error = {message: 'Fill all the fields !!'};
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if(!this.isPasswordEmpty(this.state)) {
            error = {message: 'Password is invalid'};
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            return true;
        }


    }

    isFormEmpty = ({username, email, password, passwordConfirm}) => {
        return !username.length || !email.length || !password.length || !passwordConfirm.length;
    }

    isPasswordEmpty = ({ password, passwordConfirm}) => {
        if(password.length < 6 || passwordConfirm.length < 6 ) {
            return false;
        } else if(password !== passwordConfirm) {
            return false;
        } else {
            return true;
        }
    }

    displayErrors = errors =>errors.map((error, i) => <p key={i}>{error.message} </p>);


    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit= event =>{
        event.preventDefault();
        if(this.isFormValid()) {
            this.setState({errors: [], loading: true});
            firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(userCredential => {
                console.log(userCredential);
                userCredential.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(userCredential.user.email)}?d=identicon`
                })
                .then(() =>{
                    this.saveuser(userCredential).then(()=> {
                        console.log('usersaved !!')
                    })
                    
                }) 
                .catch(err=>{
                    console.log(err);
                    this.setState({errors: this.state.errors.concat(err), loading: false})
                })
                this.setState({ 
                    username: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
                    errors: [],
                    loading: false
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({errors:this.state.errors.concat(error), loading: false});
            });
        } else {
            return false;
        }
   
    }

    saveuser = userCredential => {
        return this.state.usersRef.child(userCredential.user.uid).set({
            name: userCredential.user.displayName,
            avatar: userCredential.user.photoURL
        });
    }

    handleImputError=(errors, inputname) => {
        return errors.some(error=>
            error.message.toLowerCase().includes(inputname)
        ) 
        ? 'error' : ''
    }

    render() {

        const {username, email, password, passwordConfirm, errors, loading} = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register For DevChat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size='large'>
                        <Segment stacked>
                            <Form.Input 
                                fluid={true} name="username"  
                                icon="user" 
                                iconPosition="left" 
                                placeholder="Username" 
                                onChange={this.handleChange} 
                                value={username}
                                className={this.handleImputError(errors, 'username')}
                                type="text" />
                        
                            <Form.Input 
                                fluid={true} name="email"  
                                icon="mail" 
                                iconPosition="left" 
                                placeholder="Email Address" 
                                onChange={this.handleChange} 
                                value={email}
                                className={this.handleImputError(errors, 'email')}
                                type="email" />
                            
                            <Form.Input 
                                fluid={true} name="password"  
                                icon="lock" 
                                iconPosition="left" 
                                placeholder="Password" 
                                onChange={this.handleChange} 
                                value={password}
                                className={this.handleImputError(errors, 'password')}
                                type="password" />

                            <Form.Input 
                                fluid={true} name="passwordConfirm"  
                                icon="repeat" 
                                iconPosition="left" 
                                placeholder="Password Confirmation" 
                                onChange={this.handleChange} 
                                value={passwordConfirm}
                                className={this.handleImputError(errors, 'passwordConfirm')}
                                type="password" />

                            <Button disabled={loading} className={loading?'loading':''} color="orange" fluid size="large" >Submit</Button>
                        </Segment>

                    </Form>
                    {errors.length > 0 && (
                        <Message errors>
                            <h3>Errors</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message color="orange"  size="large">Already a user ? <Link to="/login">Login Here</Link></Message>
                </Grid.Column>
            </Grid>
            
        );
    }
}

export default Register; 