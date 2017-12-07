class Nexmo {
    apiKey: string;
    apiSecret: string;

    constructor(auth: any){
        this.apiKey = auth.apiKey;
        this.apiSecret = auth.apiSecret;
    }

    get message(): any {
        return new this.nested();
    }

    nested = class {
        sendSms(from: string, to: string, text: string, cb: any){
            if(cb == typeof 'function'){
                cb(null);
            }
        }
    }
}

module.exports = Nexmo
