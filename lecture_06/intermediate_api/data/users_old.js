const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const posts = mongoCollections.posts;
const {ObjectId} = require('mongodb');
const validation = require('../validation');

let exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    if (!userList) throw 'No users in system!';
    return userList;
  },
  // This is a fun new syntax that was brought forth in ES6, where we can define
  // methods on an object with this shorthand!
  async getUserById(id) {
    id = validation.checkId(id, 'ID');
    const userCollection = await users();
    const user = await userCollection.findOne({_id: ObjectId(id)});
    if (!user) throw 'User not found';
    return user;
  },
  async addUser(firstName, lastName) {
    firstName = validation.checkString(firstName, 'First Name');
    lastName = validation.checkString(lastName, 'Last Name');
    const userCollection = await users();

    let newUser = {
      firstName: firstName,
      lastName: lastName
    };

    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    return await this.getUserById(newInsertInformation.insertedId.toString());
  },
  async removeUser(id) {
    id = validation.checkId(id, 'id');
    const userCollection = await users();
    const deletionInfo = await userCollection.deleteOne({_id: ObjectId(id)});
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete user with id of ${id}`;
    }
    return true;
  },
  async updateUser(id, updatedUser) {
    id = validation.checkId(id, 'id');
    updatedUser.firstName = validation.checkString(
      updatedUser.firstName,
      'First Name'
    );
    updatedUser.lastName = validation.checkString(
      updatedUser.lastName,
      'Last Name'
    );

    let userUpdateInfo = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName
    };

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
      {_id: ObjectId(id)},
      {$set: userUpdateInfo}
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Update failed';
    /* lets update the poster.name with the new name in 
		all posts that the user posted */
    const postCollection = await posts();
    await postCollection.updateMany(
      {'poster.id': ObjectId(id)},
      {
        $set: {
          'poster.name': `${updatedUser.firstName} ${updatedUser.lastName}`
        }
      }
    );
    return await this.getUserById(id);
  }
};

module.exports = exportedMethods;
