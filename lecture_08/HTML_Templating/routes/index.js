import postRoutes from './posts.js';
import userRoutes from './users.js';
import path from 'path';

const constructorMethod = (app) => {
  app.use('/posts', postRoutes);
  app.use('/users', userRoutes);
  app.get('/about', (req, res) => {
    res.sendFile(path.resolve('static/about.html'));
  });
  app.use('*', (req, res) => {
    res.redirect('/posts');
  });
};

export {constructorMethod};
