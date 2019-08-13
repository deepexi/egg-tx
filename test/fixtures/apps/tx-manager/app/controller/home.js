'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

  /**
   * @txIgnore
   */
  async index() {
    this.ctx.body = (this.ctx.tx) ? 'use tx' : 'not use tx';
  }

  /**
   * @tx
   */
  async create() {
    this.ctx.body = (this.ctx.tx) ? 'use tx' : 'not use tx';
  }

  async delete() {
    this.ctx.body = (this.ctx.tx) ? 'use tx' : 'not use tx';
  }

}

module.exports = HomeController;
