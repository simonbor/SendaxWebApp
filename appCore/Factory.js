"use strict";
var Models = require('../appModels');
var Activator = (function () {
    function Activator() {
    }
    Activator.createInstance = function (type, jsonParams) {
        try {
            jsonParams.type = type; // type property chaining
            return new Models[type](jsonParams);
        }
        catch (e) {
            return null;
        }
    };
    return Activator;
}());
exports.Activator = Activator;
//# sourceMappingURL=Factory.js.map