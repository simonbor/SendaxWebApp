﻿import Models = require('../appModels/AppModels');

export interface IProvider {
    valid: () => boolean;       // check the order
    insert: (cb: any) => any;     // save the order
    send: (cb: any) => void;    // send the order
    update: () => any;      // update sent order
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