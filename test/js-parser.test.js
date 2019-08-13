'use strict';

const assert = require('assert');
const JsParser = require('../lib/js_parser');

describe('test/js-parser.test.js', () => {

  let jsParser;

  before(function() {
    jsParser = new JsParser(`${__dirname}/fixtures/apps/js-parser/home.js`);
  });

  it('获取类名', () => {
    const classInfo = jsParser.getClassInfo();
    assert.equal(classInfo.id.name, 'HomeController');
  });

  it('获取index方法@tx注解', () => {
    const methodInfo = jsParser.getMethod('create');
    assert.ok(methodInfo.doc.annotation.has('@tx'));
  });

});
