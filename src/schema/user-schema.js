const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseJoi = require('joi');
const userID = Joi.string().guid({ version: 'uuidv4' })
const ImageExtension = require('joi-image-extension')
const Joi = BaseJoi.extend(ImageExtension)
const Name = require('./className')
exports.userSchema = Joi.object({
    id: userID.required()
        .required()
        .strict(),
    Name: Joi.string()
        .alpha()
        .min(2)
        .max(50)
        .required(),
    username: Joi.string()
        .alphanum()
        .min(4)
        .max(50)
        .required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ['com', 'net'] }
        })
        .lowercase(),
    phoneNumber: Joi.number()
        .min(9)
        .max(11)
        .required(),
    profilePhoto: Joi
        .image()
        .minDimensions(100, 50)
        .required(),
    bio: Joi.string()
        .alphanum()
        .min(20)
        .max(240)
        .required(),
    role: Joi.string()
        .required(),
    coverPhoto: Joi
        .image()
        .minDimensions(100, 50)
        .required(),
    subscription: Joi.string()
        .required(),
    disabled: Joi.boolean()
        .required(),
});

let data = {
id,
Name,
username,
email,
phoneNumber,
profilePhoto,
bio,
role,
coverPhoto,
subscription,
disabled
}

Joi.validate(data, userSchema, (err, value) => {

    if (err) {

        console.log(err.details);

    } else {

        console.log(value);
    }
});