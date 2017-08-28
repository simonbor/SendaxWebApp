"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Models = require("../appModels");
class Activator {
    static createInstance(type, jsonParams) {
        try {
            jsonParams.type = type; // type property chaining
            return new Models[type](jsonParams);
        }
        catch (e) {
            return null;
        }
    }
}
exports.Activator = Activator;
//# sourceMappingURL=Factory.js.map