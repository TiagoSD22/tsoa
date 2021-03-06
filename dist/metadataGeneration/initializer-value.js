'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var ts = require('typescript');
exports.getInitializerValue = function (initializer, typeChecker, type) {
  if (!initializer || !typeChecker) {
    return;
  }
  switch (initializer.kind) {
    case ts.SyntaxKind.ArrayLiteralExpression:
      var arrayLiteral = initializer;
      return arrayLiteral.elements.map(function (element) {
        return exports.getInitializerValue(element, typeChecker);
      });
    case ts.SyntaxKind.StringLiteral:
      return initializer.text;
    case ts.SyntaxKind.TrueKeyword:
      return true;
    case ts.SyntaxKind.FalseKeyword:
      return false;
    case ts.SyntaxKind.NumberKeyword:
    case ts.SyntaxKind.FirstLiteralToken:
      return Number(initializer.text);
    case ts.SyntaxKind.NewExpression:
      var newExpression = initializer;
      var ident = newExpression.expression;
      if (ident.text === 'Date') {
        var date = new Date();
        if (newExpression.arguments) {
          var newArguments = newExpression.arguments.filter(function (args) {
            return args.kind !== undefined;
          });
          var argsValue = newArguments.map(function (args) {
            return exports.getInitializerValue(args, typeChecker);
          });
          if (argsValue.length > 0) {
            date = new Date(argsValue);
          }
        }
        var dateString = date.toISOString();
        if (type && type.dataType === 'date') {
          return dateString.split('T')[0];
        }
        return dateString;
      }
      return;
    case ts.SyntaxKind.ObjectLiteralExpression:
      var objectLiteral = initializer;
      var nestedObject_1 = {};
      objectLiteral.properties.forEach(function (p) {
        nestedObject_1[p.name.text] = exports.getInitializerValue(p.initializer, typeChecker);
      });
      return nestedObject_1;
    default:
      var symbol = typeChecker.getSymbolAtLocation(initializer);
      var extractedInitializer = symbol && symbol.valueDeclaration && hasInitializer(symbol.valueDeclaration) && symbol.valueDeclaration.initializer;
      return extractedInitializer ? exports.getInitializerValue(extractedInitializer, typeChecker) : undefined;
  }
};
var hasInitializer = function (node) {
  return node.hasOwnProperty('initializer');
};
//# sourceMappingURL=initializer-value.js.map
