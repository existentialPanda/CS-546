import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from '../validation.js';

const userCollection = await users();

let exportedMethods = {
  async getAllUsers() {
    const userList = await userCollection.find({}).toArray();
    return userList;
  },
  async getUserById(id) {
    id = validation.checkId(id);
    const user = await userCollection.findOne({_id: ObjectId(id)});
    if (!user) throw 'Error: User not found';
    return user;
  },
  async addUser(firstName, lastName) {
    firstName = validation.checkString(firstName, 'First name');
    lastName = validation.checkString(lastName, 'Last name');

    let newUser = {
      firstName: firstName,
      lastName: lastName,
    };

    const newInsertInformation = await userCollection.insertOne(newUser);
    if (!newInsertInformation.insertedId) throw 'Insert failed!';
    return await this.getUserById(newInsertInformation.insertedId.toString());
  },
  async removeUser(id) {
    id = validation.checkId(id);
    const deletionInfo = await userCollection.findOneAndDelete({
      _id: ObjectId(id),
    });
    if (deletionInfo.lastErrorObject.n === 0)
      throw [404, `Error: Could not delete user with id of ${id}`];

    return {...deletionInfo.value, deleted: true};
  },
  async updateUserPut(id, firstName, lastName) {
    id = validation.checkId(id);
    firstName = validation.checkString(firstName, 'first name');
    lastName = validation.checkString(lastName, 'last name');

    const userUpdateInfo = {
      firstName: firstName,
      lastName: lastName,
    };

    const updateInfo = await userCollection.findOneAndUpdate(
      {_id: ObjectId(id)},
      {$set: userUpdateInfo},
      {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [
        404,
        `Error: Update failed, could not find a user with id of ${id}`,
      ];

    return await updateInfo.value;
  },

  async updateUserPatch(id, userInfo) {
    id = validation.checkId(id);
    if (userInfo.firstName)
      userInfo.firstName = validation.checkString(
        userInfo.firstName,
        'first name'
      );

    if (userInfo.lastName)
      userInfo.lastName = validation.checkString(
        userInfo.lastName,
        'last name'
      );

    const updateInfo = await userCollection.findOneAndUpdate(
      {_id: ObjectId(id)},
      {$set: userInfo},
      {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [
        404,
        `Error: Update failed, could not find a user with id of ${id}`,
      ];

    return await updateInfo.value;
  },
};

export default exportedMethods;
