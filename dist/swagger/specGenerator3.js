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
Object.defineProperty(exports, '__esModule', { value: true });
var assertNever_1 = require('../utils/assertNever');
var isVoidType_1 = require('../utils/isVoidType');
var pathUtils_1 = require('./../utils/pathUtils');
var specGenerator_1 = require('./specGenerator');
/**
 * TODO:
 * Handle formData parameters
 * Handle requestBodies of type other than json
 * Handle requestBodies as reusable objects
 * Handle headers, examples, responses, etc.
 * Cleaner interface between SpecGenerator2 and SpecGenerator3
 * Also accept OpenAPI 3.0.0 metadata, like components/securitySchemes instead of securityDefinitions
 */
var SpecGenerator3 = /** @class */ (function (_super) {
  __extends(SpecGenerator3, _super);
  function SpecGenerator3(metadata, config) {
    var _this = _super.call(this, metadata, config) || this;
    _this.metadata = metadata;
    _this.config = config;
    return _this;
  }
  SpecGenerator3.prototype.GetSpec = function () {
    var spec = {
      components: this.buildComponents(),
      info: this.buildInfo(),
      openapi: '3.0.0',
      paths: this.buildPaths(),
      servers: this.buildServers(),
      tags: this.config.tags,
    };
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
    return spec;
  };
  SpecGenerator3.prototype.buildInfo = function () {
    var info = {
      title: this.config.name || '',
    };
    if (this.config.version) {
      info.version = this.config.version;
    }
    if (this.config.description) {
      info.description = this.config.description;
    }
    if (this.config.license) {
      info.license = { name: this.config.license };
    }
    if (this.config.contact) {
      info.contact = this.config.contact;
    }
    return info;
  };
  SpecGenerator3.prototype.buildComponents = function () {
    var components = {
      examples: {},
      headers: {},
      parameters: {},
      requestBodies: {},
      responses: {},
      schemas: this.buildSchema(),
      securitySchemes: {},
    };
    if (this.config.securityDefinitions) {
      components.securitySchemes = this.translateSecurityDefinitions(this.config.securityDefinitions);
    }
    return components;
  };
  SpecGenerator3.prototype.translateSecurityDefinitions = function (definitions) {
    var _this = this;
    var defs = {};
    Object.keys(definitions).forEach(function (key) {
      if (definitions[key].type === 'basic') {
        defs[key] = {
          scheme: 'basic',
          type: 'http',
        };
      } else if (definitions[key].type === 'oauth2') {
        var definition = definitions[key];
        var oauth = defs[key] || {
          type: 'oauth2',
          description: definitions[key].description,
          flows: (_this.hasOAuthFlows(definition) && definition.flows) || {},
        };
        if (_this.hasOAuthFlow(definition) && definition.flow === 'password') {
          oauth.flows.password = { tokenUrl: definition.tokenUrl, scopes: definition.scopes || {} };
        } else if (_this.hasOAuthFlow(definition) && definition.flow === 'accessCode') {
          oauth.flows.authorizationCode = { tokenUrl: definition.tokenUrl, authorizationUrl: definition.authorizationUrl, scopes: definition.scopes || {} };
        } else if (_this.hasOAuthFlow(definition) && definition.flow === 'application') {
          oauth.flows.clientCredentials = { tokenUrl: definition.tokenUrl, scopes: definition.scopes || {} };
        } else if (_this.hasOAuthFlow(definition) && definition.flow === 'implicit') {
          oauth.flows.implicit = { authorizationUrl: definition.authorizationUrl, scopes: definition.scopes || {} };
        }
        defs[key] = oauth;
      } else {
        defs[key] = definitions[key];
      }
    });
    return defs;
  };
  SpecGenerator3.prototype.hasOAuthFlow = function (definition) {
    return !!definition.flow;
  };
  SpecGenerator3.prototype.hasOAuthFlows = function (definition) {
    return !!definition.flows;
  };
  SpecGenerator3.prototype.buildServers = function () {
    var basePath = pathUtils_1.normalisePath(this.config.basePath, '/', undefined, false);
    var scheme = this.config.schemes ? this.config.schemes[0] : 'https';
    var url = this.config.host ? scheme + '://' + this.config.host + basePath : basePath;
    return [
      {
        url: url,
      },
    ];
  };
  SpecGenerator3.prototype.buildSchema = function () {
    var _this = this;
    var schema = {};
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
        schema[referenceType.refName] = {
          description: referenceType.description,
          properties: _this.buildProperties(referenceType.properties),
          required: required && required.length > 0 ? Array.from(new Set(required)) : undefined,
          type: 'object',
        };
        if (referenceType.additionalProperties) {
          schema[referenceType.refName].additionalProperties = _this.buildAdditionalProperties(referenceType.additionalProperties);
        } else {
          // Since additionalProperties was not explicitly set in the TypeScript interface for this model
          //      ...we need to make a decision
          schema[referenceType.refName].additionalProperties = _this.determineImplicitAdditionalPropertiesValue();
        }
        if (referenceType.example) {
          schema[referenceType.refName].example = referenceType.example;
        }
      } else if (referenceType.dataType === 'refEnum') {
        var enumTypes = _this.determineTypesUsedInEnum(referenceType.enums);
        if (enumTypes.size === 1) {
          schema[referenceType.refName] = {
            description: referenceType.description,
            enum: referenceType.enums,
            type: enumTypes.has('string') ? 'string' : 'number',
          };
        } else {
          schema[referenceType.refName] = {
            description: referenceType.description,
            anyOf: [
              {
                type: 'number',
                enum: referenceType.enums.filter(function (e) {
                  return typeof e === 'number';
                }),
              },
              {
                type: 'string',
                enum: referenceType.enums.filter(function (e) {
                  return typeof e === 'string';
                }),
              },
            ],
          };
        }
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
        schema[referenceType.refName] = __assign(
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
    return schema;
  };
  SpecGenerator3.prototype.buildPaths = function () {
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
  SpecGenerator3.prototype.buildMethod = function (controllerName, method, pathObject) {
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
    var bodyParams = method.parameters.filter(function (p) {
      return p.in === 'body';
    });
    var bodyPropParams = method.parameters.filter(function (p) {
      return p.in === 'body-prop';
    });
    pathMethod.parameters = method.parameters
      .filter(function (p) {
        return ['body', 'formData', 'request', 'body-prop', 'res'].indexOf(p.in) === -1;
      })
      .map(function (p) {
        return _this.buildParameter(p);
      });
    if (bodyParams.length > 1) {
      throw new Error('Only one body parameter allowed per controller method.');
    }
    if (bodyParams.length > 0) {
      pathMethod.requestBody = this.buildRequestBody(controllerName, method, bodyParams[0]);
    } else if (bodyPropParams.length > 0) {
      pathMethod.requestBody = this.buildRequestBodyUsingBodyProps(controllerName, method);
    }
    method.extensions.forEach(function (ext) {
      return (pathMethod[ext.key] = ext.value);
    });
  };
  SpecGenerator3.prototype.buildOperation = function (controllerName, method) {
    var _this = this;
    var swaggerResponses = {};
    method.responses.forEach(function (res) {
      swaggerResponses[res.name] = {
        description: res.description,
      };
      if (res.schema && !isVoidType_1.isVoidType(res.schema)) {
        swaggerResponses[res.name].content = {
          'application/json': {
            schema: _this.getSwaggerType(res.schema),
          },
        };
      }
      if (res.examples) {
        var examples = res.examples.reduce(function (acc, ex, currentIndex) {
          var _a;
          return __assign(__assign({}, acc), ((_a = {}), (_a['Example ' + (currentIndex + 1)] = { value: ex }), _a));
        }, {});
        /* tslint:disable:no-string-literal */
        (swaggerResponses[res.name].content || {})['application/json']['examples'] = examples;
      }
    });
    return {
      operationId: this.getOperationId(method.name),
      responses: swaggerResponses,
    };
  };
  SpecGenerator3.prototype.buildRequestBody = function (controllerName, method, parameter) {
    var validators = Object.keys(parameter.validators)
      .filter(function (key) {
        return !key.startsWith('is') && key !== 'minDate' && key !== 'maxDate';
      })
      .reduce(function (acc, key) {
        var _a;
        return __assign(__assign({}, acc), ((_a = {}), (_a[key] = validators[key].value), _a));
      }, {});
    var mediaType = {
      schema: __assign(__assign({}, this.getSwaggerType(parameter.type)), validators),
    };
    var parameterExamples = parameter.example;
    if (parameterExamples === undefined) {
      mediaType.example = parameterExamples;
    } else if (parameterExamples.length === 1) {
      mediaType.example = parameterExamples[0];
    } else {
      mediaType.examples = {};
      parameterExamples.forEach(function (example, index) {
        var _a;
        return Object.assign(mediaType.examples, ((_a = {}), (_a['Example ' + (index + 1)] = { value: example }), _a));
      });
    }
    var requestBody = {
      description: parameter.description,
      required: parameter.required,
      content: {
        'application/json': mediaType,
      },
    };
    return requestBody;
  };
  SpecGenerator3.prototype.buildRequestBodyUsingBodyProps = function (controllerName, method) {
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
        if (p.required) {
          required.push(p.name);
        }
      });
    if (!Object.keys(properties).length) {
      return undefined;
    }
    var schema = { type: 'object', properties: properties, required: required };
    return {
      required: required.length > 0,
      content: {
        'application/json': { schema: schema },
      },
    };
  };
  SpecGenerator3.prototype.buildParameter = function (source) {
    var parameter = {
      description: source.description,
      in: source.in,
      name: source.name,
      required: source.required,
      schema: {
        default: source.default,
        format: undefined,
      },
    };
    var parameterType = this.getSwaggerType(source.type);
    if (parameterType.format) {
      parameter.schema.format = this.throwIfNotDataFormat(parameterType.format);
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
    if (source.type.dataType === 'any') {
      parameter.schema.type = 'string';
    } else {
      if (parameterType.type) {
        parameter.schema.type = this.throwIfNotDataType(parameterType.type);
      }
      parameter.schema.items = parameterType.items;
      parameter.schema.enum = parameterType.enum;
    }
    parameter.schema = Object.assign({}, parameter.schema, validatorObjs);
    var parameterExamples = source.example;
    if (parameterExamples === undefined) {
      parameter.example = parameterExamples;
    } else if (parameterExamples.length === 1) {
      parameter.example = parameterExamples[0];
    } else {
      parameter.examples = {};
      parameterExamples.forEach(function (example, index) {
        var _a;
        return Object.assign(parameter.examples, ((_a = {}), (_a['Example ' + (index + 1)] = { value: example }), _a));
      });
    }
    return parameter;
  };
  SpecGenerator3.prototype.buildProperties = function (source) {
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
  SpecGenerator3.prototype.getSwaggerTypeForReferenceType = function (referenceType) {
    return { $ref: '#/components/schemas/' + referenceType.refName };
  };
  SpecGenerator3.prototype.getSwaggerTypeForPrimitiveType = function (dataType) {
    if (dataType === 'any') {
      // Setting additionalProperties causes issues with code generators for OpenAPI 3
      // Therefore, we avoid setting it explicitly (since it's the implicit default already)
      return {};
    }
    return _super.prototype.getSwaggerTypeForPrimitiveType.call(this, dataType);
  };
  SpecGenerator3.prototype.getSwaggerTypeForUnionType = function (type) {
    var _this = this;
    // use nullable: true to represent simple unions with null. This converts to
    // a better type when using code generation in a client.
    if (
      type.types.length === 2 &&
      type.types.find(function (typeInUnion) {
        return typeInUnion.dataType === 'enum' && typeInUnion.enums.includes(null);
      })
    ) {
      var nullEnumIndex = type.types.findIndex(function (type) {
        return type.dataType === 'enum' && type.enums.includes(null);
      });
      var typeIndex = nullEnumIndex === 1 ? 0 : 1;
      var swaggerType = this.getSwaggerType(type.types[typeIndex]);
      var isRef = !!swaggerType.$ref;
      // let special case of ref union with null fall through to be handled as a
      // anyOf. Example of this case is:
      // type Nullable<T> = T | null;
      // type MyNullableType = Nullable<OtherType>;
      //
      // this is required because other members of $ref containing objects are
      // ignored so the null would otherwise get left out:
      // https://swagger.io/docs/specification/using-ref/#syntax
      if (!isRef) {
        swaggerType['nullable'] = true;
        return swaggerType;
      }
    }
    return {
      anyOf: type.types.map(function (x) {
        return _this.getSwaggerType(x);
      }),
    };
  };
  SpecGenerator3.prototype.getSwaggerTypeForIntersectionType = function (type) {
    var _this = this;
    return {
      allOf: type.types.map(function (x) {
        return _this.getSwaggerType(x);
      }),
    };
  };
  SpecGenerator3.prototype.getSwaggerTypeForEnumType = function (enumType) {
    var types = this.determineTypesUsedInEnum(enumType.enums);
    if (types.size === 1) {
      var type = types.values().next().value;
      var nullable = enumType.enums.includes(null) ? true : false;
      return {
        type: type,
        enum: enumType.enums.map(function (member) {
          return member === null ? null : String(member);
        }),
        nullable: nullable,
      };
    } else {
      var valuesDelimited = Array.from(types).join(',');
      throw new Error('Enums can only have string or number values, but enum had ' + valuesDelimited);
    }
  };
  return SpecGenerator3;
})(specGenerator_1.SpecGenerator);
exports.SpecGenerator3 = SpecGenerator3;
//# sourceMappingURL=specGenerator3.js.map
