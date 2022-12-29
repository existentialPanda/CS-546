const express = require('express');
const router = express.Router();
const data = require('../data');
const postData = data.posts;
const validation = require('../data/validation');

router
  .route('/:id')
  .get(async (req, res) => {
    console.log(typeof req.params.id);
    try {
      req.params.id = validation.checkId(req.params.id);
      const post = await postData.getPostById(req.params.id);
      res.json(post);
    } catch (e) {
      res.status(404).json(e);
    }
  })
  .post(async (req, res) => {
    res.send(`POST request to http://localhost:3000/posts/${req.params.id}`);
  })
  .delete(async (req, res) => {
    res.send(`DELETE request to http://localhost:3000/posts/${req.params.id}`);
  });

router
  .route('/')
  .get(async (req, res) => {
    try {
      const postList = await postData.getAllPosts();
      res.json(postList);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    res.send('POST request to http://localhost:3000/posts');
  })
  .delete(async (req, res) => {
    res.send('DELETE request to http://localhost:3000/posts');
  });

module.exports = router;
