'use strict';
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var ts = require('typescript');
var initializer_value_1 = require('./initializer-value');
function getExtensions(decorators, metadataGenerator) {
  var extensions = decorators.map(function (extensionDecorator) {
    if (!ts.isCallExpression(extensionDecorator.parent)) {
      throw new Error('The parent of the @Extension is not a CallExpression. Are you using it in the right place?');
    }
    var _a = __read(extensionDecorator.parent.arguments, 2),
      decoratorKeyArg = _a[0],
      decoratorValueArg = _a[1];
    if (!ts.isStringLiteral(decoratorKeyArg)) {
      throw new Error('The first argument of @Extension must be a string');
    }
    var attributeKey = decoratorKeyArg.text;
    if (!decoratorValueArg) {
      throw new Error("Extension '" + attributeKey + "' must contain a value");
    }
    if (attributeKey.indexOf('x-') !== 0) {
      throw new Error('Extensions must begin with "x-" to be valid. Please see the following link for more information: https://swagger.io/docs/specification/openapi-extensions/');
    }
    var attributeValue = initializer_value_1.getInitializerValue(decoratorValueArg, metadataGenerator.typeChecker);
    return { key: attributeKey, value: attributeValue };
  });
  return extensions;
}
exports.getExtensions = getExtensions;
//# sourceMappingURL=extension.js.map
