'use strict';

const CallCollectHandler = require('./lib/call_collect_handler');

module.exports = class AppBootHook {
  constructor(app) {
    this.app = app;
    this.app.config.appMiddleware.push('txHandler');
  }

  configWillLoad() {
    this.app.routerCallMapping = new Map();
    this._collectRouterCallInfo();
  }

  _collectRouterCallInfo() {
    const routerCallMapping = this.app.routerCallMapping;
    const router = this.app.router;
    const proxyMethods = [ 'resources', 'get', 'post', 'put', 'delete', 'head', 'patch', 'options' ];
    proxyMethods.forEach(method => {
      if (Reflect.has(router, method)) {
        const callCollectHandler = new CallCollectHandler(router, method, callMapping => {
          callMapping.forEach((value, key) => {
            routerCallMapping.set(key, value);
          });
        });
        router[method] = new Proxy(router[method], callCollectHandler);
      }
    });
  }

};
