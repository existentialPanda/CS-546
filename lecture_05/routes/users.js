import {Router} from 'express';
const router = Router();
import {userData} from '../data/index.js';
import validation from '../data/validation.js';

router
  .route('/:id')
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id);
      const user = await userData.getUserById(req.params.id);
      res.json(user);
    } catch (e) {
      res.status(404).json(e);
    }
  })
  .post(async (req, res) => {
    res.send(`POST request to http://localhost:3000/users/${req.params.id}`);
  })
  .delete(async (req, res) => {
    res.send(`DELETE request to http://localhost:3000/users/${req.params.id}`);
  });

router
  .route('/')
  .get(async (req, res) => {
    try {
      const userList = await userData.getAllUsers();
      res.json(userList);
    } catch (e) {
      // Something went wrong with the server!
      res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    // Not implemented
    res.send('POST request to http://localhost:3000/users');
  })
  .delete(async (req, res) => {
    // Not implemented
    res.send('DELETE request to http://localhost:3000/users');
  });

export default router;
