const Joi = require('joi');

const registerValidaiton = (data) => {

    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
    });

    return schema.validate(data);

}

const loginValidaiton = (data) => {

    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
    });

    return schema.validate(data);

}

module.exports.registerValidaiton = registerValidaiton;
module.exports.loginValidaiton = loginValidaiton;