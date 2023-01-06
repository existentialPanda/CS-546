import apiRoutes from './api.js';
import {getAll} from '../data/index.js';

const constructorMethod = (app) => {
  app.use('/api', apiRoutes);

  app.get('/', function (request, response) {
    response.render('home', {
      pageTitle: 'So Much ToDo!',
      todoItems: getAll(),
    });
  });

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

export {constructorMethod};
