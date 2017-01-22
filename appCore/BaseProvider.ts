import Core = require('../appCore');

export enum RepeatPeriods {
    H = 60000 * 60,             //3,600,000 - hour
    D = 60000 * 60 * 24,        // 86,400,000 - day
    W = 60000 * 60 * 24 * 7,    // 604,800,000 - weak
    M = 60000 * 60 * 24 * 30,   // 2,592,000,000 - mounth
    //M = 60000,                  // one min
    Y = 60000 * 60 * 24 * 365   // 31,536,000,000 - year
};


export abstract class BaseProvider implements Core.IProvider {
    public _id: string;
    public type: string;
    public token: string;
    public from: string;
    public time: number;
    public to: string[];
    public repeat: string;
    public subject: string;
    public text: string;
    public html: string;
    public timeToSend: number;
    public sent: boolean = false;
    public repeated: number = 0;

    constructor(doc: any) {
        this._id = doc._id;
        this.type = doc.type;
        this.token = doc.token;
        this.from = doc.from;
        this.to = typeof doc.to === "string" ? doc.to.split(',') : doc.to; // this.to is always Array
        this.time = parseInt(doc.time);
        this.repeat = doc.repeat;
        this.subject = doc.subject;
        this.text = doc.text;
        this.html = doc.html;
        this.timeToSend = doc.timeToSend && typeof doc.timeToSend === "number" ? doc.timeToSend : parseInt(doc.time) + new Date().getTime();
        this.sent = typeof doc.sent !== "undefined" ? doc.sent : this.sent;
        this.repeated = doc.repeated && typeof(doc.repeated) == "number" ? doc.repeated : this.repeated;
    }

    valid(): boolean {

        // this.time is should be positive whole number
        if (this.time < 0) {
            return false;
        }

        return true;
    }

    insert(cb: any): any {
        Core.DataBase.insertNewOrder(this, cb);
    }

    send(callback: any) {};

    // update
    update(): any {
        this.repeated =++ this.repeated || 0;

        if (this.repeat && this.repeat.length > 1 && /^[HDWMY]$/.test(this.repeat[0].toUpperCase()) && /^\d$/.test(this.repeat[1])) {
            if (this.repeated < parseInt(this.repeat[1])) {
                let repeatPeriods: RepeatPeriods = RepeatPeriods[this.repeat[0].toUpperCase()];
                this.timeToSend = new Date().getTime() + repeatPeriods;
            } else {
                this.sent = true;
            }
        } else if (this.repeat && this.repeat === "0") {
            this.sent = true;
        }
    }

    // store
    store(orderId) {
        Core.DataBase.updateSentOrder(this, (err, numUpdated) => {
            if (numUpdated < 1) {
                console.log('Can\'t update order record');
            }
        });
    };
}