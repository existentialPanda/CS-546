const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;
const users = require('./users');
const {ObjectId} = require('mongodb');
const validation = require('../validation');

const exportedMethods = {
  async getAllPosts() {
    const postCollection = await posts();
    return await postCollection.find({}).toArray();
  },
  async getPostsByTag(tag) {
    tag = validation.checkString(tag, 'Tag');
    const postCollection = await posts();
    return await postCollection.find({tags: tag}).toArray();
  },
  async getPostById(id) {
    id = validation.checkId(id, 'ID');
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: ObjectId(id)});

    if (!post) throw 'Post not found';
    return post;
  },
  async addPost(title, body, tags, posterId) {
    title = validation.checkString(title, 'Title');
    body = validation.checkString(body, 'Body');
    posterId = validation.checkId(posterId, 'Poster ID');
    if (!Array.isArray(tags)) {
      tags = [];
    } else {
      tags = validation.checkStringArray(tags, 'Tags');
    }

    const postCollection = await posts();

    const userThatPosted = await users.getUserById(posterId);

    const newPost = {
      title: title,
      body: body,
      poster: {
        id: ObjectId(posterId),
        name: `${userThatPosted.firstName} ${userThatPosted.lastName}`
      },
      tags: tags
    };
    const newInsertInformation = await postCollection.insertOne(newPost);
    const newId = newInsertInformation.insertedId;
    return await this.getPostById(newId.toString());
  },
  async removePost(id) {
    id = validation.checkId(id, 'ID');
    const postCollection = await posts();

    try {
      const post = await this.getPostById(id);
    } catch (e) {
      console.log(e);
      return;
    }
    const deletionInfo = await postCollection.deleteOne({_id: ObjectId(id)});
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete post with id of ${id}`;
    }
    return true;
  },
  async updatePost(id, updatedPost) {
    const postCollection = await posts();

    const updatedPostData = {};

    if (updatedPost.tags) {
      updatedPostData.tags = validation.checkStringArray(
        updatedPost.tags,
        'Tags'
      );
    }

    if (updatedPost.title) {
      updatedPostData.title = validation.checkString(
        updatedPost.title,
        'Title'
      );
    }

    if (updatedPost.body) {
      updatedPostData.body = validation.checkString(updatedPost.body, 'Body');
    }

    await postCollection.updateOne(
      {_id: ObjectId(id)},
      {$set: updatedPostData}
    );

    return await this.getPostById(id);
  },
  async renameTag(oldTag, newTag) {
    oldTag = validation.checkString(oldTag, 'Old Tag');
    newTag = validation.checkString(newTag, 'New Tag');
    if (oldTag === newTag) throw 'tags are the same';
    let findDocuments = {
      tags: oldTag
    };

    let firstUpdate = {
      $addToSet: {tags: newTag}
    };

    let secondUpdate = {
      $pull: {tags: oldTag}
    };

    const postCollection = await posts();
    await postCollection.updateMany(findDocuments, firstUpdate);
    await postCollection.updateMany(findDocuments, secondUpdate);

    return await this.getPostsByTag(newTag);
  }
};

module.exports = exportedMethods;
