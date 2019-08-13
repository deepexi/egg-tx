'use strict';
const TxManager = require('../../lib/tx_manager');

module.exports = () => {
  return async function txHan(ctx, next) {
    const txManager = new TxManager(ctx);
    const tx = txManager.get();
    if (tx) {
      await tx.start();
      ctx.tx = tx;
    }
    try {
      await next();
      if (tx) { await tx.commit(); }
    } catch (e) {
      if (tx) { await tx.rollback(); }
      throw e;
    }
  };
};
