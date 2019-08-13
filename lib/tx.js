'use strict';
const uuidv1 = require('uuid/v1');

class Tx {
  constructor(ctx) {
    this.ctx = ctx;
    this.session = undefined;
    this.sid = undefined;
  }

  async start() {
    this.session = await this.createSession();
    this.sid = uuidv1();
    this.ctx.logger.debug(`启动事务-sid：${this.sid}`);
  }

  async createSession() {
    throw new Error('not implement');
  }

  async rollback() {
    throw new Error('not implement');
  }

  async commit() {
    throw new Error('not implement');
  }

}

module.exports = Tx;
