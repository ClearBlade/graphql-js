"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicateEnumValueNameMessage = duplicateEnumValueNameMessage;
exports.existedEnumValueNameMessage = existedEnumValueNameMessage;
exports.UniqueEnumValueNames = UniqueEnumValueNames;

var _GraphQLError = require("../../error/GraphQLError");

var _definition = require("../../type/definition");

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
function duplicateEnumValueNameMessage(typeName, valueName) {
  return "Enum value \"".concat(typeName, ".").concat(valueName, "\" can only be defined once.");
}

function existedEnumValueNameMessage(typeName, valueName) {
  return "Enum value \"".concat(typeName, ".").concat(valueName, "\" already exists in the schema. It cannot also be defined in this type extension.");
}
/**
 * Unique enum value names
 *
 * A GraphQL enum type is only valid if all its values are uniquely named.
 */


function UniqueEnumValueNames(context) {
  var schema = context.getSchema();
  var existingTypeMap = schema ? schema.getTypeMap() : Object.create(null);
  var knownValueNames = Object.create(null);
  return {
    EnumTypeDefinition: checkValueUniqueness,
    EnumTypeExtension: checkValueUniqueness
  };

  function checkValueUniqueness(node) {
    var typeName = node.name.value;

    if (!knownValueNames[typeName]) {
      knownValueNames[typeName] = Object.create(null);
    }

    if (node.values) {
      var valueNames = knownValueNames[typeName];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = node.values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var valueDef = _step.value;
          var valueName = valueDef.name.value;
          var existingType = existingTypeMap[typeName];

          if ((0, _definition.isEnumType)(existingType) && existingType.getValue(valueName)) {
            context.reportError(new _GraphQLError.GraphQLError(existedEnumValueNameMessage(typeName, valueName), valueDef.name));
          } else if (valueNames[valueName]) {
            context.reportError(new _GraphQLError.GraphQLError(duplicateEnumValueNameMessage(typeName, valueName), [valueNames[valueName], valueDef.name]));
          } else {
            valueNames[valueName] = valueDef.name;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    return false;
  }
}