import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const express = require('express');

const controller = (app) => {
  const route = express.Router();
  app.use('/', route);

  route.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  route.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  route.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });

    router.get('/connect', (req, res) => {
    AuthController.getConnect(req, res);
  });

  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });

  router.get('/users/me', (req, res) => {
    UsersController.getMe(req, res);
  });
  
};

export default controller;
