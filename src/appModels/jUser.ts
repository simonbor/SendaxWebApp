import { Document, Schema, Model, model } from "mongoose";

export enum UserType {
    Active,
    Inactive,
    Test
}

export class AccountProvider {
    public default: boolean;
    public service: string;
    public auth: any;
}

export type UserModel = Document & {
    token: string;
    type: UserType;
    name: string;
    email: string; 
    password: string;
    phone: string;   // cell phone
    mailAccount: [AccountProvider],
    smsAccount: [AccountProvider]
};

  const userSchema = new Schema({
    token: String,
    type: String,
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,   // cell phone
    mailAccount: [
        {
			"default": Boolean,
			"service": String, 
			"auth": {
			    "user": String, 
				"pass": String
            }
        }
    ],   // cell phone
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

export const User = model<UserModel>("User", userSchema, 'Users');
export default User;


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