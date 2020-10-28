import Core = require('../appCore');
import { User, UserModel } from "../appModels";
import { Document, Schema, Model, model} from "mongoose";

export var MailSchema: Schema = new Schema({
    mailProvider: {type: String, default: 'nodemailer'}
});

MailSchema.methods.send = function(cb: any) {

    const nodemailer = require(this.mailProvider); // 'nodemailer' or test/mocks/nodemailer.mock.ts
    const crypt = require('../appCore/Crypt');
    const cfg: any = require('../appConfig');

    User.findOne({token: this.token}, (err, user) => {

        // retrieve the default user from config for test sending
        user = user || cfg.defUser;

        let mailAccount: any = JSON.parse(JSON.stringify(user.mailAccount[0]));
        mailAccount.auth.pass = crypt.decrypt(mailAccount.auth.pass);
        const transport = nodemailer.createTransport(mailAccount);

        transport.sendMail(this, (error, info) => {
            if (error) {
                process.env.NODE_ENV && process.env.NODE_ENV != 'test' &&
                console.error('Message sent error: ' + error);
                cb(this, false);
            } else {
                process.env.NODE_ENV && process.env.NODE_ENV != 'test' &&
                console.info('Message sent: ' + info.response);
                cb(this, true);
            }
        });
    });
};

export var Mail = Core.BaseProvider.discriminator<Core.IProvider>('Mail', MailSchema);
