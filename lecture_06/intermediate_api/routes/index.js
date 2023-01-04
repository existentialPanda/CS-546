import postRoutes from './posts.js';
import userRoutes from './users.js';

const constructorMethod = (app) => {
  app.use('/posts', postRoutes);
  app.use('/users', userRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

export {constructorMethod};
