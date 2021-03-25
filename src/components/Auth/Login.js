import React, { Component } from 'react';
import firebase from './firebase';

import {Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class Register extends Component {
    state = {
        email: '',
        password: '',
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

    isFormEmpty = ({email, password}) => {
        return !email.length || !password.length;
    }

    isPasswordEmpty = ({ password}) => {
        if(password.length < 6) {
            return false;
        } else {
            return true;
        }
    }

    displayErrors = errors =>errors.map((error, i) => <p key={i}>{error.message} </p>);


    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleLogin= event =>{
        event.preventDefault();
        if(this.isFormValid()) {
            this.setState({errors: [], loading: true});
            firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(userCredential => {
                console.log(userCredential);
                
                this.setState({ 
                    email: '',
                    password: '',
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

   
    handleImputError=(errors, inputname) => {
        return errors.some(error=>
            error.message.toLowerCase().includes(inputname)
        ) 
        ? 'error' : ''
    }

    render() {

        const {email, password, errors, loading} = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="violet" textAlign="center">
                        <Icon name="puzzle piece" color="violet" />
                        Register For DevChat
                    </Header>
                    <Form onSubmit={this.handleLogin} size='large'>
                        <Segment stacked>
                           
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

                            

                            <Button disabled={loading} className={loading?'loading':''} color="violet" fluid size="large" >Submit</Button>
                        </Segment>

                    </Form>
                    {errors.length > 0 && (
                        <Message errors>
                            <h3>Errors</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message color="violet"  size="large">New User ? <Link to="/register">Register Here</Link></Message>
                </Grid.Column>
            </Grid>
            
        );
    }
}

export default Register; 