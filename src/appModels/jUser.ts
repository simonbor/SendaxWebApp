
import * as mongoose from "mongoose";

export type AuthToken = {
    accessToken: string,
    kind: string
};

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

export type UserModel = mongoose.Document & {

    eToken: string;
    name: string;
    email: string; 
    password: string;
    phone: string;   // cell phone
    type: UserType;
    mailAccount: Array<MailAccountProvider>;

    passwordResetToken: string,
    passwordResetExpires: Date,
  
    facebook: string,
    tokens: AuthToken[],
  
    profile: {
      name: string,
      gender: string,
      location: string,
      website: string,
      picture: string
    },
  
    comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
    gravatar: (size: number) => string
  };

  const userSchema = new mongoose.Schema({

    eToken: String,
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,   // cell phone
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
export const User = mongoose.model<UserModel>("User", userSchema, 'Users');
export default User;
  
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
