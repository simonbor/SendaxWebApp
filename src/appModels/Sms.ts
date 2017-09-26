//import Core = require('../appCore');
import { BaseProvider } from '../appCore/BaseProvider'
import * as mongoose from "mongoose"
import { Document, Schema, Model, model} from "mongoose";

export var SmsSchema: Schema = new Schema({
    
    });
    
SmsSchema.methods.send = function(callback: any) {
        
    // todo: find approach to implement necessary logic in derived classes Mail and Sms
    //console.log('SmsSchema: ' + this);

};
    
export var Sms = BaseProvider.discriminator('Sms', SmsSchema);

/* export class Sms extends Core.BaseProvider implements Core.IProvider {

    constructor(json) {
        super(json);
    }

    public valid() {
        // perform base validation
        if (!super.valid()) {
            return false;
        }

        var validator = require('validator');

        // this.to validate
        // TODO fix/check the mobile phone regexp
        for (var i = 0; i < this.to.length; i++) {
            if (!validator.matches(this.to[i], /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)) {
                return false;
            }
        }

        // this.from validate
        // TODO fix/check the mobile phone regexp
        if (!validator.matches(this.from, /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g)) {
            return false;
        }

        return true;
    };

    public insert(cb: any) {
        super.insert(cb);
    };

    public send(cb: any): void {
        // TODO: here implement send SMS logic
    }

    update(): any {
        // update sent order
        super.update();
    }

    store(callback: any): void {
        // update sent order
        super.store(this._id);
    }
} 

 */