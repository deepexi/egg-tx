# egg-tx

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-tx.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-tx
[travis-image]: https://img.shields.io/travis/eggjs/egg-tx.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-tx
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-tx.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-tx?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-tx.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-tx
[snyk-image]: https://snyk.io/test/npm/egg-tx/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-tx
[download-image]: https://img.shields.io/npm/dm/egg-tx.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-tx

一个 egg 事务插件，它支持 Mysql、Mongo 数据库，它能做到请求接口级别的事务管理。

## 依赖的插件
- 对于使用 Mysql 数据库你需要开启 `egg-sequelize` 插件。
- 对于使用 Mongo 数据库你需要开启 `egg-mongoose` 插件。

## 安装

```bash
$ npm i egg-tx --save
```

## 开启插件

```js
// {app_root}/config/plugin.js
exports.tx = {
  enable: true,
  package: 'egg-tx',
};
```

## 配置
```js
// {app_root}/config/config.default.js
exports.tx = {
    reqAction:['POST','PUT','DELETE'], 
    dbType:'mysql'
};
```
- reqAction：将为指定动作的所有请求进行事务管理，该数组的值可为 GET、POST、PUT、DELETE、HEAD、PATCH、OPTIONS（默认值为 POST、PUT、DELETE）
- dbType：所使用的数据库类型，该值可为 mysql 或 mongo （默认值为 mysql）

## 使用例子

你可以通过 `ctx.tx.session` 获取到本次请求的事务会话对象，前提是它已经被事务管理器所管理。

##### mysql
```js
await this.ctx.model.User.create(user, {
    transaction: this.ctx.tx.session,
});
```

##### mongo
```js
await this.ctx.model.User.insertMany([
  { username: 'lyTongXue', password: '123456' },
], { session: this.ctx.tx.session });
```

## 注解

##### @tx
使用该注解的接口方法将会进行事务管理，即便 reqAction 配置项中未包含该动作类型的请求。
```js
// {app_root}/app/controller/{controller_name}.js
/**
* @tx
*/
async create(){
}
```

##### @txIgnore
即便 reqAction 配置项中包含了该动作类型的请求，使用了该注解的接口方法将不会进行事务管理。
```js
// {app_root}/app/controller/{controller_name}.js
/**
* @txIgnore
*/
async index(){
}
```

## 提问交流
1、接口方法的 jsDoc 是否有一定要求？
- jsDoc 必须要与方法"紧挨着"，如：
```js
// --- 正确写法

/**
* @TX
*/
async create(){
}

// --- 错误写法

/**
* @TX
*/


async create(){
}
```

请到 [egg issues](https://github.com/eggjs/egg/issues) 异步交流。

## License

[MIT](LICENSE)
