const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const userID = Joi.string().guid({ version: 'uuidv4' })
exports.pageSchema = Joi.object({
    id: userID.required()
        .required()
        .strict(),
    author: Joi.string()
        .alphanum()
        .min(4)
        .max(50)
        .required(),
    title: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    description: Joi.string(),
    url: ('http:/', Joi.string()
        .uri()
        .required()),
    privacy: Joi.string(), 
    links: Joi.array()
        .length(10)
        .required()
    
});

let data = {
    id,
    author,
    title,
    description,
    url,
    privacy,
    links
}


Joi.validate(data, pageSchema, (err, value) => {

    if (err) {

        console.log(err.details);

    } else {

        console.log(value);
    }
});