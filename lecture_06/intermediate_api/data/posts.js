import {posts} from '../config/mongoCollections.js';
import userData from './users.js';
import {ObjectId} from 'mongodb';
import validation from '../validation.js';

const postCollection = await posts();

const exportedMethods = {
  async getAllPosts() {
    try {
      return await postCollection.find({}).toArray();
    } catch (e) {
      throw e;
    }
  },

  async getPostById(id) {
    id = validation.checkId(id);
    try {
      const post = await postCollection.findOne({_id: ObjectId(id)});

      if (!post) throw 'Error: Post not found';

      return post;
    } catch (e) {
      throw e;
    }
  },
  async getPostsByTag(tag) {
    tag = validation.checkString(tag, 'Tag');
    try {
      return await postCollection.find({tags: tag}).toArray();
    } catch (e) {
      throw e;
    }
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
    try {
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
    } catch (e) {
      throw e;
    }
  },
  async removePost(id) {
    id = validation.checkId(id);

    try {
      const deletionInfo = await postCollection.findOneAndDelete({
        _id: ObjectId(id),
      });
      if (deletionInfo.lastErrorObject.n === 0)
        throw [404, `Could not delete post with id of ${id}`];
      return {...deletionInfo.value, deleted: true};
    } catch (e) {
      throw e;
    }
  },
  async updatePostPut(id, updatedPost) {
    id = validation.checkId(id);
    updatedPost.title = validation.checkString(updatedPost.title, 'title');
    updatedPost.body = validation.checkString(updatedPost.body, 'body');
    updatedPost.posterId = validation.checkId(updatedPost.posterId);
    if (!Array.isArray(updatedPost.tags)) {
      updatedPost.tags = [];
    } else {
      updatedPost.tags = validation.checkStringArray(updatedPost.tags, 'Tags');
    }

    try {
      const userThatPosted = await userData.getUserById(updatedPost.posterId);

      let updatedPostData = {
        title: updatedPost.title,
        body: updatedPost.body,
        poster: {
          id: updatedPost.posterId,
          firstName: userThatPosted.firstName,
          lastName: userThatPosted.lastName,
        },
        tags: updatedPost.tags,
      };

      const updateInfo = await postCollection.findOneAndReplace(
        {_id: ObjectId(id)},
        updatedPostData,
        {returnDocument: 'after'}
      );
      if (updateInfo.lastErrorObject.n === 0)
        throw [
          404,
          `Error: Update failed! Could not update post with id ${id}`,
        ];
      return updateInfo.value;
    } catch (e) {
      throw e;
    }
  },
  async updatePostPatch(id, updatedPost) {
    const updatedPostData = {};
    if (updatedPost.posterId) {
      updatedPostData.posterId = validation.checkId(
        updatedPost.posterId,
        'Poster ID'
      );
    }
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
    try {
      let newPost = await postCollection.findOneAndUpdate(
        {_id: ObjectId(id)},
        {$set: updatedPostData},
        {returnDocument: 'after'}
      );
      if (newPost.lastErrorObject.n === 0)
        throw [404, `Could not update the post with id ${id}`];

      return newPost.value;
    } catch (e) {
      throw e;
    }
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

    try {
      let updateOne = await postCollection.updateMany(
        findDocuments,
        firstUpdate
      );
      if (updateOne.matchedCount === 0)
        throw 'Could not find any posts with that old tag';
      let updateTwo = await postCollection.updateMany(
        findDocuments,
        secondUpdate
      );
      if (updateTwo.modifiedCount === 0) throw 'Could not update tags';
      return await this.getPostsByTag(newTag);
    } catch (e) {
      throw e;
    }
  },
};

export default exportedMethods;
