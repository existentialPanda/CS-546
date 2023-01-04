import {posts} from '../config/mongoCollections.js';
import userData from './users.js';
import {ObjectId} from 'mongodb';
import validation from '../validation.js';

const exportedMethods = {
  async getAllPosts() {
    const postCollection = await posts();
    return await postCollection.find({}).toArray();
  },
  async getPostById(id) {
    id = validation.checkId(id);
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: ObjectId(id)});

    if (!post) throw 'Error: Post not found';
    return post;
  },
  async getPostsByTag(tag) {
    tag = validation.checkString(tag, 'Tag');
    const postCollection = await posts();
    return await postCollection.find({tags: tag}).toArray();
  },
  async addPost(title, body, posterId, tags) {
    title = validation.checkString(title, 'Title');
    body = validation.checkString(body, 'Body');
    posterId = validation.checkId(posterId, 'Poster ID');
    if (!Array.isArray(tags)) {
      tags = [];
    } else {
      tags = validation.checkStringArray(tags, 'Tags');
    }

    const postCollection = await posts();

    const userThatPosted = await userData.getUserById(posterId);

    const newPost = {
      title: title,
      body: body,
      poster: {
        id: ObjectId(posterId),
        name: `${userThatPosted.firstName} ${userThatPosted.lastName}`,
      },
      tags: tags,
    };
    const newInsertInformation = await postCollection.insertOne(newPost);
    const newId = newInsertInformation.insertedId;
    return await this.getPostById(newId.toString());
  },
  async removePost(id) {
    id = validation.checkId(id);
    const postCollection = await posts();
    const deletionInfo = await postCollection.findOneAndDelete({
      _id: ObjectId(id),
    });
    if (!deletionInfo.value) throw `Could not delete post with id of ${id}`;
    return {...deletionInfo.value, deleted: true};
  },
  async updatePost(id, title, body, posterId) {
    id = validation.checkId(id);
    title = validation.checkString(title, 'title');
    body = validation.checkString(body, 'body');
    posterId = validation.checkId(posterId);
    const postCollection = await posts();
    const userThatPosted = await userData.getUserById(posterId);

    let updatedPost = {
      title: title,
      body: body,
      poster: {
        id: posterId,
        firstName: userThatPosted.firstName,
        lastName: userThatPosted.lastName,
      },
    };
    const updateInfo = await postCollection.findOneAndUpdate(
      {_id: ObjectId(id)},
      {$set: updatedPost},
      {returnDocument: 'after'}
    );
    if (!updateInfo.value) throw 'Error: Update failed';
    return updateInfo.value;
  },
  async renameTag(oldTag, newTag) {
    oldTag = validation.checkString(oldTag, 'Old Tag');
    newTag = validation.checkString(newTag, 'New Tag');
    if (oldTag === newTag) throw 'tags are the same';
    let findDocuments = {
      tags: oldTag,
    };

    let firstUpdate = {
      $addToSet: {tags: newTag},
    };

    let secondUpdate = {
      $pull: {tags: oldTag},
    };

    const postCollection = await posts();
    await postCollection.updateMany(findDocuments, firstUpdate);
    await postCollection.updateMany(findDocuments, secondUpdate);

    return await this.getPostsByTag(newTag);
  },
};

export default exportedMethods;
