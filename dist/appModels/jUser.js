"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var UserType;
(function (UserType) {
    UserType[UserType["Active"] = 0] = "Active";
    UserType[UserType["Inactive"] = 1] = "Inactive";
    UserType[UserType["Test"] = 2] = "Test";
})(UserType = exports.UserType || (exports.UserType = {}));
class MailAccountProvider {
}
exports.MailAccountProvider = MailAccountProvider;
const userSchema = new mongoose.Schema({
    eToken: String,
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    type: Number,
    mailAccount: [String],
    passwordResetToken: String,
    passwordResetExpires: Date,
    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,
    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String
    }
}, { timestamps: true });
//export const User: UserTypeTwo = mongoose.model<UserTypeTwo>('User', userSchema);
const User = mongoose.model("User", userSchema);
exports.default = User;
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
// export enum UserType {
//     Active,
//     Inactive,
//     Test
// }
// export class MailAccountProvider {
//     public default: boolean;
//     public service: string;
//     public auth: any;
// }
// export class User {
//     public eToken: string;
//     public name: string;
//     public email: string; 
//     public password: string;
//     public phone: string;   // cell phone
//     public type: UserType;
//     public mailAccount: Array<MailAccountProvider>;
// }
//# sourceMappingURL=jUser.js.map