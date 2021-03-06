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
Object.defineProperty(exports, '__esModule', { value: true });
var path_1 = require('path');
var GenerateMetadataError = /** @class */ (function (_super) {
  __extends(GenerateMetadataError, _super);
  function GenerateMetadataError(message, node, onlyCurrent) {
    if (onlyCurrent === void 0) {
      onlyCurrent = false;
    }
    var _this = _super.call(this, message) || this;
    if (node) {
      _this.message = message + '\n' + prettyLocationOfNode(node) + '\n' + prettyTroubleCause(node, onlyCurrent);
    }
    return _this;
  }
  return GenerateMetadataError;
})(Error);
exports.GenerateMetadataError = GenerateMetadataError;
function prettyLocationOfNode(node) {
  var sourceFile = node.getSourceFile();
  var token = node.getFirstToken() || node.parent.getFirstToken();
  var start = token ? ':' + (sourceFile.getLineAndCharacterOfPosition(token.getStart()).line + 1) : '';
  var end = token ? ':' + (sourceFile.getLineAndCharacterOfPosition(token.getEnd()).line + 1) : '';
  var normalizedPath = path_1.normalize('' + sourceFile.fileName + start + end);
  return 'At: ' + normalizedPath + '.';
}
exports.prettyLocationOfNode = prettyLocationOfNode;
function prettyTroubleCause(node, onlyCurrent) {
  if (onlyCurrent === void 0) {
    onlyCurrent = false;
  }
  var name;
  if (onlyCurrent || !node.parent) {
    name = node.pos !== -1 ? node.getText() : node.name.text;
  } else {
    name = node.parent.pos !== -1 ? node.parent.getText() : node.parent.name.text;
  }
  return "This was caused by '" + name + "'";
}
exports.prettyTroubleCause = prettyTroubleCause;
//# sourceMappingURL=exceptions.js.map
