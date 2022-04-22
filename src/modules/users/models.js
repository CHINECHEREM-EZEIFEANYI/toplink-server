// all the models come in here
// all the models come in here
const userModel = require("./schema");

async function createNewUser() {
  let userName = req.body.username;
  let userEmail = req.body.email;
  let phoneNumber = req.body.phoneNumber
  let userNameDuplicate = userModel.find((user) => user.username == userName);
  let userEmailDuplicate = userModel.find((user) => user.email == userEmail);
  let userPhoneNumberDuplicate = userModel.find((user)=> user.phoneNumber == phoneNumber)
  if (!userEmailDuplicate || !userNameDuplicate || !userPhoneNumberDuplicate) {
    try {
      const newUser = new userModel({
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
        disabled,
        privacy,
      });

      await newUser.save();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Email  address or Phone number or Username already in use");
  }
}

async function updateUser(id) {
  const id = id;
  const findId = userModel.find((user) => user.id == id);
  if (!findId) {
    console.log("Error: User doesnt exist");
  } else {
    try {
      let updatedUser = {
        Name,
        username,
        email,
        phoneNumber,
        profilePhoto,
        bio,
        role,
        coverPhoto,
        subscription,
        disabled,
        privacy,
      };
      const result = await userModel.findByIdAndUpdate(id, updatedUser);
      console.log(result);
    } catch (error) {}
  }
}

async function deleteUser(id) {
  await userModel
    .findByIdAndDelete(id)
    .then((res) => console.log("Deleted!"))
    .catch((err) => console.log(err));
}

async function getAllUsers() {
  const result = await userModel.find();
  console.log(result);
}
