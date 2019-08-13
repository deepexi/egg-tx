'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/user/:id', controller.home.getUser);
  router.post('/user', controller.home.createUser);
  router.resources('/', controller.home);
  router.resources('/home', controller.home);
};
