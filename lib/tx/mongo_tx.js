'use strict';
const Tx = require('../tx');

class MongoTx extends Tx {

  constructor(ctx) {
    super(ctx);
  }

  async createSession() {
    try {
      const session = await this.ctx.app.mongoose.startSession();
      session.startTransaction();
      return session;
    } catch (e) {
      throw new Error('[egg-tx] 未开启 egg-mongoose 插件，将无法使用 mongo 事务');
    }
  }

  async rollback() {
    this.ctx.logger.debug(`[egg-tx] 发送异常，将回滚事务-sid：${this.sid}`);
    await this.session.abortTransaction();
  }

  async commit() {
    this.ctx.logger.debug(`[egg-tx] 请求结束，提交事务-sid：${this.sid}`);
    await this.session.commitTransaction();
  }

}

module.exports = MongoTx;
