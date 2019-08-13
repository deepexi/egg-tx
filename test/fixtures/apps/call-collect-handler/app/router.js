'use strict';

module.exports = app => {
  const { router, controller } = app;

  console.log('router.start.........');
  router.get('/user/:id', controller.home.getUser);
  router.post('/user', controller.home.createUser);
  router.resources('/', controller.home);
  router.resources('/home', controller.home);
  console.log('router.end.........');
};
