import {Router} from 'express';
const router = Router();
import {userData} from '../data/index.js';
import validation from '../validation.js';

router.get('/:id', async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, 'ID URL Param');
  } catch (e) {
    return res.status(400).json({error: e});
  }
  try {
    let user = await userData.getUserById(req.params.id);
    res.json(user);
  } catch (e) {
    res.status(404).json({error: 'User not found'});
  }
});

router.get('/', async (req, res) => {
  try {
    let userList = await userData.getAllUsers();
    res.json(userList);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
  let userInfo = req.body;

  try {
    userInfo.firstName = validation.checkString(
      userInfo.firstName,
      'First Name'
    );
    userInfo.lastName = validation.checkString(userInfo.lastName, 'Last Name');
  } catch (e) {
    return res.status(400).json({error: e});
  }

  try {
    const newUser = await userData.addUser(
      userInfo.firstName,
      userInfo.lastName
    );
    res.json(newUser);
  } catch (e) {
    res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  let userInfo = req.body;
  try {
    req.params.id = validation.checkId(req.params.id);
    userInfo.firstName = validation.checkString(
      userInfo.firstName,
      'First Name'
    );
    userInfo.lastName = validation.checkString(userInfo.lastName, 'Last Name');
  } catch (e) {
    return res.status(400).json({error: e});
  }

  try {
    await userData.getUserById(req.params.id);
  } catch (e) {
    return res.status(404).json({error: 'User not found'});
  }
  try {
    const updatedUser = await userData.updateUser(req.params.id, userInfo);
    res.json(updatedUser);
  } catch (e) {
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id);
  } catch (e) {
    return res.status(400).json({error: e});
  }
  try {
    await userData.getUserById(req.params.id);
  } catch (e) {
    return res.status(404).json({error: 'User not found'});
  }

  try {
    await userData.removeUser(req.params.id);
    res.json({deleted: true});
  } catch (e) {
    res.status(500).send('Internal Server Error');
  }
});

export default router;
