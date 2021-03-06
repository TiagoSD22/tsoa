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
var initializer_value_1 = require('../metadataGeneration/initializer-value');
function getDecorators(node, isMatching) {
  var decorators = node.decorators;
  if (!decorators || !decorators.length) {
    return [];
  }
  return decorators
    .map(function (e) {
      while (e.expression !== undefined) {
        e = e.expression;
      }
      return e;
    })
    .filter(isMatching);
}
exports.getDecorators = getDecorators;
function getNodeFirstDecoratorName(node, isMatching) {
  var decorators = getDecorators(node, isMatching);
  if (!decorators || !decorators.length) {
    return;
  }
  return decorators[0].text;
}
exports.getNodeFirstDecoratorName = getNodeFirstDecoratorName;
function getNodeFirstDecoratorValue(node, typeChecker, isMatching) {
  var decorators = getDecorators(node, isMatching);
  if (!decorators || !decorators.length) {
    return;
  }
  var values = getDecoratorValues(decorators[0], typeChecker);
  return values && values[0];
}
exports.getNodeFirstDecoratorValue = getNodeFirstDecoratorValue;
function getDecoratorValues(decorator, typeChecker) {
  var expression = decorator.parent;
  var expArguments = expression.arguments;
  if (!expArguments || !expArguments.length) {
    return;
  }
  return expArguments.map(function (a) {
    return initializer_value_1.getInitializerValue(a, typeChecker);
  });
}
exports.getDecoratorValues = getDecoratorValues;
function getSecurites(decorator, typeChecker) {
  var _a;
  var _b = __read(getDecoratorValues(decorator, typeChecker), 2),
    first = _b[0],
    second = _b[1];
  if (isObject(first)) {
    return first;
  }
  return (_a = {}), (_a[first] = second || []), _a;
}
exports.getSecurites = getSecurites;
function isDecorator(node, isMatching) {
  var decorators = getDecorators(node, isMatching);
  if (!decorators || !decorators.length) {
    return false;
  }
  return true;
}
exports.isDecorator = isDecorator;
function isObject(v) {
  return typeof v === 'object' && v !== null;
}
//# sourceMappingURL=decoratorUtils.js.map
