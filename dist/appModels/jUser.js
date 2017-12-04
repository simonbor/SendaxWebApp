"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var UserType;
(function (UserType) {
    UserType[UserType["Active"] = 0] = "Active";
    UserType[UserType["Inactive"] = 1] = "Inactive";
    UserType[UserType["Test"] = 2] = "Test";
})(UserType = exports.UserType || (exports.UserType = {}));
class AccountProvider {
}
exports.AccountProvider = AccountProvider;
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
    smsAccount: [
        {
            "default": Boolean,
            "service": String,
            "auth": {
                "key": String,
                "secret": String
            }
        }
    ],
}, { timestamps: true });
exports.User = mongoose_1.model("User", userSchema, 'Users');
exports.default = exports.User;
/*
{
    "token": "0544777601",
    "type": "Active",
    "mailAccount": [
        {
            "default": true,
            "service": "Gmail",
            "auth": {
                "user": "simonbor@gmail.com",
                "pass": "83d80671a52e2da09db68cada9edb4b0"
            }
        }
    ],
    "smsAccount": [
        {
            "default": true,
            "service": "nexmo",
            "auth": {
                "apiKey": "472bf4de",
                "apiSecret": "66422b66016f21cd"
            }
        }
    ]
}
*/ 
//# sourceMappingURL=jUser.js.map