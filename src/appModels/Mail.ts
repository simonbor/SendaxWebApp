﻿import Core = require('../appCore');
import Models = require('../appModels');
import { User, UserModel, AuthToken } from "../appModels";

export class Mail extends Core.BaseProvider implements Core.IProvider {

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
        for (var i = 0; i < this.to.length; i++) {
            if (!validator.isEmail(this.to[i].trim())) {
                return false;
            }
        }

        // this.from validate
        if (!validator.isEmail(this.from)) {
            return false;
        }

        return true;
    };

    public insert(cb: any) {
        super.insert(cb);
    };

    public send(callback: any) {
        const nodemailer = require('nodemailer');
        const crypt = require('../appCore/Crypt');
        const cfg: any = require('../appConfig');

        Core.DataBase.getUser(this.token, (user: UserModel) => {
            // retrieve the default user from config for test sending
            user = user || cfg.defUser;

            let mailAccount: any = JSON.parse(JSON.stringify(user.mailAccount[0]));
            mailAccount.auth.pass = crypt.decrypt(mailAccount.auth.pass);
            const transport = nodemailer.createTransport(mailAccount);

            // this.text = JSON.stringify(this);

            transport.sendMail(this, (error, info) => {
                if (error) {
                    console.log(error);
                    callback(false);
                } else {
                    console.log('Message sent: ' + info.response);
                    callback(this, true);
                }
            });

        });
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