import { BaseProvider, IProvider } from '../appCore';
import { Document, Schema, Model, model} from "mongoose";
import { User, UserModel } from "../appModels";

export var SmsSchema: Schema = new Schema({
    smsProvider: {type: String, default: 'nexmo'}    
});

SmsSchema.methods.send = function(cb: any) {

    const Nexmo = require(this.smsProvider);
    const cfg: any = require('../appConfig');
    
    User.findOne({token: this.token}, (err, user) => {
        
        // retrieve the default user from config for test sending
        user = user || cfg.defUser;

        const smsAccount: any = JSON.parse(JSON.stringify(user.smsAccount[0]));
        const nexmo = new Nexmo(smsAccount.auth);
        
        var from = this.from;
        var to = this.from;
        var text = this.text;
  
        nexmo.message.sendSms(from, to, text);

        //console.log(`The order ${this._id} was marked as sent. For real send please implement Sms.send() method`);
        cb(this, true);    
    });
};
    
export var Sms = BaseProvider.discriminator<IProvider>('Sms', SmsSchema);
