"use strict";
// example
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
    ]
};
*/
Object.defineProperty(exports, "__esModule", { value: true });
var UserType;
(function (UserType) {
    UserType[UserType["Active"] = 0] = "Active";
    UserType[UserType["Inactive"] = 1] = "Inactive";
    UserType[UserType["Test"] = 2] = "Test";
})(UserType = exports.UserType || (exports.UserType = {}));
class MailAccountProvider {
}
exports.MailAccountProvider = MailAccountProvider;
class User {
}
exports.User = User;
//# sourceMappingURL=jUser.js.map