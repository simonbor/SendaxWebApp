import Models = require('../appModels');
import { Document, Schema, Model, model} from "mongoose";

export interface IProvider extends Document {
    type?: string;
    token?: string;
    from?: string;
    delay?: number;
    to?: string[];
    repeat?: string;
    subject?: string;
    text?: string;
    html?: string;
    timeToSend?: number;
    sent?: boolean; // = false;
    repeated?: number; // = 0;

    valid: () => boolean;       // check the order - validate only and only the HTTP request structure
    insert: (cb: any) => any;   // save the order
    send: (cb: any) => void;    // send the order
    update: () => any;          // update sent order
    store: (cb: any) => void;   // update sent order
}

export class Activator {
    public static createInstance(type: string, jsonParams: any): IProvider {
        try {
            jsonParams.type = type; // type property chaining
            return new Models[type](jsonParams);
        } catch (e) {
            return null;
        }
    }
}
