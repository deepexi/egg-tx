'use strict';
const Tx = require('../tx');

class MysqlTx extends Tx {

  constructor(ctx) {
    super(ctx);
  }

  async createSession() {
    try {
      return await this.ctx.model.transaction();
    } catch (e) {
      throw new Error('[egg-tx] 未开启 egg-sequelize 插件，将无法使用 mysql 事务');
    }
  }

  async rollback() {
    this.ctx.logger.debug(`[egg-tx] 发送异常，将回滚事务-sid：${this.sid}`);
    await this.session.rollback();
  }

  async commit() {
    this.ctx.logger.debug(`[egg-tx] 请求结束，提交事务-sid：${this.sid}`);
    await this.session.commit();
  }


}

module.exports = MysqlTx;
