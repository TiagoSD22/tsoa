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
var assertNever_1 = require('./../utils/assertNever');
var SpecGenerator = /** @class */ (function () {
  function SpecGenerator(metadata, config) {
    var _this = this;
    this.metadata = metadata;
    this.config = config;
    this.determineImplicitAdditionalPropertiesValue = function () {
      if (_this.config.noImplicitAdditionalProperties === 'silently-remove-extras') {
        return false;
      } else if (_this.config.noImplicitAdditionalProperties === 'throw-on-extras') {
        return false;
      } else if (_this.config.noImplicitAdditionalProperties === 'ignore') {
        return true;
      } else {
        return assertNever_1.assertNever(_this.config.noImplicitAdditionalProperties);
      }
    };
  }
  SpecGenerator.prototype.buildAdditionalProperties = function (type) {
    return this.getSwaggerType(type);
  };
  SpecGenerator.prototype.getOperationId = function (methodName) {
    return methodName.charAt(0).toUpperCase() + methodName.substr(1);
  };
  SpecGenerator.prototype.throwIfNotDataFormat = function (strToTest) {
    var guiltyUntilInnocent = strToTest;
    if (
      guiltyUntilInnocent === 'int32' ||
      guiltyUntilInnocent === 'int64' ||
      guiltyUntilInnocent === 'float' ||
      guiltyUntilInnocent === 'double' ||
      guiltyUntilInnocent === 'byte' ||
      guiltyUntilInnocent === 'binary' ||
      guiltyUntilInnocent === 'date' ||
      guiltyUntilInnocent === 'date-time' ||
      guiltyUntilInnocent === 'password'
    ) {
      return guiltyUntilInnocent;
    } else {
      return assertNever_1.assertNever(guiltyUntilInnocent);
    }
  };
  SpecGenerator.prototype.throwIfNotDataType = function (strToTest) {
    var guiltyUntilInnocent = strToTest;
    if (
      guiltyUntilInnocent === 'array' ||
      guiltyUntilInnocent === 'boolean' ||
      guiltyUntilInnocent === 'integer' ||
      guiltyUntilInnocent === 'number' ||
      guiltyUntilInnocent === 'object' ||
      guiltyUntilInnocent === 'string'
    ) {
      return guiltyUntilInnocent;
    } else {
      return assertNever_1.assertNever(guiltyUntilInnocent);
    }
  };
  SpecGenerator.prototype.getSwaggerType = function (type) {
    if (type.dataType === 'void') {
      return this.getSwaggerTypeForVoid(type.dataType);
    } else if (type.dataType === 'refEnum' || type.dataType === 'refObject' || type.dataType === 'refAlias') {
      return this.getSwaggerTypeForReferenceType(type);
    } else if (
      type.dataType === 'any' ||
      type.dataType === 'binary' ||
      type.dataType === 'boolean' ||
      type.dataType === 'buffer' ||
      type.dataType === 'byte' ||
      type.dataType === 'date' ||
      type.dataType === 'datetime' ||
      type.dataType === 'double' ||
      type.dataType === 'float' ||
      type.dataType === 'integer' ||
      type.dataType === 'long' ||
      type.dataType === 'object' ||
      type.dataType === 'string'
    ) {
      return this.getSwaggerTypeForPrimitiveType(type.dataType);
    } else if (type.dataType === 'array') {
      return this.getSwaggerTypeForArrayType(type);
    } else if (type.dataType === 'enum') {
      return this.getSwaggerTypeForEnumType(type);
    } else if (type.dataType === 'union') {
      return this.getSwaggerTypeForUnionType(type);
    } else if (type.dataType === 'intersection') {
      return this.getSwaggerTypeForIntersectionType(type);
    } else if (type.dataType === 'nestedObjectLiteral') {
      return this.getSwaggerTypeForObjectLiteral(type);
    } else {
      return assertNever_1.assertNever(type);
    }
  };
  SpecGenerator.prototype.getSwaggerTypeForObjectLiteral = function (objectLiteral) {
    var properties = this.buildProperties(objectLiteral.properties);
    var additionalProperties = objectLiteral.additionalProperties && this.getSwaggerType(objectLiteral.additionalProperties);
    var required = objectLiteral.properties
      .filter(function (prop) {
        return prop.required;
      })
      .map(function (prop) {
        return prop.name;
      });
    // An empty list required: [] is not valid.
    // If all properties are optional, do not specify the required keyword.
    return __assign(__assign(__assign({ properties: properties }, additionalProperties && { additionalProperties: additionalProperties }), required && required.length && { required: required }), {
      type: 'object',
    });
  };
  SpecGenerator.prototype.getSwaggerTypeForReferenceType = function (referenceType) {
    return {
      // Don't set additionalProperties value here since it will be set within the $ref's model when that $ref gets created
    };
  };
  SpecGenerator.prototype.getSwaggerTypeForVoid = function (dataType) {
    // Described here: https://swagger.io/docs/specification/describing-responses/#empty
    var voidSchema = {
      // isn't allowed to have additionalProperties at all (meaning not a boolean or object)
    };
    return voidSchema;
  };
  SpecGenerator.prototype.getSwaggerTypeForPrimitiveType = function (dataType) {
    if (dataType === 'object') {
      if (process.env.NODE_ENV !== 'tsoa_test') {
        // tslint:disable-next-line: no-console
        console.warn(
          'The type Object is discouraged. Please consider using an interface such as:\n          export interface IStringToStringDictionary {\n            [key: string]: string;\n          }\n          // or\n          export interface IRecordOfAny {\n            [key: string]: any;\n          }\n        ',
        );
      }
    }
    var map = {
      any: {
        // While the any type is discouraged, it does explicitly allows anything, so it should always allow additionalProperties
        additionalProperties: true,
      },
      binary: { type: 'string', format: 'binary' },
      boolean: { type: 'boolean' },
      buffer: { type: 'string', format: 'byte' },
      byte: { type: 'string', format: 'byte' },
      date: { type: 'string', format: 'date' },
      datetime: { type: 'string', format: 'date-time' },
      double: { type: 'number', format: 'double' },
      float: { type: 'number', format: 'float' },
      integer: { type: 'integer', format: 'int32' },
      long: { type: 'integer', format: 'int64' },
      object: {
        additionalProperties: this.determineImplicitAdditionalPropertiesValue(),
        type: 'object',
      },
      string: { type: 'string' },
    };
    return map[dataType];
  };
  SpecGenerator.prototype.getSwaggerTypeForArrayType = function (arrayType) {
    return {
      items: this.getSwaggerType(arrayType.elementType),
      type: 'array',
    };
  };
  SpecGenerator.prototype.determineTypesUsedInEnum = function (anEnum) {
    var typesUsedInEnum = anEnum.reduce(function (theSet, curr) {
      var typeUsed = curr === null ? 'number' : typeof curr;
      theSet.add(typeUsed);
      return theSet;
    }, new Set());
    return typesUsedInEnum;
  };
  return SpecGenerator;
})();
exports.SpecGenerator = SpecGenerator;
//# sourceMappingURL=specGenerator.js.map
