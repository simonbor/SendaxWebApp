import { BaseProvider, IProvider } from '../appCore';
import { Document, Schema, Model, model} from "mongoose";
import { User, UserModel } from "../appModels";

export var SmsSchema: Schema = new Schema({
    smsProvider: {type: String, default: 'nexmo'}    
});

SmsSchema.methods.send = function(cb: any) {

    const Nexmo = require(this.smsProvider);
    const cfg: any = require('../appConfig');
    const crypt = require('../appCore/Crypt');    
    
    User.findOne({token: this.token}, (err, user) => {
        
        // for test sending the default user is coming from config
        user = user || cfg.defUser;

        const smsAccount: any = JSON.parse(JSON.stringify(user.smsAccount[0]));
        smsAccount.auth.apiSecret = crypt.decrypt(smsAccount.auth.apiSecret);
        const nexmo = new Nexmo(smsAccount.auth);        

        nexmo.message.sendSms(this.from, this.to, this.text);
        cb(this, true);    
    });
};

export var Sms = BaseProvider.discriminator<IProvider>('Sms', SmsSchema);
