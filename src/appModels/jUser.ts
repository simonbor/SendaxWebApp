import { Document, Schema, Model, model } from "mongoose";

export enum UserType {
    Active,
    Inactive,
    Test
}

export class MailAccountProvider {
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
    mailAccount: [MailAccountProvider];
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
    ],
}, { timestamps: true });

export const User = model<UserModel>("User", userSchema, 'Users');
export default User;
