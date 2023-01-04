import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import users from '../data/users.js';
import posts from '../data/posts.js';

const db = await dbConnection();
await db.dropDatabase();

const patrick = await users.addUser('Patrick', 'Hill');
const id = patrick._id.toString();
await posts.addPost('Hello, class!', 'Today we are creating a blog!', id);
await posts.addPost(
  'Using the seed',
  'We use the seed to have some initial data so we can just focus on servers this week',
  id
);

await posts.addPost(
  'Using routes',
  'The purpose of today is to simply look at some GET routes',
  id
);

console.log('Done seeding database');

await closeConnection();
