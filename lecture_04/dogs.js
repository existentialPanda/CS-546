import {dogs} from './mongoCollections.js';
import {ObjectId} from 'mongodb';

const dogCollection = await dogs();

const exportedMethods = {
  async getDogById(id) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';

    const doggo = await dogCollection.findOne({_id: ObjectId(id)});
    if (doggo === null) throw 'No dog with that id';
    doggo._id = doggo._id.toString();
    return doggo;
  },
  async getAllDogs() {
    let dogList = await dogCollection.find({}).toArray();
    if (!dogList) throw 'Could not get all dogs';
    dogList = dogList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return dogList;
  },
  async addDog(name, breeds) {
    if (!name) throw 'You must provide a name for your dog';
    if (typeof name !== 'string') throw 'Name must be a string';
    if (name.trim().length === 0)
      throw 'Name cannot be an empty string or string with just spaces';
    if (!breeds || !Array.isArray(breeds))
      throw 'You must provide an array of breeds';
    if (breeds.length === 0) throw 'You must supply at least one breed';
    for (let i in breeds) {
      if (typeof breeds[i] !== 'string' || breeds[i].trim().length === 0) {
        throw 'One or more breeds is not a string or is an empty string';
      }
      breeds[i] = breeds[i].trim();
    }
    name = name.trim();

    let newDog = {
      name: name,
      breeds: breeds,
    };

    const insertInfo = await dogCollection.insertOne(newDog);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add dog';

    const newId = insertInfo.insertedId.toString();

    const dog = await this.getDogById(newId);
    return dog;
  },
  async removeDog(id) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';

    const deletionInfo = await dogCollection.findOneAndDelete({
      _id: ObjectId(id),
    });

    if (deletionInfo.lastErrorObject.n === 0) {
      throw `Could not delete dog with id of ${id}`;
    }
    return `${deletionInfo.value.name} has been deleted.`;
  },
  async updateDog(id, name, breeds) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    if (!name) throw 'You must provide a name for your dog';
    if (typeof name !== 'string') throw 'Name must be a string';
    if (name.trim().length === 0)
      throw 'Name cannot be an empty string or string with just spaces';
    if (!breeds || !Array.isArray(breeds))
      throw 'You must provide an array of breeds';
    if (breeds.length === 0) throw 'You must supply at least one breed';

    for (let i in breeds) {
      if (typeof breeds[i] !== 'string' || breeds[i].trim().length === 0) {
        throw 'One or more breeds is not a string or is an empty string';
      }
      breeds[i] = breeds[i].trim();
    }
    name = name.trim();

    const updatedDog = {
      name: name,
      breeds: breeds,
    };

    const updatedInfo = await dogCollection.findOneAndUpdate(
      {_id: ObjectId(id)},
      {$set: updatedDog},
      {returnDocument: 'after'}
    );
    if (updatedInfo.lastErrorObject.n === 0) {
      throw 'could not update dog successfully';
    }

    return updatedInfo.value;
  },
};

export default exportedMethods;
