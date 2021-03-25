
const router = require('express').Router();
const Validate = require('./validation');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
    

    // check validate data  
    const {error} = Validate.registerValidaiton(req.body);
    if(error) return res.status(400).send(error.message);


    // check if email id exist
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist !!');

    // hash th password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    const user = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashPassword,
    });
    try{
        const saveduser = await user.save();
        res.send({user: user._id});
    }
    catch(err) {
        res.status(400).send(err);
    }
});


router.post('/login', async (req, res) => {
    

    // check validate data  
    const {error} = Validate.loginValidaiton(req.body);
    if(error) return res.status(400).send(error.message);


    // check if email id exist
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email does not exist !!');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Password not valid');

    // create and assign token
    const token = jwt.sign({_id : user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    
    try{
        const saveduser = await user.save();
        res.send({user: user._id});
    }
    catch(err) {
        res.status(400).send(err);
    }
});

module.exports = router;