'use strict';

const mock = require('egg-mock');
const assert = require('assert');

describe('test/call-collect-handler.test.js', () => {

  let app;

  before(async () => {
    app = mock.app({
      baseDir: `apps/call-collect-handler`,
    });
    await app.ready();
  });

  it('收集路由调用信息', () => {
    assert.equal(app.routerCallMapping.size, 16);
  });

});
