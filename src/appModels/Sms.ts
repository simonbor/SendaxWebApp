import { BaseProvider, IProvider } from '../appCore';
import { Document, Schema, Model, model} from "mongoose";

export var SmsSchema: Schema = new Schema({    
});
    
SmsSchema.methods.send = function(cb: any) {
    // TODO: here implement send SMS logic
    console.log(`The order ${this._id} was marked as sent. For real send please implement Sms.send() method`);
    cb(this, true);
};
    
export var Sms = BaseProvider.discriminator<IProvider>('Sms', SmsSchema);
