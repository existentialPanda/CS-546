import exampleRoutes from './examples.js';

const constructorMethod = (app) => {
  app.use('/examples', exampleRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

export {constructorMethod};
