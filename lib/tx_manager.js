'use strict';

const _ = require('lodash');

const TX = {
  mysql: require('./tx/mysql_tx'),
  mongo: require('./tx/mongo_tx'),
};

const ANNOTATION = {
  TX: '@tx',
  TX_IGNORE: '@txIgnore',
};

class TxManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.config = ctx.app.config.tx;
    this.callInfo = this._getCallInfo();
  }

  get() {
    if (this._isStartTx()) {
      return new TX[this.config.dbType](this.ctx);
    }
    return null;
  }

  _isStartTx() {
    if (this.callInfo) {
      if (this._isTxForReqAction()) {
        return (!this._getAnnotation(ANNOTATION.TX_IGNORE));
      }
      return (this._getAnnotation(ANNOTATION.TX));
    }
    return false;
  }

  _isTxForReqAction() {
    return this.config.reqAction.includes(this.callInfo.action);
  }

  _getAnnotation(name) {
    if (_.isMap(this.callInfo.annotation)) {
      for (const [ key, value ] of this.callInfo.annotation.entries()) {
        if (key === name) {
          return { name, params: value };
        }
      }
    }
    return null;
  }

  _getCallInfo() {
    const url = this.ctx.originalUrl;
    const routerCallMapping = this.ctx.app.routerCallMapping;
    for (const [ key, value ] of routerCallMapping.entries()) {
      if (url.match(key) && value.action === this.ctx.req.method) {
        return value;
      }
    }
    return null;
  }

}

module.exports = TxManager;
