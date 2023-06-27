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
  })
  .patch(async (req, res) => {
    //patch code here.
  });

router.get('/:id', async (req, res) => {
  //get route here.
});

router.post('/:id', async (req, res) => {
  //get route here.
});

router.delete('/:id', async (req, res) => {
  //get route here.
});

router.patch('/:id', async (req, res) => {
  //get route here.
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

// router.get('/', async (req, res) => {
//   try {
//     const postList = await postData.getAllPosts();
//     return res.json(postList);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

// router.post('/', async (req, res) => {
//   //post code here.
//   let x = 5;
//   res.json(x);
// });

// router.delete('/', async (req, res) => {
//   let x = 5;
//   res.json(x);
// });

export default router;
