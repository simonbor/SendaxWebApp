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
"use strict";
(function (UserType) {
    UserType[UserType["Active"] = 0] = "Active";
    UserType[UserType["Inactive"] = 1] = "Inactive";
    UserType[UserType["Test"] = 2] = "Test";
})(exports.UserType || (exports.UserType = {}));
var UserType = exports.UserType;
var MailAccountProvider = (function () {
    function MailAccountProvider() {
    }
    return MailAccountProvider;
}());
exports.MailAccountProvider = MailAccountProvider;
var User = (function () {
    function User() {
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=jUser.js.map