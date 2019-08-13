'use strict';

const fs = require('fs');
const acorn = require('acorn');
const _ = require('lodash');

const REGEXP = {
  ANNOTATION: '(@\\w+)\\s*(.*)',
};

class JsParser {

  constructor(filePath) {
    this.filePath = filePath;
    this.metadata = null;
    this.methods = null;
    this.doc = [];
    this._parseCode();
  }

  _parseCode() {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`解析代码失败，文件不存在-${this.filePath}`);
    }
    const code = fs.readFileSync(this.filePath, 'utf8');
    if (!_.isEmpty(code)) {
      this.metadata = acorn.parse(code, {
        locations: true,
        onComment: this.doc,
      });
    }
  }

  getMethods() {
    if (_.isEmpty(this.methods)) {
      this.methods = new Map();
      const classDeclaration = this.getClassInfo();
      if (classDeclaration) {
        const classBody = classDeclaration.body;
        if (classBody && classBody.body) {
          const nodes = classBody.body;
          const blockDoc = this.getDocByType('Block');
          for (const node of nodes) {
            if (node.type === 'MethodDefinition') {
              // 获取方法上的注释信息
              node.doc = this._matchMethodDoc(node, blockDoc);
              if (node.doc) {
                node.doc.annotation = this.readAnnotationInfos(node.doc);
              }
              this.methods.set(node.key.name, node);
            }
          }
        }
      }
    }
    return this.methods;
  }

  getMethod(name) {
    const methods = this.getMethods();
    return methods.get(name);
  }

  readAnnotationInfos(doc) {
    const map = new Map();
    if (!_.isEmpty(doc)) {
      const sections = doc.value.split(/[\n\r]/);
      for (const section of sections) {
        const annotation = section.match(REGEXP.ANNOTATION);
        if (!_.isEmpty(annotation)) {
          const name = annotation[1];
          let params = [];
          if (annotation.length === 3) {
            if (!_.isEmpty(annotation[2])) {
              params = annotation[2].split(/[ ]+/);
            }
          }
          map.set(name, params);
        }
      }
    }
    return (map.size > 0) ? map : null;
  }

  getClassInfo() {
    if (this.metadata && this.metadata.body) {
      return _.find(this.metadata.body, { type: 'ClassDeclaration' });
    }
    return null;
  }

  getDocByType(type) {
    if (!_.isEmpty(this.doc)) {
      return this.doc.filter(obj => (obj.type === type));
    }
    return null;
  }

  _matchMethodDoc(methodNode, blockDoc) {
    if (_.isArray(blockDoc)) {
      const methodStartLine = methodNode.loc.start.line;
      for (const block of blockDoc) {
        if (block.loc.end.line === methodStartLine - 1) {
          return block;
        }
      }
    }
    return null;
  }

}

module.exports = JsParser;
