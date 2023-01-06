import {Router} from 'express';
const router = Router();
import {postData} from '../data/index.js';
import validation from '../data/validation.js';
router
  .route('/:id')
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id);
      const post = await postData.getPostById(req.params.id);
      return res.json(post);
    } catch (e) {
      res.status(404).json(e);
    }
  })
  .post(async (req, res) => {
    return res.send(
      `POST request to http://localhost:3000/posts/${req.params.id}`
    );
  })
  .delete(async (req, res) => {
    return res.send(
      `DELETE request to http://localhost:3000/posts/${req.params.id}`
    );
  });

router
  .route('/')
  .get(async (req, res) => {
    try {
      const postList = await postData.getAllPosts();
      return res.json(postList);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    return res.send('POST request to http://localhost:3000/posts');
  })
  .delete(async (req, res) => {
    return res.send('DELETE request to http://localhost:3000/posts');
  });

export default router;
