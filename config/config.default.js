'use strict';

/**
 * egg-tx default config
 * @member Config#tx
 * @property {String} SOME_KEY - some description
 */
exports.tx = {
  reqAction: [ 'POST', 'PUT', 'DELETE' ],
  dbType: 'mysql',
};
