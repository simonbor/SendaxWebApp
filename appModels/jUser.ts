
export enum UserType {
    Active,
    Inactive,
    Test
}

export class MailAccountProvider {
    public default: boolean;
    public service: string;
    public auth: JSON;          // the structure is - { user: 'the email address', pass: 'the pass' }
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
