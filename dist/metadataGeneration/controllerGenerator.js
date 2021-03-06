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
var decoratorUtils_1 = require('./../utils/decoratorUtils');
var exceptions_1 = require('./exceptions');
var methodGenerator_1 = require('./methodGenerator');
var typeResolver_1 = require('./typeResolver');
var ControllerGenerator = /** @class */ (function () {
  function ControllerGenerator(node, current) {
    this.node = node;
    this.current = current;
    this.path = this.getPath();
    this.tags = this.getTags();
    this.security = this.getSecurity();
    this.isHidden = this.getIsHidden();
    this.commonResponses = this.getCommonResponses();
  }
  ControllerGenerator.prototype.IsValid = function () {
    return !!this.path || this.path === '';
  };
  ControllerGenerator.prototype.Generate = function () {
    if (!this.node.parent) {
      throw new exceptions_1.GenerateMetadataError("Controller node doesn't have a valid parent source file.");
    }
    if (!this.node.name) {
      throw new exceptions_1.GenerateMetadataError("Controller node doesn't have a valid name.");
    }
    var sourceFile = this.node.parent.getSourceFile();
    return {
      location: sourceFile.fileName,
      methods: this.buildMethods(),
      name: this.node.name.text,
      path: this.path || '',
    };
  };
  ControllerGenerator.prototype.buildMethods = function () {
    var _this = this;
    return this.node.members
      .filter(function (m) {
        return m.kind === ts.SyntaxKind.MethodDeclaration;
      })
      .map(function (m) {
        return new methodGenerator_1.MethodGenerator(m, _this.current, _this.commonResponses, _this.tags, _this.security, _this.isHidden);
      })
      .filter(function (generator) {
        return generator.IsValid();
      })
      .map(function (generator) {
        return generator.Generate();
      });
  };
  ControllerGenerator.prototype.getPath = function () {
    var decorators = decoratorUtils_1.getDecorators(this.node, function (identifier) {
      return identifier.text === 'Route';
    });
    if (!decorators || !decorators.length) {
      return;
    }
    if (decorators.length > 1) {
      throw new exceptions_1.GenerateMetadataError("Only one Route decorator allowed in '" + this.node.name.text + "' class.");
    }
    var decorator = decorators[0];
    var expression = decorator.parent;
    var decoratorArgument = expression.arguments[0];
    return decoratorArgument ? '' + decoratorArgument.text : '';
  };
  ControllerGenerator.prototype.getCommonResponses = function () {
    var _this = this;
    var decorators = decoratorUtils_1.getDecorators(this.node, function (identifier) {
      return identifier.text === 'Response';
    });
    if (!decorators || !decorators.length) {
      return [];
    }
    return decorators.map(function (decorator) {
      var expression = decorator.parent;
      var _a = __read(decoratorUtils_1.getDecoratorValues(decorator, _this.current.typeChecker), 3),
        name = _a[0],
        description = _a[1],
        example = _a[2];
      if (!name) {
        throw new exceptions_1.GenerateMetadataError("Controller's responses should have an explicit name.");
      }
      return {
        description: description || '',
        examples: example === undefined ? undefined : [example],
        name: name,
        schema: expression.typeArguments && expression.typeArguments.length > 0 ? new typeResolver_1.TypeResolver(expression.typeArguments[0], _this.current).resolve() : undefined,
      };
    });
  };
  ControllerGenerator.prototype.getTags = function () {
    var decorators = decoratorUtils_1.getDecorators(this.node, function (identifier) {
      return identifier.text === 'Tags';
    });
    if (!decorators || !decorators.length) {
      return;
    }
    if (decorators.length > 1) {
      throw new exceptions_1.GenerateMetadataError("Only one Tags decorator allowed in '" + this.node.name.text + "' class.");
    }
    var decorator = decorators[0];
    var expression = decorator.parent;
    return expression.arguments.map(function (a) {
      return a.text;
    });
  };
  ControllerGenerator.prototype.getSecurity = function () {
    var _this = this;
    var noSecurityDecorators = decoratorUtils_1.getDecorators(this.node, function (identifier) {
      return identifier.text === 'NoSecurity';
    });
    var securityDecorators = decoratorUtils_1.getDecorators(this.node, function (identifier) {
      return identifier.text === 'Security';
    });
    if (noSecurityDecorators === null || noSecurityDecorators === void 0 ? void 0 : noSecurityDecorators.length) {
      throw new exceptions_1.GenerateMetadataError("NoSecurity decorator is unnecessary in '" + this.node.name.text + "' class.");
    }
    if (!securityDecorators || !securityDecorators.length) {
      return [];
    }
    return securityDecorators.map(function (d) {
      return decoratorUtils_1.getSecurites(d, _this.current.typeChecker);
    });
  };
  ControllerGenerator.prototype.getIsHidden = function () {
    var hiddenDecorators = decoratorUtils_1.getDecorators(this.node, function (identifier) {
      return identifier.text === 'Hidden';
    });
    if (!hiddenDecorators || !hiddenDecorators.length) {
      return false;
    }
    if (hiddenDecorators.length > 1) {
      throw new exceptions_1.GenerateMetadataError("Only one Hidden decorator allowed in '" + this.node.name.text + "' class.");
    }
    return true;
  };
  return ControllerGenerator;
})();
exports.ControllerGenerator = ControllerGenerator;
//# sourceMappingURL=controllerGenerator.js.map
