import {Router} from 'express';
const router = Router();
import {postData} from '../data/index.js';
import validation from '../validation.js';

router.get('/:id', async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, 'Id URL Param');
  } catch (e) {
    return res.status(400).json({error: e});
  }
  try {
    const post = await postData.getPostById(req.params.id);
    res.json(post);
  } catch (e) {
    res.status(404).json({error: e});
  }
});

router.get('/tag/:tag', async (req, res) => {
  try {
    req.params.tag = validation.checkString(req.params.tag, 'Tag');
  } catch (e) {
    return res.status(400).json({error: e});
  }
  try {
    const postList = await postData.getPostsByTag(req.params.tag);
    res.json(postList);
  } catch (e) {
    res.status(400).json({error: e});
  }
});

router.get('/', async (req, res) => {
  try {
    const postList = await postData.getAllPosts();
    res.json(postList);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.post('/', async (req, res) => {
  const blogPostData = req.body;
  try {
    blogPostData.title = validation.checkString(blogPostData.title, 'Title');
    blogPostData.body = validation.checkString(blogPostData.body, 'Body');
    blogPostData.posterId = validation.checkId(
      blogPostData.posterId,
      'Poster ID'
    );
  } catch (e) {
    return res.status(400).json({error: e});
  }

  try {
    const {title, body, tags, posterId} = blogPostData;
    const newPost = await postData.addPost(title, body, tags, posterId);
    res.json(newPost);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.put('/:id', async (req, res) => {
  const updatedData = req.body;
  try {
    req.params.id = validation.checkId(req.params.id, 'ID url param');
    updatedData.title = validation.checkString(updatedData.title, 'Title');
    updatedData.body = validation.checkString(updatedData.body, 'Body');
    updatedData.posterId = validation.checkId(
      updatedData.posterId,
      'Poster ID'
    );
  } catch (e) {
    return res.status(400).json({error: e});
  }

  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    return res.status(404).json({error: 'Post not found'});
  }

  try {
    const updatedPost = await postData.updatePost(req.params.id, updatedData);
    res.json(updatedPost);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.patch('/:id', async (req, res) => {
  const requestBody = req.body;
  let updatedObject = {};
  try {
    req.params.id = validation.checkId(req.params.id, 'Post ID');
    if (requestBody.title)
      requestBody.title = validation.checkString(requestBody.title, 'Title');
    if (requestBody.body)
      requestBody.body = validation.checkString(requestBody.body, 'Body');
    if (requestBody.posterId)
      requestBody.posterId = validation.checkId(
        requestBody.posterId,
        'Poster ID'
      );
    if (requestBody.tags)
      requestBody.tags = validation.checkStringArray(requestBody.tags, 'Tags');
  } catch (e) {
    return res.status(400).json({error: e});
  }
  try {
    const oldPost = await postData.getPostById(req.params.id);
    if (requestBody.title && requestBody.title !== oldPost.title)
      updatedObject.title = requestBody.title;
    if (requestBody.body && requestBody.body !== oldPost.body)
      updatedObject.body = requestBody.body;
    if (requestBody.tags && requestBody.tags !== oldPost.tags)
      updatedObject.tags = requestBody.tags;
    if (requestBody.posterId && requestBody.posterId !== oldPost.posterId)
      updatedObject.posterId = requestBody.posterId;
  } catch (e) {
    return res.status(404).json({error: 'Post not found'});
  }
  if (Object.keys(updatedObject).length !== 0) {
    try {
      const updatedPost = await postData.updatePost(
        req.params.id,
        updatedObject
      );
      res.json(updatedPost);
    } catch (e) {
      res.status(500).json({error: e});
    }
  } else {
    res.status(400).json({
      error:
        'No fields have been changed from their inital values, so no update has occurred',
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, 'Id URL Param');
  } catch (e) {
    return res.status(400).json({error: e});
  }
  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    return res.status(404).json({error: 'Post not found'});
  }
  try {
    await postData.removePost(req.params.id);
    res.status(200).json({deleted: true});
  } catch (e) {
    res.status(500).json({error: e});
  }
});

export default router;
