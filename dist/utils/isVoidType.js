'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isVoidType = function (type) {
  if (type.dataType === 'void') {
    return true;
  } else if (type.dataType === 'refAlias') {
    return exports.isVoidType(type.type);
  } else {
    return false;
  }
};
//# sourceMappingURL=isVoidType.js.map
