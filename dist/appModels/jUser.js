"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var UserType;
(function (UserType) {
    UserType[UserType["Active"] = 0] = "Active";
    UserType[UserType["Inactive"] = 1] = "Inactive";
    UserType[UserType["Test"] = 2] = "Test";
})(UserType = exports.UserType || (exports.UserType = {}));
class MailAccountProvider {
}
exports.MailAccountProvider = MailAccountProvider;
const userSchema = new mongoose_1.Schema({
    token: String,
    type: String,
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    mailAccount: [
        {
            "default": Boolean,
            "service": String,
            "auth": {
                "user": String,
                "pass": String
            }
        }
    ],
}, { timestamps: true });
exports.User = mongoose_1.model("User", userSchema, 'Users');
exports.default = exports.User;
//# sourceMappingURL=jUser.js.map