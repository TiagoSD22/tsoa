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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (((f = 1), y && (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)) return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
var fs = require('fs');
var handlebars = require('handlebars');
var path = require('path');
var tsfmt = require('typescript-formatter');
var assertNever_1 = require('../utils/assertNever');
var fs_1 = require('../utils/fs');
var internalTypeGuards_1 = require('../utils/internalTypeGuards');
var pathUtils_1 = require('./../utils/pathUtils');
var RouteGenerator = /** @class */ (function () {
  function RouteGenerator(metadata, options) {
    this.metadata = metadata;
    this.options = options;
    this.tsfmtConfig = {
      editorconfig: true,
      replace: true,
      tsconfig: {
        newLine: 'LF',
      },
      tsfmt: true,
      tslint: false,
      verify: true,
      vscode: true,
    };
  }
  RouteGenerator.prototype.GenerateRoutes = function (middlewareTemplate, pathTransformer) {
    return __awaiter(this, void 0, void 0, function () {
      var fileName, content, formatted;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!fs.lstatSync(this.options.routesDir).isDirectory()) {
              throw new Error('routesDir should be a directory');
            } else if (this.options.routesFileName !== undefined && !this.options.routesFileName.endsWith('.ts')) {
              throw new Error("routesFileName should have a '.ts' extension");
            }
            fileName = this.options.routesDir + '/' + (this.options.routesFileName || 'routes.ts');
            content = this.buildContent(middlewareTemplate, pathTransformer);
            return [4 /*yield*/, tsfmt.processString(fileName, content, this.tsfmtConfig)];
          case 1:
            formatted = _a.sent();
            return [4 /*yield*/, fs_1.fsWriteFile(fileName, formatted.dest)];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  RouteGenerator.prototype.GenerateCustomRoutes = function (template, pathTransformer) {
    return __awaiter(this, void 0, void 0, function () {
      var data, file;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, fs_1.fsReadFile(path.join(template))];
          case 1:
            data = _a.sent();
            file = data.toString();
            return [4 /*yield*/, this.GenerateRoutes(file, pathTransformer)];
          case 2:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  RouteGenerator.prototype.buildContent = function (middlewareTemplate, pathTransformer) {
    var _this = this;
    handlebars.registerHelper('json', function (context) {
      return JSON.stringify(context);
    });
    var additionalPropsHelper = function (additionalProperties) {
      if (additionalProperties) {
        // Then the model for this type explicitly allows additional properties and thus we should assign that
        return JSON.stringify(additionalProperties);
      } else if (_this.options.noImplicitAdditionalProperties === 'silently-remove-extras') {
        return JSON.stringify(false);
      } else if (_this.options.noImplicitAdditionalProperties === 'throw-on-extras') {
        return JSON.stringify(false);
      } else if (_this.options.noImplicitAdditionalProperties === 'ignore') {
        return JSON.stringify(true);
      } else {
        return assertNever_1.assertNever(_this.options.noImplicitAdditionalProperties);
      }
    };
    handlebars.registerHelper('additionalPropsHelper', additionalPropsHelper);
    var routesTemplate = handlebars.compile(middlewareTemplate, { noEscape: true });
    var authenticationModule = this.options.authenticationModule ? this.getRelativeImportPath(this.options.authenticationModule) : undefined;
    var iocModule = this.options.iocModule ? this.getRelativeImportPath(this.options.iocModule) : undefined;
    // If we're working locally then tsoa won't exist as an importable module.
    // So, when in testing mode we reference the module by path instead.
    var env = process.env.NODE_ENV;
    var canImportByAlias = true;
    if (env === 'tsoa_test') {
      canImportByAlias = false;
    }
    var normalisedBasePath = pathUtils_1.normalisePath(this.options.basePath, '/');
    return routesTemplate({
      authenticationModule: authenticationModule,
      basePath: normalisedBasePath,
      canImportByAlias: canImportByAlias,
      controllers: this.metadata.controllers.map(function (controller) {
        var normalisedControllerPath = pathUtils_1.normalisePath(controller.path, '/');
        return {
          actions: controller.methods.map(function (method) {
            var parameterObjs = {};
            method.parameters.forEach(function (parameter) {
              parameterObjs[parameter.parameterName] = _this.buildParameterSchema(parameter);
            });
            var normalisedMethodPath = pathTransformer(pathUtils_1.normalisePath(method.path, '/'));
            var normalisedFullPath = pathUtils_1.normalisePath('' + normalisedBasePath + normalisedControllerPath + normalisedMethodPath, '/', '', false);
            return {
              fullPath: normalisedFullPath,
              method: method.method.toLowerCase(),
              name: method.name,
              parameters: parameterObjs,
              path: normalisedMethodPath,
              security: method.security,
            };
          }),
          modulePath: _this.getRelativeImportPath(controller.location),
          name: controller.name,
          path: normalisedControllerPath,
        };
      }),
      environment: process.env,
      iocModule: iocModule,
      minimalSwaggerConfig: { noImplicitAdditionalProperties: this.options.noImplicitAdditionalProperties },
      models: this.buildModels(),
      useSecurity: this.metadata.controllers.some(function (controller) {
        return controller.methods.some(function (method) {
          return !!method.security.length;
        });
      }),
    });
  };
  RouteGenerator.prototype.buildModels = function () {
    var _this = this;
    var models = {};
    Object.keys(this.metadata.referenceTypeMap).forEach(function (name) {
      var referenceType = _this.metadata.referenceTypeMap[name];
      var model;
      if (referenceType.dataType === 'refEnum') {
        var refEnumModel = {
          dataType: 'refEnum',
          enums: referenceType.enums,
        };
        model = refEnumModel;
      } else if (referenceType.dataType === 'refObject') {
        var propertySchemaDictionary_1 = {};
        referenceType.properties.forEach(function (property) {
          propertySchemaDictionary_1[property.name] = _this.buildPropertySchema(property);
        });
        var refObjModel = {
          dataType: 'refObject',
          properties: propertySchemaDictionary_1,
        };
        if (referenceType.additionalProperties) {
          refObjModel.additionalProperties = _this.buildProperty(referenceType.additionalProperties);
        } else if (_this.options.noImplicitAdditionalProperties !== 'ignore') {
          refObjModel.additionalProperties = false;
        } else {
          // Since Swagger allows "excess properties" (to use a TypeScript term) by default
          refObjModel.additionalProperties = true;
        }
        model = refObjModel;
      } else if (referenceType.dataType === 'refAlias') {
        var refType = {
          dataType: 'refAlias',
          type: __assign(__assign({}, _this.buildProperty(referenceType.type)), { validators: referenceType.validators, default: referenceType.default }),
        };
        model = refType;
      } else {
        model = assertNever_1.assertNever(referenceType);
      }
      models[name] = model;
    });
    return models;
  };
  RouteGenerator.prototype.getRelativeImportPath = function (fileLocation) {
    fileLocation = fileLocation.replace('.ts', ''); // no ts extension in import
    return './' + path.relative(this.options.routesDir, fileLocation).replace(/\\/g, '/');
  };
  RouteGenerator.prototype.buildPropertySchema = function (source) {
    var propertySchema = this.buildProperty(source.type);
    propertySchema.default = source.default;
    propertySchema.required = source.required ? true : undefined;
    if (Object.keys(source.validators).length > 0) {
      propertySchema.validators = source.validators;
    }
    return propertySchema;
  };
  RouteGenerator.prototype.buildParameterSchema = function (source) {
    var property = this.buildProperty(source.type);
    var parameter = {
      default: source.default,
      in: source.in,
      name: source.name,
      required: source.required ? true : undefined,
    };
    var parameterSchema = Object.assign(parameter, property);
    if (Object.keys(source.validators).length > 0) {
      parameterSchema.validators = source.validators;
    }
    return parameterSchema;
  };
  RouteGenerator.prototype.buildProperty = function (type) {
    var _this = this;
    var schema = {
      dataType: type.dataType,
    };
    if (internalTypeGuards_1.isRefType(type)) {
      schema.dataType = undefined;
      schema.ref = type.refName;
    }
    if (type.dataType === 'array') {
      var arrayType = type;
      if (internalTypeGuards_1.isRefType(arrayType.elementType)) {
        switch (arrayType.elementType.dataType) {
          case 'refObject': {
            schema.array = {
              ref: arrayType.elementType.refName,
            };
            break;
          }
          case 'refEnum': {
            schema.array = {
              dataType: arrayType.elementType.dataType,
              enums: arrayType.elementType.enums,
            };
            break;
          }
          case 'refAlias': {
            schema.array = {
              dataType: arrayType.elementType.dataType,
              ref: arrayType.elementType.refName,
            };
            break;
          }
          default:
            assertNever_1.assertNever(arrayType.elementType);
        }
      } else {
        schema.array = this.buildProperty(arrayType.elementType);
      }
    }
    if (type.dataType === 'enum') {
      schema.enums = type.enums;
    }
    if (type.dataType === 'union' || type.dataType === 'intersection') {
      schema.subSchemas = type.types.map(function (type) {
        return _this.buildProperty(type);
      });
    }
    if (type.dataType === 'nestedObjectLiteral') {
      var objLiteral = type;
      schema.nestedProperties = objLiteral.properties.reduce(function (acc, prop) {
        var _a;
        return __assign(__assign({}, acc), ((_a = {}), (_a[prop.name] = _this.buildPropertySchema(prop)), _a));
      }, {});
      schema.additionalProperties = objLiteral.additionalProperties && this.buildProperty(objLiteral.additionalProperties);
    }
    return schema;
  };
  return RouteGenerator;
})();
exports.RouteGenerator = RouteGenerator;
//# sourceMappingURL=routeGenerator.js.map
