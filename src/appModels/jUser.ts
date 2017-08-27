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

export class User {

    public eToken: string;
    public name: string;
    public email: string; 
    public password: string;
    public phone: string;   // cell phone
    public type: UserType;
    public mailAccount: Array<MailAccountProvider>;

}
