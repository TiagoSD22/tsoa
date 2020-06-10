#!/usr/bin/env node
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
var path = require('path');
var YAML = require('yamljs');
var yargs = require('yargs');
var metadataGenerator_1 = require('./metadataGeneration/metadataGenerator');
var generate_routes_1 = require('./module/generate-routes');
var generate_spec_1 = require('./module/generate-spec');
var fs_1 = require('./utils/fs');
var workingDir = process.cwd();
var packageJson;
var getPackageJsonValue = function (key, defaultValue) {
  if (defaultValue === void 0) {
    defaultValue = '';
  }
  return __awaiter(void 0, void 0, void 0, function () {
    var packageJsonRaw, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!!packageJson) return [3 /*break*/, 4];
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [4 /*yield*/, fs_1.fsReadFile(workingDir + '/package.json')];
        case 2:
          packageJsonRaw = _a.sent();
          packageJson = JSON.parse(packageJsonRaw.toString('utf8'));
          return [3 /*break*/, 4];
        case 3:
          err_1 = _a.sent();
          return [2 /*return*/, defaultValue];
        case 4:
          return [2 /*return*/, packageJson[key] || ''];
      }
    });
  });
};
var nameDefault = function () {
  return getPackageJsonValue('name', 'TSOA');
};
var versionDefault = function () {
  return getPackageJsonValue('version', '1.0.0');
};
var descriptionDefault = function () {
  return getPackageJsonValue('description', 'Build swagger-compliant REST APIs using TypeScript and Node');
};
var licenseDefault = function () {
  return getPackageJsonValue('license', 'MIT');
};
var determineNoImplicitAdditionalSetting = function (noImplicitAdditionalProperties) {
  if (noImplicitAdditionalProperties === 'silently-remove-extras' || noImplicitAdditionalProperties === 'throw-on-extras' || noImplicitAdditionalProperties === 'ignore') {
    return noImplicitAdditionalProperties;
  } else {
    return 'ignore';
  }
};
var authorInformation = getPackageJsonValue('author', 'unknown');
var getConfig = function (configPath) {
  if (configPath === void 0) {
    configPath = 'tsoa.json';
  }
  return __awaiter(void 0, void 0, void 0, function () {
    var config, ext, configRaw, err_2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 4, , 5]);
          ext = path.extname(configPath);
          if (!(ext === '.yaml' || ext === '.yml')) return [3 /*break*/, 1];
          config = YAML.load(configPath);
          return [3 /*break*/, 3];
        case 1:
          return [4 /*yield*/, fs_1.fsReadFile(workingDir + '/' + configPath)];
        case 2:
          configRaw = _a.sent();
          config = JSON.parse(configRaw.toString('utf8'));
          _a.label = 3;
        case 3:
          return [3 /*break*/, 5];
        case 4:
          err_2 = _a.sent();
          if (err_2.code === 'MODULE_NOT_FOUND') {
            throw Error("No config file found at '" + configPath + "'");
          } else if (err_2.name === 'SyntaxError') {
            // tslint:disable-next-line:no-console
            console.error(err_2);
            throw Error("Invalid JSON syntax in config at '" + configPath + "': " + err_2.message);
          } else {
            // tslint:disable-next-line:no-console
            console.error(err_2);
            throw Error("Unhandled error encountered loading '" + configPath + "': " + err_2.message);
          }
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/, config];
      }
    });
  });
};
var validateCompilerOptions = function (config) {
  return config || {};
};
exports.validateSpecConfig = function (config) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, noImplicitAdditionalProperties, _c, _d, _e, _f, _g, _h, contact;
    return __generator(this, function (_j) {
      switch (_j.label) {
        case 0:
          if (!config.spec) {
            throw new Error('Missing spec: configuration must contain spec. Spec used to be called swagger in previous versions of tsoa.');
          }
          if (!config.spec.outputDirectory) {
            throw new Error('Missing outputDirectory: configuration must contain output directory.');
          }
          if (!config.entryFile) {
            throw new Error('Missing entryFile: configuration must contain an entry point file.');
          }
          return [4 /*yield*/, fs_1.fsExists(config.entryFile)];
        case 1:
          if (!_j.sent()) {
            throw new Error('EntryFile not found: ' + config.entryFile + ' - please check your tsoa config.');
          }
          _a = config.spec;
          _b = config.spec.version;
          if (_b) return [3 /*break*/, 3];
          return [4 /*yield*/, versionDefault()];
        case 2:
          _b = _j.sent();
          _j.label = 3;
        case 3:
          _a.version = _b;
          config.spec.specVersion = config.spec.specVersion || 2;
          if (config.spec.specVersion !== 2 && config.spec.specVersion !== 3) {
            throw new Error('Unsupported Spec version.');
          }
          if (config.spec.spec && !['immediate', 'recursive', 'deepmerge', undefined].includes(config.spec.specMerging)) {
            throw new Error('Invalid specMerging config: ' + config.spec.specMerging);
          }
          noImplicitAdditionalProperties = determineNoImplicitAdditionalSetting(config.noImplicitAdditionalProperties);
          _c = config.spec;
          _d = config.spec.name;
          if (_d) return [3 /*break*/, 5];
          return [4 /*yield*/, nameDefault()];
        case 4:
          _d = _j.sent();
          _j.label = 5;
        case 5:
          _c.name = _d;
          _e = config.spec;
          _f = config.spec.description;
          if (_f) return [3 /*break*/, 7];
          return [4 /*yield*/, descriptionDefault()];
        case 6:
          _f = _j.sent();
          _j.label = 7;
        case 7:
          _e.description = _f;
          _g = config.spec;
          _h = config.spec.license;
          if (_h) return [3 /*break*/, 9];
          return [4 /*yield*/, licenseDefault()];
        case 8:
          _h = _j.sent();
          _j.label = 9;
        case 9:
          _g.license = _h;
          config.spec.basePath = config.spec.basePath || '/';
          if (!config.spec.contact) {
            config.spec.contact = {};
          }
          return [4 /*yield*/, authorInformation];
        case 10:
          contact = _j.sent().match(/^([^<(]*)?\s*(?:<([^>(]*)>)?\s*(?:\(([^)]*)\)|$)/m);
          config.spec.contact.name = config.spec.contact.name || (contact === null || contact === void 0 ? void 0 : contact[1]);
          config.spec.contact.email = config.spec.contact.email || (contact === null || contact === void 0 ? void 0 : contact[2]);
          config.spec.contact.url = config.spec.contact.url || (contact === null || contact === void 0 ? void 0 : contact[3]);
          return [
            2 /*return*/,
            __assign(__assign({}, config.spec), { noImplicitAdditionalProperties: noImplicitAdditionalProperties, entryFile: config.entryFile, controllerPathGlobs: config.controllerPathGlobs }),
          ];
      }
    });
  });
};
var validateRoutesConfig = function (config) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d, noImplicitAdditionalProperties;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          if (!config.entryFile) {
            throw new Error('Missing entryFile: Configuration must contain an entry point file.');
          }
          return [4 /*yield*/, fs_1.fsExists(config.entryFile)];
        case 1:
          if (!_e.sent()) {
            throw new Error('EntryFile not found: ' + config.entryFile + ' - Please check your tsoa config.');
          }
          if (!config.routes.routesDir) {
            throw new Error('Missing routesDir: Configuration must contain a routes file output directory.');
          }
          _a = config.routes.authenticationModule;
          if (!_a) return [3 /*break*/, 5];
          return [4 /*yield*/, fs_1.fsExists(config.routes.authenticationModule)];
        case 2:
          _b = _e.sent();
          if (_b) return [3 /*break*/, 4];
          return [4 /*yield*/, fs_1.fsExists(config.routes.authenticationModule + '.ts')];
        case 3:
          _b = _e.sent();
          _e.label = 4;
        case 4:
          _a = !_b;
          _e.label = 5;
        case 5:
          if (_a) {
            throw new Error("No authenticationModule file found at '" + config.routes.authenticationModule + "'");
          }
          _c = config.routes.iocModule;
          if (!_c) return [3 /*break*/, 9];
          return [4 /*yield*/, fs_1.fsExists(config.routes.iocModule)];
        case 6:
          _d = _e.sent();
          if (_d) return [3 /*break*/, 8];
          return [4 /*yield*/, fs_1.fsExists(config.routes.iocModule + '.ts')];
        case 7:
          _d = _e.sent();
          _e.label = 8;
        case 8:
          _c = !_d;
          _e.label = 9;
        case 9:
          if (_c) {
            throw new Error("No iocModule file found at '" + config.routes.iocModule + "'");
          }
          noImplicitAdditionalProperties = determineNoImplicitAdditionalSetting(config.noImplicitAdditionalProperties);
          config.routes.basePath = config.routes.basePath || '/';
          config.routes.middleware = config.routes.middleware || 'express';
          return [
            2 /*return*/,
            __assign(__assign({}, config.routes), { entryFile: config.entryFile, noImplicitAdditionalProperties: noImplicitAdditionalProperties, controllerPathGlobs: config.controllerPathGlobs }),
          ];
      }
    });
  });
};
var configurationArgs = {
  alias: 'c',
  describe: 'tsoa configuration file; default is tsoa.json in the working directory',
  required: false,
  type: 'string',
};
var hostArgs = {
  describe: 'API host',
  required: false,
  type: 'string',
};
var basePathArgs = {
  describe: 'Base API path',
  required: false,
  type: 'string',
};
var yarmlArgs = {
  describe: 'Swagger spec yaml format',
  required: false,
  type: 'boolean',
};
var jsonArgs = {
  describe: 'Swagger spec json format',
  required: false,
  type: 'boolean',
};
if (!module.parent) {
  yargs
    .usage('Usage: $0 <command> [options]')
    .demand(1)
    .command(
      'spec',
      'Generate OpenAPI spec',
      {
        basePath: basePathArgs,
        configuration: configurationArgs,
        host: hostArgs,
        json: jsonArgs,
        yaml: yarmlArgs,
      },
      SpecGenerator,
    )
    .command(
      'swagger',
      'Generate OpenAPI spec',
      {
        basePath: basePathArgs,
        configuration: configurationArgs,
        host: hostArgs,
        json: jsonArgs,
        yaml: yarmlArgs,
      },
      SpecGenerator,
    )
    .command(
      'routes',
      'Generate routes',
      {
        basePath: basePathArgs,
        configuration: configurationArgs,
      },
      routeGenerator,
    )
    .command(
      'spec-and-routes',
      'Generate OpenAPI spec and routes',
      {
        basePath: basePathArgs,
        configuration: configurationArgs,
        host: hostArgs,
        json: jsonArgs,
        yaml: yarmlArgs,
      },
      generateSpecAndRoutes,
    )
    .command(
      'swagger-and-routes',
      'Generate OpenAPI spec and routes',
      {
        basePath: basePathArgs,
        configuration: configurationArgs,
        host: hostArgs,
        json: jsonArgs,
        yaml: yarmlArgs,
      },
      generateSpecAndRoutes,
    )
    .help('help')
    .alias('help', 'h').argv;
}
function SpecGenerator(args) {
  return __awaiter(this, void 0, void 0, function () {
    var config, compilerOptions, swaggerConfig, err_3;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 4, , 5]);
          return [4 /*yield*/, getConfig(args.configuration)];
        case 1:
          config = _a.sent();
          if (args.basePath) {
            config.spec.basePath = args.basePath;
          }
          if (args.host) {
            config.spec.host = args.host;
          }
          if (args.yaml) {
            config.spec.yaml = args.yaml;
          }
          if (args.json) {
            config.spec.yaml = false;
          }
          compilerOptions = validateCompilerOptions(config.compilerOptions);
          return [4 /*yield*/, exports.validateSpecConfig(config)];
        case 2:
          swaggerConfig = _a.sent();
          return [4 /*yield*/, generate_spec_1.generateSpec(swaggerConfig, compilerOptions, config.ignore)];
        case 3:
          _a.sent();
          return [3 /*break*/, 5];
        case 4:
          err_3 = _a.sent();
          // tslint:disable-next-line:no-console
          console.error('Generate swagger error.\n', err_3);
          process.exit(1);
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function routeGenerator(args) {
  return __awaiter(this, void 0, void 0, function () {
    var config, compilerOptions, routesConfig, err_4;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 4, , 5]);
          return [4 /*yield*/, getConfig(args.configuration)];
        case 1:
          config = _a.sent();
          if (args.basePath) {
            config.routes.basePath = args.basePath;
          }
          compilerOptions = validateCompilerOptions(config.compilerOptions);
          return [4 /*yield*/, validateRoutesConfig(config)];
        case 2:
          routesConfig = _a.sent();
          return [4 /*yield*/, generate_routes_1.generateRoutes(routesConfig, compilerOptions, config.ignore)];
        case 3:
          _a.sent();
          return [3 /*break*/, 5];
        case 4:
          err_4 = _a.sent();
          // tslint:disable-next-line:no-console
          console.error('Generate routes error.\n', err_4);
          process.exit(1);
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function generateSpecAndRoutes(args) {
  return __awaiter(this, void 0, void 0, function () {
    var config, compilerOptions, routesConfig, swaggerConfig, metadata, err_5;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 5, , 6]);
          return [4 /*yield*/, getConfig(args.configuration)];
        case 1:
          config = _a.sent();
          if (args.basePath) {
            config.spec.basePath = args.basePath;
          }
          if (args.host) {
            config.spec.host = args.host;
          }
          if (args.yaml) {
            config.spec.yaml = args.yaml;
          }
          if (args.json) {
            config.spec.yaml = false;
          }
          compilerOptions = validateCompilerOptions(config.compilerOptions);
          return [4 /*yield*/, validateRoutesConfig(config)];
        case 2:
          routesConfig = _a.sent();
          return [4 /*yield*/, exports.validateSpecConfig(config)];
        case 3:
          swaggerConfig = _a.sent();
          metadata = new metadataGenerator_1.MetadataGenerator(routesConfig.entryFile, compilerOptions, config.ignore, routesConfig.controllerPathGlobs).Generate();
          return [
            4 /*yield*/,
            Promise.all([
              generate_routes_1.generateRoutes(routesConfig, compilerOptions, config.ignore, metadata),
              generate_spec_1.generateSpec(swaggerConfig, compilerOptions, config.ignore, metadata),
            ]),
          ];
        case 4:
          return [2 /*return*/, _a.sent()];
        case 5:
          err_5 = _a.sent();
          // tslint:disable-next-line:no-console
          console.error('Generate routes error.\n', err_5);
          process.exit(1);
          throw err_5;
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
exports.generateSpecAndRoutes = generateSpecAndRoutes;
//# sourceMappingURL=cli.js.map
