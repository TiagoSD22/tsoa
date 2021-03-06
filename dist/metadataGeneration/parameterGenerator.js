'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
var ts = require('typescript');
var decoratorUtils_1 = require('./../utils/decoratorUtils');
var jsDocUtils_1 = require('./../utils/jsDocUtils');
var validatorUtils_1 = require('./../utils/validatorUtils');
var exceptions_1 = require('./exceptions');
var initializer_value_1 = require('./initializer-value');
var typeResolver_1 = require('./typeResolver');
var ParameterGenerator = /** @class */ (function () {
  function ParameterGenerator(parameter, method, path, current) {
    this.parameter = parameter;
    this.method = method;
    this.path = path;
    this.current = current;
  }
  ParameterGenerator.prototype.Generate = function () {
    var _this = this;
    var decoratorName = decoratorUtils_1.getNodeFirstDecoratorName(this.parameter, function (identifier) {
      return _this.supportParameterDecorator(identifier.text);
    });
    switch (decoratorName) {
      case 'Request':
        return this.getRequestParameter(this.parameter);
      case 'Body':
        return this.getBodyParameter(this.parameter);
      case 'BodyProp':
        return this.getBodyPropParameter(this.parameter);
      case 'Header':
        return this.getHeaderParameter(this.parameter);
      case 'Query':
        return this.getQueryParameter(this.parameter);
      case 'Path':
        return this.getPathParameter(this.parameter);
      case 'Res':
        return this.getResParameter(this.parameter);
      default:
        return this.getPathParameter(this.parameter);
    }
  };
  ParameterGenerator.prototype.getRequestParameter = function (parameter) {
    var parameterName = parameter.name.text;
    return {
      description: this.getParameterDescription(parameter),
      in: 'request',
      name: parameterName,
      parameterName: parameterName,
      required: !parameter.questionToken && !parameter.initializer,
      type: { dataType: 'object' },
      validators: validatorUtils_1.getParameterValidators(this.parameter, parameterName),
    };
  };
  ParameterGenerator.prototype.getResParameter = function (parameter) {
    var parameterName = parameter.name.text;
    var decorator =
      decoratorUtils_1.getNodeFirstDecoratorValue(this.parameter, this.current.typeChecker, function (ident) {
        return ident.text === 'Res';
      }) || parameterName;
    if (!decorator) {
      throw new exceptions_1.GenerateMetadataError('Could not find Decorator', parameter);
    }
    var typeNode = parameter.type;
    if (!typeNode || !ts.isTypeReferenceNode(typeNode) || typeNode.typeName.getText() !== 'TsoaResponse') {
      throw new exceptions_1.GenerateMetadataError('@Res() requires the type to be TsoaResponse<HTTPStatusCode, ResBody>', parameter);
    }
    if (!typeNode.typeArguments || !typeNode.typeArguments[0]) {
      throw new exceptions_1.GenerateMetadataError('@Res() requires the type to be TsoaResponse<HTTPStatusCode, ResBody>', parameter);
    }
    var statusArgument = typeNode.typeArguments[0];
    var statusArgumentType = this.current.typeChecker.getTypeAtLocation(statusArgument);
    var isNumberLiteralType = function (tsType) {
      // tslint:disable-next-line:no-bitwise
      return (tsType.getFlags() & ts.TypeFlags.NumberLiteral) !== 0;
    };
    if (!isNumberLiteralType(statusArgumentType)) {
      throw new exceptions_1.GenerateMetadataError('@Res() requires the type to be TsoaResponse<HTTPStatusCode, ResBody>', parameter);
    }
    var status = statusArgumentType.value + '';
    var type = new typeResolver_1.TypeResolver(typeNode.typeArguments[1], this.current, typeNode).resolve();
    return {
      description: this.getParameterDescription(parameter) || '',
      in: 'res',
      name: status,
      parameterName: parameterName,
      examples: this.getParameterExample(parameter, parameterName),
      required: true,
      type: type,
      schema: type,
      validators: {},
    };
  };
  ParameterGenerator.prototype.getBodyPropParameter = function (parameter) {
    var parameterName = parameter.name.text;
    var type = this.getValidatedType(parameter);
    if (!this.supportBodyMethod(this.method)) {
      throw new exceptions_1.GenerateMetadataError("@BodyProp('" + parameterName + "') Can't support in " + this.method.toUpperCase() + ' method.');
    }
    return {
      default: initializer_value_1.getInitializerValue(parameter.initializer, this.current.typeChecker, type),
      description: this.getParameterDescription(parameter),
      example: this.getParameterExample(parameter, parameterName),
      in: 'body-prop',
      name:
        decoratorUtils_1.getNodeFirstDecoratorValue(this.parameter, this.current.typeChecker, function (ident) {
          return ident.text === 'BodyProp';
        }) || parameterName,
      parameterName: parameterName,
      required: !parameter.questionToken && !parameter.initializer,
      type: type,
      validators: validatorUtils_1.getParameterValidators(this.parameter, parameterName),
    };
  };
  ParameterGenerator.prototype.getBodyParameter = function (parameter) {
    var parameterName = parameter.name.text;
    var type = this.getValidatedType(parameter);
    if (!this.supportBodyMethod(this.method)) {
      throw new exceptions_1.GenerateMetadataError("@Body('" + parameterName + "') Can't support in " + this.method.toUpperCase() + ' method.');
    }
    return {
      description: this.getParameterDescription(parameter),
      in: 'body',
      name: parameterName,
      example: this.getParameterExample(parameter, parameterName),
      parameterName: parameterName,
      required: !parameter.questionToken && !parameter.initializer,
      type: type,
      validators: validatorUtils_1.getParameterValidators(this.parameter, parameterName),
    };
  };
  ParameterGenerator.prototype.getHeaderParameter = function (parameter) {
    var parameterName = parameter.name.text;
    var type = this.getValidatedType(parameter);
    if (!this.supportPathDataType(type)) {
      throw new exceptions_1.GenerateMetadataError("@Header('" + parameterName + "') Can't support '" + type.dataType + "' type.");
    }
    return {
      default: initializer_value_1.getInitializerValue(parameter.initializer, this.current.typeChecker, type),
      description: this.getParameterDescription(parameter),
      example: this.getParameterExample(parameter, parameterName),
      in: 'header',
      name:
        decoratorUtils_1.getNodeFirstDecoratorValue(this.parameter, this.current.typeChecker, function (ident) {
          return ident.text === 'Header';
        }) || parameterName,
      parameterName: parameterName,
      required: !parameter.questionToken && !parameter.initializer,
      type: type,
      validators: validatorUtils_1.getParameterValidators(this.parameter, parameterName),
    };
  };
  ParameterGenerator.prototype.getQueryParameter = function (parameter) {
    var parameterName = parameter.name.text;
    var type = this.getValidatedType(parameter);
    var commonProperties = {
      default: initializer_value_1.getInitializerValue(parameter.initializer, this.current.typeChecker, type),
      description: this.getParameterDescription(parameter),
      example: this.getParameterExample(parameter, parameterName),
      in: 'query',
      name:
        decoratorUtils_1.getNodeFirstDecoratorValue(this.parameter, this.current.typeChecker, function (ident) {
          return ident.text === 'Query';
        }) || parameterName,
      parameterName: parameterName,
      required: !parameter.questionToken && !parameter.initializer,
      validators: validatorUtils_1.getParameterValidators(this.parameter, parameterName),
    };
    if (this.getQueryParamterIsHidden(parameter)) {
      if (commonProperties.required) {
        throw new exceptions_1.GenerateMetadataError("@Query('" + parameterName + "') Can't support @Hidden because it is required (does not allow undefined and does not have a default value).");
      }
      return null;
    }
    if (type.dataType === 'array') {
      var arrayType = type;
      if (!this.supportPathDataType(arrayType.elementType)) {
        throw new exceptions_1.GenerateMetadataError("@Query('" + parameterName + "') Can't support array '" + arrayType.elementType.dataType + "' type.");
      }
      return __assign(__assign({}, commonProperties), { collectionFormat: 'multi', type: arrayType });
    }
    if (!this.supportPathDataType(type)) {
      throw new exceptions_1.GenerateMetadataError("@Query('" + parameterName + "') Can't support '" + type.dataType + "' type.");
    }
    return __assign(__assign({}, commonProperties), { type: type });
  };
  ParameterGenerator.prototype.getPathParameter = function (parameter) {
    var parameterName = parameter.name.text;
    var type = this.getValidatedType(parameter);
    var pathName =
      decoratorUtils_1.getNodeFirstDecoratorValue(this.parameter, this.current.typeChecker, function (ident) {
        return ident.text === 'Path';
      }) || parameterName;
    if (!this.supportPathDataType(type)) {
      throw new exceptions_1.GenerateMetadataError("@Path('" + parameterName + "') Can't support '" + type.dataType + "' type.");
    }
    if (!this.path.includes('{' + pathName + '}') && !this.path.includes(':' + pathName)) {
      throw new exceptions_1.GenerateMetadataError("@Path('" + parameterName + "') Can't match in URL: '" + this.path + "'.");
    }
    return {
      default: initializer_value_1.getInitializerValue(parameter.initializer, this.current.typeChecker, type),
      description: this.getParameterDescription(parameter),
      example: this.getParameterExample(parameter, parameterName),
      in: 'path',
      name: pathName,
      parameterName: parameterName,
      required: true,
      type: type,
      validators: validatorUtils_1.getParameterValidators(this.parameter, parameterName),
    };
  };
  ParameterGenerator.prototype.getParameterDescription = function (node) {
    var symbol = this.current.typeChecker.getSymbolAtLocation(node.name);
    if (!symbol) {
      return undefined;
    }
    var comments = symbol.getDocumentationComment(this.current.typeChecker);
    if (comments.length) {
      return ts.displayPartsToString(comments);
    }
    return undefined;
  };
  ParameterGenerator.prototype.getParameterExample = function (node, parameterName) {
    var examples = jsDocUtils_1
      .getJSDocTags(node.parent, function (tag) {
        return (tag.tagName.text === 'example' || tag.tagName.escapedText === 'example') && !!tag.comment && tag.comment.startsWith(parameterName);
      })
      .map(function (tag) {
        return (tag.comment || '').replace(parameterName + ' ', '').replace(/\r/g, '');
      });
    if (examples.length === 0) {
      return undefined;
    } else {
      try {
        return examples.map(function (example) {
          return JSON.parse(example);
        });
      } catch (e) {
        throw new exceptions_1.GenerateMetadataError('JSON format is incorrect: ' + e.message);
      }
    }
  };
  ParameterGenerator.prototype.supportBodyMethod = function (method) {
    return ['post', 'put', 'patch', 'delete'].some(function (m) {
      return m === method.toLowerCase();
    });
  };
  ParameterGenerator.prototype.supportParameterDecorator = function (decoratorName) {
    return ['header', 'query', 'path', 'body', 'bodyprop', 'request', 'res'].some(function (d) {
      return d === decoratorName.toLocaleLowerCase();
    });
  };
  ParameterGenerator.prototype.supportPathDataType = function (parameterType) {
    var _this = this;
    var supportedPathDataTypes = ['string', 'integer', 'long', 'float', 'double', 'date', 'datetime', 'buffer', 'boolean', 'enum', 'refEnum', 'any'];
    if (
      supportedPathDataTypes.find(function (t) {
        return t === parameterType.dataType;
      })
    ) {
      return true;
    }
    if (parameterType.dataType === 'refAlias') {
      return this.supportPathDataType(parameterType.type);
    }
    if (parameterType.dataType === 'union') {
      return !parameterType.types
        .map(function (t) {
          return _this.supportPathDataType(t);
        })
        .some(function (t) {
          return t === false;
        });
    }
    return false;
  };
  ParameterGenerator.prototype.getValidatedType = function (parameter) {
    var typeNode = parameter.type;
    if (!typeNode) {
      var type = this.current.typeChecker.getTypeAtLocation(parameter);
      typeNode = this.current.typeChecker.typeToTypeNode(type);
    }
    return new typeResolver_1.TypeResolver(typeNode, this.current, parameter).resolve();
  };
  ParameterGenerator.prototype.getQueryParamterIsHidden = function (parameter) {
    var hiddenDecorators = decoratorUtils_1.getDecorators(parameter, function (identifier) {
      return identifier.text === 'Hidden';
    });
    if (!hiddenDecorators || !hiddenDecorators.length) {
      return false;
    }
    if (hiddenDecorators.length > 1) {
      var parameterName = parameter.name.text;
      throw new exceptions_1.GenerateMetadataError("Only one Hidden decorator allowed on @Query('" + parameterName + "').");
    }
    return true;
  };
  return ParameterGenerator;
})();
exports.ParameterGenerator = ParameterGenerator;
//# sourceMappingURL=parameterGenerator.js.map
