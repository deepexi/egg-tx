'use strict';

const mock = require('egg-mock');
const assert = require('assert');
const TxManagerTest = require('../lib/tx_manager');

describe('test/tx-manager.test.js', () => {

  let app;

  before(async () => {
    app = mock.app({
      baseDir: `apps/tx-manager`,
    });
    await app.ready();
  });

  it('使用 @tx 注解开启事务管理', () => {
    const ctx = {
      app,
      originalUrl: '/',
      req: { method: 'POST' },
      model: {
        transaction() {
          return {
            rollback() {
              console.log('回滚事务');
            },
            commit() {
              console.log('提交事务');
            },
          };
        },
      },
    };
    const txManager = new TxManagerTest(ctx);
    const tx = txManager.get();
    assert.ok(tx);
  });

  it('使用 @txIgnore 注解关闭事务管理', () => {
    const ctx = {
      app,
      originalUrl: '/',
      req: { method: 'GET' },
    };
    const txManager = new TxManagerTest(ctx);
    const tx = txManager.get();
    assert.equal(tx, null);
  });

  it('delete 请求动作全局事务管理', () => {
    const ctx = {
      app,
      originalUrl: '/',
      req: { method: 'DELETE' },
    };
    const txManager = new TxManagerTest(ctx);
    const tx = txManager.get();
    assert.ok(tx);
  });

  it('未开启 egg-sequelize 插件时开启事务抛异常', async () => {
    const ctx = {
      app,
      originalUrl: '/',
      req: { method: 'POST' },
      logger: {
        debug(msg) { console.log(msg); },
      },
    };
    const txManager = new TxManagerTest(ctx);
    const tx = txManager.get();
    let msg;
    try {
      await tx.start();
    } catch (e) {
      msg = e.message;
    }
    assert.throws(() => {
      if (msg) { throw new (msg)(); }
    });
  });

});
