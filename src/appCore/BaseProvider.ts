import cfg = require("../appConfig");
import * as mongoose from "mongoose"
import { Document, Schema, Model, model} from "mongoose";
import { User } from "../appModels/jUser"
import { IProvider } from "./Factory"

export enum RepeatPeriods {
    H = 60000 * 60,             //3,600,000 - hour
    D = 60000 * 60 * 24,        // 86,400,000 - day
    W = 60000 * 60 * 24 * 7,    // 604,800,000 - weak
    M = 60000 * 60 * 24 * 30,   // 2,592,000,000 - mounts
    //M = 60000,                  // one min
    Y = 60000 * 60 * 24 * 365   // 31,536,000,000 - year
};

export var BaseProviderSchema: Schema = new Schema({
    type: String,
    token: {type: String, required: true},
    from: String,
    delay: Number,
    to: [String],
    repeat: String,
    subject: String,
    text: String,
    html: String,
    timeToSend: Number,
    sent: {type:Boolean, default: false}, // = false,
    repeated: {type:Number, default:0} // = 0
}, { discriminatorKey: 'kind' });

BaseProviderSchema.pre("save", function(next) {
  let now = new Date();
  if (!this.createdAt) {
    //this.createdAt = now;
  }
  next();
});

// the necessary logic is implemented in derived classes (Mail and Sms)
// ----------------------------------------------------------------------
BaseProviderSchema.methods.send = function(cb: any) {
    console.log('BaseProviderSchema send: ' + this);
    cb(0);
};

BaseProviderSchema.methods.store = function(callback: any) {
    const params = { $set: { sent: this.sent, repeated: this.repeated, timeToSend: (this.timeToSend || -1) } };

    BaseProvider.findOneAndUpdate({_id: this._id}, params, (err, doc) => {
        if (err) {
            console.log('Can\'t update order record');
        } 
    });
};

BaseProviderSchema.methods.valid = function(): boolean {
    // this.delay is should be positive whole number
    if (this.delay < 0) {
        return false;
    }

    // this.repeat[0] is should be H, D, W, M, Y or 0
    if (!/^[HDWMY0]$/.test(this.repeat[0].toUpperCase())) {
        return false;
    }

    // this.repeat is should contain number less then 12
    let regExp:any = this.repeat.match(/\d+/);
    if (!regExp || regExp.length < 1) {
        return false;
    }
    const reqRepeat = parseInt(regExp[0]);
    if (reqRepeat < 0 || reqRepeat > 12) {
        return false;
    }

    return true;
};

BaseProviderSchema.methods.insert = function(cb): boolean {
    User.findOne({ token: this.token }, (err, user) => {
        if (err) 
            console.log(err);                       // TODO: change to handleError(err);

        if (user) {
            if (user.type.toString() === 'Active') { // TODO: check the issue with using the - Models.UserType.Active
                BaseProvider.create(this, (err, res)=>{
                    if (err) 
                        console.log(err);                       // TODO: change to handleError(err);
                    cb(res);
                });
                //Core.DataBase.insertNewOrder(this, cb);
            } else {
                cb({ error: `The user is ${user.type.toString()}` });
            }
        } else if (cfg.app.demoMode) {
            BaseProvider.findOne({token: this.token}, (order)=>{
                if (!order) {
                    BaseProvider.create(this, (err, res)=>{
                        if (err) 
                            console.log(err);                       // TODO: change to handleError(err);
                        cb(res);    
                    });
                } else {
                    cb({ error: "The token was used" });
                }
            });
        } else {
            cb({ error: "Demo mode is off. For send login to the system" });
        }
    })

    return true;
};

BaseProviderSchema.methods.update = function(): any {
    // TODO: if the user is test user, initial sent with true value and leave the func
    this.repeated =++ this.repeated || 0;

    if (this.repeat && this.repeat.length > 1 && /^[HDWMY]$/.test(this.repeat[0].toUpperCase()) && /^\d$/.test(this.repeat[1])) {
        if (this.repeated < parseInt(this.repeat[1])) {
            let repeatPeriods = RepeatPeriods[this.repeat[0].toUpperCase()];
            this.timeToSend = new Date().getTime() + repeatPeriods;
        } else {
            this.sent = true;
        }
    } else if (this.repeat && this.repeat === "0") {
        this.sent = true;
    }
    // TODO: here addition check of the user type and if it is equal to test set the sent to true
};

export const BaseProvider: Model<IProvider> = model<IProvider>("BaseProvider", BaseProviderSchema, 'Orders');
