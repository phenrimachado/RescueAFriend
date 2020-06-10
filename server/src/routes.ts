import express from 'express';
import { celebrate, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import FriendsController from './controllers/FriendsController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointController = new PointsController();
const friendsController = new FriendsController();


routes.get('/friends', friendsController.index);
routes.get('/points', pointController.index);
routes.get('/points/:id', pointController.show);

routes.post(
  '/points', 
  upload.single('image'), 
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      age: Joi.string().required(),
      description: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      friends: Joi.string().required()
    })
  }, {
    abortEarly: false
  }),
  pointController.create);

export default routes;