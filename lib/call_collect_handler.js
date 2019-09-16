'use strict';

const _ = require('lodash');
const JsParser = require('./js_parser');

const RestfulPath = {
  index: { pathSuffix: '', action: 'GET' },
  new: { pathSuffix: '/new', action: 'GET' },
  show: { pathSuffix: '/:id', action: 'GET' },
  edit: { pathSuffix: '/:id/edit', action: 'GET' },
  create: { pathSuffix: '', action: 'POST' },
  update: { pathSuffix: '/:id', action: 'PUT' },
  destroy: { pathSuffix: '/:id', action: 'DELETE' },
};

const REGEXP = {
  ROUTER_FULL_PATH: '(.*)#((.*)\\.(.*))\\(.*\\)',
};

class CallCollectHandler {

  constructor(router, methodName, callback) {
    this.router = router;
    this.method = methodName.toUpperCase();
    this.callback = callback;
  }

  apply(target, ctx, args) {
    target.call(ctx, ...args);
    if (_.isArray(args)) {
      let callMapping;
      if (this.method !== 'RESOURCES') {
        callMapping = this._getCallMapping(args);
      } else {
        callMapping = this._getCallMappingForResources(args);
      }
      if (callMapping) {
        this.callback(callMapping);
      }
    }
  }

  _getCallMapping(args) {
    const callMapping = new Map();
    const control = this._getControl(args);
    const routerPath = this._getRouterPath(args);
    const routerInfo = this._getRouterInfo(this.method, routerPath);
    if (routerInfo && control) {
      const callFullPath = this._getCallFullPath(control);
      const callInfo = this._parseCallPath(callFullPath);
      if (callInfo) {
        callInfo.action = this.method;
        const controlParser = this._getControlParser(callInfo.filePath);
        const method = controlParser.getMethod(callInfo.method);
        if (method && method.doc) {
          callInfo.annotation = method.doc.annotation;
        }
        callMapping.set(routerInfo.regexp, callInfo);
      }
    }
    return (callMapping.size > 0) ? callMapping : null;
  }

  _getCallMappingForResources(args) {
    const callMapping = new Map();
    const control = this._getControlForResources(args);
    for (const key in control) {
      if (typeof control[key] === 'function') {
        const pathInfo = RestfulPath[key];
        if (pathInfo) {
          let routerPath = this._getRouterPath(args);
          routerPath = (routerPath === '/') ? '' : routerPath;
          routerPath += pathInfo.pathSuffix;
          const routerInfo = this._getRouterInfo(pathInfo.action, routerPath);
          if (routerInfo) {
            const callFullPath = this._getCallFullPath(control[key]);
            const callInfo = this._parseCallPath(callFullPath);
            if (callInfo) {
              callInfo.action = pathInfo.action;
              const controlParser = this._getControlParser(callInfo.filePath);
              const method = controlParser.getMethod(callInfo.method);
              if (method && method.doc) {
                callInfo.annotation = method.doc.annotation;
              }
              callMapping.set(routerInfo.regexp, callInfo);
            }
          }
        }
      }
    }
    return (callMapping.size > 0) ? callMapping : null;
  }

  _getRouterInfo(action, path) {
    if (!_.isEmpty(action)) {
      for (const layer of this.router.stack) {
        if (path === layer.path && layer.methods.includes(action)) {
          return layer;
        }
      }
    }
    return null;
  }

  _getRouterPath(args) {
    let routerPath;
    for (const arg of args) {
      if (_.isString(arg)) {
        routerPath = arg;
      }
    }
    return routerPath;
  }

  _getControl(args) {
    return _.find(args, arg => (typeof arg === 'function' && arg.name === 'classControllerMiddleware'));
  }

  _getControlForResources(args) {
    for (const arg of args) {
      if (typeof arg === 'object') {
        if (this._getCallFullPath(arg)) {
          return arg;
        }
      }
    }
    return null;
  }

  _getCallFullPath(controller) {
    const symbols = Object.getOwnPropertySymbols(controller);
    const symbol = _.find(symbols, symbol => {
      const str = symbol.toString();
      const desc = str.substring(str.indexOf('(') + 1, str.indexOf(')'));
      if (desc === 'EGG_LOADER_ITEM_FULLPATH') {
        return true;
      }
    });
    return controller[symbol];
  }

  _parseCallPath(path) {
    if (_.isString(path)) {
      const sections = path.match(REGEXP.ROUTER_FULL_PATH);
      if (sections.length === 5) {
        return {
          filePath: sections[1],
          controller: sections[3],
          method: sections[4],
        };
      }
    }
    return null;
  }

  _getControlParser(filePath) {
    let controlParser = this.controlParserMap.get(filePath);
    if (!controlParser) {
      controlParser = new JsParser(filePath);
      this.controlParserMap.set(filePath, controlParser);
    }
    return controlParser;
  }

}

CallCollectHandler.prototype.controlParserMap = new Map();

module.exports = CallCollectHandler;
