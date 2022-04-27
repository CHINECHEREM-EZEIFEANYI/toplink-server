// all the models come in here
const mongoose = require('mongoose');
const { userSchema, userSchemaValidator } = require("./schema");
const { validateData } = require("../../utils/validator");
const Response = require('../../utils/response');

const userModel = mongoose.model('User', userSchema);

async function isUniqueEmail(email) {
  let user = await userModel.find({ email: email });
  if(!user.length) {
    return true;
  }
  return false;
}

async function isUniqueUsername(username) {
  let user = await userModel.find({ username: username });
  if(!user.length) {
    return true;
  }
  return false;
}

exports.getUserById = async function getUserById(id) {
  try {
    const result = await userModel.findOne({ _id: id });
    if(!result) {
      return Response('error', 400, 'invalid user id provided');
    }
    return Response('success', 201, 'fetched user data successfully', result);
    
  } catch (error) {
    return Response('error', 500, (error.message ? error.message : error));
  }
}

exports.createUser = async function createUser(user) {

  let validatedData = await validateData(user, userSchemaValidator);

  // if the user data is not valid, return an error response
  if(!validatedData.isValid) {
    return Response('error', 400, (validatedData.error.message ? validatedData.error.message : validatedData.error));
  }

  if( !(await isUniqueEmail(user.email)) ) {
    return Response('error', 400, 'email address already exists');
  }

  if( !(await isUniqueUsername(user.username)) ) {
    return Response('error', 400, 'username already exists');   
  }
  
  const newUser = new userModel(user);
  const response = newUser.save()
    .then((result) => {
      return Response('success', 201, 'user created successfully', result);
    })
    .catch((error) => {
      return Response('error', 500, (error.message ? error.message : error));
    });
  return response;
}

exports.updateUser = async function updateUser(id, userData) {

  if(userData.email) {
    if( !(await isUniqueEmail(userData.email)) ) {
      return Response('error', 400, 'email address already exists');
    }
  }

  if(userData.username) {
    if( !(await isUniqueUsername(userData.username)) ) {
      return Response('error', 400, 'username already exists');   
    }
  }

  if(userData.subscription) {
    //implement checks before updating subscription here
  }

  if(userData.password) {
    //implement checks before updating password here
  }

  try {
    const user = await userModel.find({ _id: id });
    if (!user.length) {
      return Response('error', 400, 'invalid user id provided');   
    }
    // updates the user data 
    const updatedUser = {
      ...user,
      ...userData
    }
    const result = await userModel.findByIdAndUpdate(id, updatedUser, { new: true });
    return Response('success', 201, 'user data updated successfully', result);
  } catch (error) {
    return Response('error', 500, (error.message ? error.message : error));
  }

}

exports.deleteUser = async function deleteUser(id) {
  try {
    const deletedUser = await userModel.findByIdAndDelete(id)
    if(!deletedUser) {
      return Response('error', 400, 'invalid user id provided');   
    }
    // delete all links and pages related to user here
    return Response('success', 200, 'user deleted successfully');    
  } catch (error) {
    return Response('error', 500, (error.message ? error.message : error));
  }
}

exports.getAllUsers = async function getAllUsers() {
  try {
    const result = await userModel.find();
    return Response('success', 201, 'fetched all users successfully', result);    
  } catch (error) {
    return Response('error', 500, (error.message ? error.message : error));
  }
}


