import {posts} from './mongoCollections.js';
import dogData from './dogs.js';
import {ObjectId} from 'mongodb';

const exportedMethods = {
  async getPostById(id) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: new ObjectId(id)});
    if (!post) throw 'No post with that id';

    return post;
  },

  async getAllPosts() {
    const postCollection = await posts();
    const postList = await postCollection.find({}).toArray();
    if (!postList) throw 'Could not get all posts';
    return postList;
  },
  async addPost(title, body, posterId) {
    if (!title) throw 'You must provide a title';
    if (typeof title !== 'string') throw 'Title must be a string';
    if (title.trim().length === 0)
      throw 'Title cannot be an empty string or just spaces';
    if (!body) throw 'You must provide a body';
    if (typeof body !== 'string') throw 'Body must be a string ';
    if (body.trim().length === 0)
      throw 'Body cannot be an empty string or just spaces';
    if (!posterId) throw 'You must specify a poster';
    if (typeof posterId !== 'string') throw 'posterId must be a string';
    if (posterId.trim().length === 0)
      throw 'PosterId cannot be an empty string or just spaces';
    if (!ObjectId.isValid(posterId)) throw 'posterId is not a valid Object ID';
    title = title.trim();
    body = body.trim();
    posterId = posterId.trim();

    const dogThatPosted = await dogData.getDogById(posterId);
    if (!dogThatPosted) throw 'Could not find a dog with that ID';

    const newPostInfo = {
      title: title,
      body: body,
      poster: {
        id: new ObjectId(posterId),
        name: dogThatPosted.name
      }
    };
    const postCollection = await posts();
    const insertInfo = await postCollection.insertOne(newPostInfo);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add post';

    const newPost = await this.getPostById(insertInfo.insertedId.toString());

    return newPost;
  },
  async removePost(id) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const postCollection = await posts();
    const deletionInfo = await postCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });

    if (!deletionInfo) {
      throw `Could not delete post with id of ${id}`;
    }
    return {postTitle: deletionInfo.title, deleted: true};
  },
  async updatePost(id, title, body, posterId) {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0)
      throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    if (!title) throw 'You must provide a title';
    if (typeof title !== 'string') throw 'Title must be a string';
    if (title.trim().length === 0)
      throw 'Title cannot be an empty string or just spaces';
    if (!body) throw 'You must provide a body';
    if (typeof body !== 'string') throw 'Body must be a string ';
    if (body.trim().length === 0)
      throw 'Body cannot be an empty string or just spaces';
    if (!posterId) throw 'You must specify a poster';
    if (typeof posterId !== 'string') throw 'posterId must be a string';
    if (posterId.trim().length === 0)
      throw 'PosterId cannot be an empty string or just spaces';
    if (!ObjectId.isValid(posterId)) throw 'posterId is not a valid Object ID';
    title = title.trim();
    body = body.trim();
    posterId = posterId.trim();

    const dogThatPosted = await dogData.getDogById(posterId);
    if (!dogThatPosted) throw 'Could not find a dog with that ID';

    let updatedPost = {
      title: title,
      body: body,
      poster: {
        id: new ObjectId(posterId),
        name: dogThatPosted.name
      }
    };
    const postCollection = await posts();
    const updatedInfo = await postCollection.findOneAndReplace(
      {_id: new ObjectId(id)},
      updatedPost,
      {returnDocument: 'after'}
    );

    if (!updatedInfo) {
      throw 'could not update post successfully';
    }

    return updatedInfo;
  }
};

export default exportedMethods;
