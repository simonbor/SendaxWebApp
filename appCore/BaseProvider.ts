import Core = require("../appCore");
import Models = require("../appModels");
import cfg = require("../appConfig");

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
    public delay: number;
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
        this.delay = parseInt(doc.delay);
        this.repeat = doc.repeat;
        this.subject = doc.subject;
        this.text = doc.text;
        this.html = doc.html;
        this.timeToSend = doc.timeToSend && typeof doc.timeToSend === "number" ? doc.timeToSend : parseInt(doc.delay) + new Date().getTime();
        this.sent = typeof doc.sent !== "undefined" ? doc.sent : this.sent;
        this.repeated = doc.repeated && typeof(doc.repeated) == "number" ? doc.repeated : this.repeated;
    }

    // validate only and only the HTTP request structure
    valid(): boolean {

        // this.delay is should be positive whole number
        if (this.delay < 0) {
            return false;
        }

        // this.repeat[0] is should be [HDWMY]
        if (!/^[HDWMY]$/.test(this.repeat[0].toUpperCase())) {
            return false;
        }

        // this.repeat is should contain number less then 12
        const reqRepeat = parseInt(this.repeat.match(/\d+/)[0]);
        if (reqRepeat < 0 && reqRepeat > 12) {
            return false;
        }

        return true;
    }

    insert(cb: any) {
        Core.DataBase.getUser(this.token, (user: Models.User) => {
            if (user) {
                if (user.type.toString() === 'Active') { // TODO: check the issue with using the - Models.UserType.Active
                    Core.DataBase.insertNewOrder(this, cb);
                } else {
                    cb({ error: `The user is ${user.type.toString()}` });
                }
            } else if (cfg.app.demoMode) {
                Core.DataBase.getOrder(this.token,
                    (order) => {
                        if (!order) {
                            Core.DataBase.insertNewOrder(this, cb);
                        } else {
                            cb({ error: "The token was used" });
                        }
                    });
            } else {
                cb({ error: "Demo mode is off. For send login to the system" });
            }
        });
    }

    send(callback: any) {};

    // update
    update(): any {

        // TODO: if the user is test user, initial sent with true value and leave the func

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

        // TODO: here addition check of the user type and if it is equal to test set the sent to true
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