'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
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
var __spread =
  (this && this.__spread) ||
  function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var assertNever_1 = require('../utils/assertNever');
var isVoidType_1 = require('../utils/isVoidType');
var pathUtils_1 = require('./../utils/pathUtils');
var specGenerator_1 = require('./specGenerator');
var SpecGenerator2 = /** @class */ (function (_super) {
  __extends(SpecGenerator2, _super);
  function SpecGenerator2(metadata, config) {
    var _this = _super.call(this, metadata, config) || this;
    _this.metadata = metadata;
    _this.config = config;
    return _this;
  }
  SpecGenerator2.prototype.GetSpec = function () {
    var spec = {
      basePath: pathUtils_1.normalisePath(this.config.basePath, '/', undefined, false),
      consumes: ['application/json'],
      definitions: this.buildDefinitions(),
      info: {
        title: '',
      },
      paths: this.buildPaths(),
      produces: ['application/json'],
      swagger: '2.0',
    };
    spec.securityDefinitions = this.config.securityDefinitions ? this.config.securityDefinitions : {};
    if (this.config.name) {
      spec.info.title = this.config.name;
    }
    if (this.config.version) {
      spec.info.version = this.config.version;
    }
    if (this.config.host) {
      spec.host = this.config.host;
    }
    if (this.config.description) {
      spec.info.description = this.config.description;
    }
    if (this.config.tags) {
      spec.tags = this.config.tags;
    }
    if (this.config.license) {
      spec.info.license = { name: this.config.license };
    }
    if (this.config.contact) {
      spec.info.contact = this.config.contact;
    }
    if (this.config.spec) {
      this.config.specMerging = this.config.specMerging || 'immediate';
      var mergeFuncs = {
        immediate: Object.assign,
        recursive: require('merge').recursive,
        deepmerge: function (spec, merge) {
          return require('deepmerge').all([spec, merge]);
        },
      };
      spec = mergeFuncs[this.config.specMerging](spec, this.config.spec);
    }
    if (this.config.schemes) {
      spec.schemes = this.config.schemes;
    }
    return spec;
  };
  SpecGenerator2.prototype.buildDefinitions = function () {
    var _this = this;
    var definitions = {};
    Object.keys(this.metadata.referenceTypeMap).map(function (typeName) {
      var referenceType = _this.metadata.referenceTypeMap[typeName];
      if (referenceType.dataType === 'refObject') {
        var required = referenceType.properties
          .filter(function (p) {
            return p.required;
          })
          .map(function (p) {
            return p.name;
          });
        definitions[referenceType.refName] = {
          description: referenceType.description,
          properties: _this.buildProperties(referenceType.properties),
          required: required && required.length > 0 ? Array.from(new Set(required)) : undefined,
          type: 'object',
        };
        if (referenceType.additionalProperties) {
          definitions[referenceType.refName].additionalProperties = _this.buildAdditionalProperties(referenceType.additionalProperties);
        } else {
          // Since additionalProperties was not explicitly set in the TypeScript interface for this model
          //      ...we need to make a decision
          definitions[referenceType.refName].additionalProperties = _this.determineImplicitAdditionalPropertiesValue();
        }
        if (referenceType.example) {
          definitions[referenceType.refName].example = referenceType.example;
        }
      } else if (referenceType.dataType === 'refEnum') {
        definitions[referenceType.refName] = {
          description: referenceType.description,
          enum: referenceType.enums,
          type: _this.decideEnumType(referenceType.enums, referenceType.refName),
        };
      } else if (referenceType.dataType === 'refAlias') {
        var swaggerType = _this.getSwaggerType(referenceType.type);
        var format = referenceType.format;
        var validators = Object.keys(referenceType.validators)
          .filter(function (key) {
            return !key.startsWith('is') && key !== 'minDate' && key !== 'maxDate';
          })
          .reduce(function (acc, key) {
            var _a;
            return __assign(__assign({}, acc), ((_a = {}), (_a[key] = referenceType.validators[key].value), _a));
          }, {});
        definitions[referenceType.refName] = __assign(
          __assign(__assign({}, swaggerType), {
            default: referenceType.default || swaggerType.default,
            example: referenceType.example,
            format: format || swaggerType.format,
            description: referenceType.description,
          }),
          validators,
        );
      } else {
        assertNever_1.assertNever(referenceType);
      }
    });
    return definitions;
  };
  SpecGenerator2.prototype.buildPaths = function () {
    var _this = this;
    var paths = {};
    this.metadata.controllers.forEach(function (controller) {
      var normalisedControllerPath = pathUtils_1.normalisePath(controller.path, '/');
      // construct documentation using all methods except @Hidden
      controller.methods
        .filter(function (method) {
          return !method.isHidden;
        })
        .forEach(function (method) {
          var normalisedMethodPath = pathUtils_1.normalisePath(method.path, '/');
          var path = pathUtils_1.normalisePath('' + normalisedControllerPath + normalisedMethodPath, '/', '', false);
          path = pathUtils_1.convertColonPathParams(path);
          paths[path] = paths[path] || {};
          _this.buildMethod(controller.name, method, paths[path]);
        });
    });
    return paths;
  };
  SpecGenerator2.prototype.buildMethod = function (controllerName, method, pathObject) {
    var _this = this;
    var pathMethod = (pathObject[method.method] = this.buildOperation(controllerName, method));
    pathMethod.description = method.description;
    pathMethod.summary = method.summary;
    pathMethod.tags = method.tags;
    // Use operationId tag otherwise fallback to generated. Warning: This doesn't check uniqueness.
    pathMethod.operationId = method.operationId || pathMethod.operationId;
    if (method.deprecated) {
      pathMethod.deprecated = method.deprecated;
    }
    if (method.security) {
      pathMethod.security = method.security;
    }
    pathMethod.parameters = method.parameters
      .filter(function (p) {
        return !(p.in === 'request' || p.in === 'body-prop' || p.in === 'res');
      })
      .map(function (p) {
        return _this.buildParameter(p);
      });
    var bodyPropParameter = this.buildBodyPropParameter(controllerName, method);
    if (bodyPropParameter) {
      pathMethod.parameters.push(bodyPropParameter);
    }
    if (
      pathMethod.parameters.filter(function (p) {
        return p.in === 'body';
      }).length > 1
    ) {
      throw new Error('Only one body parameter allowed per controller method.');
    }
    method.extensions.forEach(function (ext) {
      return (pathMethod[ext.key] = ext.value);
    });
  };
  SpecGenerator2.prototype.buildOperation = function (controllerName, method) {
    var _this = this;
    var swaggerResponses = {};
    method.responses.forEach(function (res) {
      swaggerResponses[res.name] = {
        description: res.description,
      };
      if (res.schema && !isVoidType_1.isVoidType(res.schema)) {
        swaggerResponses[res.name].schema = _this.getSwaggerType(res.schema);
      }
      if (res.examples && res.examples[0]) {
        swaggerResponses[res.name].examples = { 'application/json': res.examples[0] };
      }
    });
    return {
      operationId: this.getOperationId(method.name),
      produces: ['application/json'],
      responses: swaggerResponses,
    };
  };
  SpecGenerator2.prototype.buildBodyPropParameter = function (controllerName, method) {
    var _this = this;
    var properties = {};
    var required = [];
    method.parameters
      .filter(function (p) {
        return p.in === 'body-prop';
      })
      .forEach(function (p) {
        properties[p.name] = _this.getSwaggerType(p.type);
        properties[p.name].default = p.default;
        properties[p.name].description = p.description;
        properties[p.name].example = p.example === undefined ? undefined : p.example[0];
        if (p.required) {
          required.push(p.name);
        }
      });
    if (!Object.keys(properties).length) {
      return;
    }
    var parameter = {
      in: 'body',
      name: 'body',
      schema: {
        properties: properties,
        title: this.getOperationId(method.name) + 'Body',
        type: 'object',
      },
    };
    if (required.length) {
      parameter.schema.required = required;
    }
    return parameter;
  };
  SpecGenerator2.prototype.buildParameter = function (source) {
    var parameter = {
      default: source.default,
      description: source.description,
      in: source.in,
      name: source.name,
      required: source.required,
    };
    var type = source.type;
    if (source.in !== 'body' && source.type.dataType === 'refEnum') {
      // swagger does not support referencing enums
      // (exept for body parameters), so we have to inline it
      type = {
        dataType: 'enum',
        enums: source.type.enums,
      };
    }
    var parameterType = this.getSwaggerType(type);
    if (parameterType.format) {
      parameter.format = this.throwIfNotDataFormat(parameterType.format);
    }
    if (parameter.in === 'query' && parameterType.type === 'array') {
      parameter.collectionFormat = 'multi';
    }
    if (parameterType.$ref) {
      parameter.schema = parameterType;
      return parameter;
    }
    var validatorObjs = {};
    Object.keys(source.validators)
      .filter(function (key) {
        return !key.startsWith('is') && key !== 'minDate' && key !== 'maxDate';
      })
      .forEach(function (key) {
        validatorObjs[key] = source.validators[key].value;
      });
    if (source.in === 'body' && source.type.dataType === 'array') {
      parameter.schema = {
        items: parameterType.items,
        type: 'array',
      };
    } else {
      if (source.type.dataType === 'any') {
        if (source.in === 'body') {
          parameter.schema = { type: 'object' };
        } else {
          parameter.type = 'string';
        }
      } else {
        if (parameterType.type) {
          parameter.type = this.throwIfNotDataType(parameterType.type);
        }
        parameter.items = parameterType.items;
        parameter.enum = parameterType.enum;
      }
    }
    if (parameter.schema) {
      parameter.schema = Object.assign({}, parameter.schema, validatorObjs);
    } else {
      parameter = Object.assign({}, parameter, validatorObjs);
    }
    return parameter;
  };
  SpecGenerator2.prototype.buildProperties = function (source) {
    var _this = this;
    var properties = {};
    source.forEach(function (property) {
      var swaggerType = _this.getSwaggerType(property.type);
      var format = property.format;
      swaggerType.description = property.description;
      swaggerType.example = property.example;
      swaggerType.format = format || swaggerType.format;
      if (!swaggerType.$ref) {
        swaggerType.default = property.default;
        Object.keys(property.validators)
          .filter(function (key) {
            return !key.startsWith('is') && key !== 'minDate' && key !== 'maxDate';
          })
          .forEach(function (key) {
            swaggerType[key] = property.validators[key].value;
          });
      }
      properties[property.name] = swaggerType;
    });
    return properties;
  };
  SpecGenerator2.prototype.getSwaggerTypeForUnionType = function (type) {
    // Backwards compatible representation of a literal enumeration
    if (
      type.types.every(function (subType) {
        return subType.dataType === 'enum';
      })
    ) {
      var mergedEnum_1 = { dataType: 'enum', enums: [] };
      type.types.forEach(function (t) {
        mergedEnum_1.enums = __spread(mergedEnum_1.enums, t.enums);
      });
      return this.getSwaggerTypeForEnumType(mergedEnum_1);
    } else if (
      type.types.length === 2 &&
      type.types.find(function (typeInUnion) {
        return typeInUnion.dataType === 'enum' && typeInUnion.enums.includes(null);
      })
    ) {
      // Backwards compatible representation of dataType or null, $ref does not allow any sibling attributes, so we have to bail out
      var nullEnumIndex = type.types.findIndex(function (type) {
        return type.dataType === 'enum' && type.enums.includes(null);
      });
      var typeIndex = nullEnumIndex === 1 ? 0 : 1;
      var swaggerType = this.getSwaggerType(type.types[typeIndex]);
      var isRef = !!swaggerType.$ref;
      if (isRef) {
        return { type: 'object' };
      } else {
        swaggerType['x-nullable'] = true;
        return swaggerType;
      }
    } else if (process.env.NODE_ENV !== 'tsoa_test') {
      // tslint:disable-next-line: no-console
      console.warn('Swagger 2.0 does not support union types beyond string literals.\n' + 'If you would like to take advantage of this, please change tsoa.json\'s "specVersion" to 3.');
    }
    return { type: 'object' };
  };
  SpecGenerator2.prototype.getSwaggerTypeForIntersectionType = function (type) {
    var _this = this;
    var properties = type.types.reduce(function (acc, type) {
      if (type.dataType === 'refObject') {
        var refType = type;
        refType = _this.metadata.referenceTypeMap[refType.refName];
        var props =
          refType &&
          refType.properties &&
          refType.properties.reduce(function (acc, prop) {
            var _a;
            return __assign(__assign({}, acc), ((_a = {}), (_a[prop.name] = _this.getSwaggerType(prop.type)), _a));
          }, {});
        return __assign(__assign({}, acc), props);
      } else {
        process.env.NODE_ENV !== 'tsoa_test' &&
          // tslint:disable-next-line: no-console
          console.warn('Swagger 2.0 does not fully support this kind of intersection types. If you would like to take advantage of this, please change tsoa.json\'s "specVersion" to 3.');
        return __assign({}, acc);
      }
    }, {});
    return { type: 'object', properties: properties };
  };
  SpecGenerator2.prototype.getSwaggerTypeForReferenceType = function (referenceType) {
    return { $ref: '#/definitions/' + referenceType.refName };
  };
  SpecGenerator2.prototype.decideEnumType = function (anEnum, nameOfEnum) {
    var typesUsedInEnum = this.determineTypesUsedInEnum(anEnum);
    var badEnumErrorMessage = function () {
      var valuesDelimited = Array.from(typesUsedInEnum).join(',');
      return 'Enums can only have string or number values, but enum ' + nameOfEnum + ' had ' + valuesDelimited;
    };
    var enumTypeForSwagger;
    if (typesUsedInEnum.has('string') && typesUsedInEnum.size === 1) {
      enumTypeForSwagger = 'string';
    } else if (typesUsedInEnum.has('number') && typesUsedInEnum.size === 1) {
      enumTypeForSwagger = 'number';
    } else {
      throw new Error(badEnumErrorMessage());
    }
    return enumTypeForSwagger;
  };
  SpecGenerator2.prototype.getSwaggerTypeForEnumType = function (enumType) {
    var _a;
    var types = this.determineTypesUsedInEnum(enumType.enums);
    var type = types.size === 1 ? types.values().next().value : 'string';
    var nullable = enumType.enums.includes(null) ? true : false;
    return (
      (_a = {
        type: type,
        enum: enumType.enums.map(function (member) {
          return String(member);
        }),
      }),
      (_a['x-nullable'] = nullable),
      _a
    );
  };
  return SpecGenerator2;
})(specGenerator_1.SpecGenerator);
exports.SpecGenerator2 = SpecGenerator2;
//# sourceMappingURL=specGenerator2.js.map
