import Core = require('../appCore/AppCore');

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
        const encryptedPassword = '87cf1d70f26031a29aaa';

        const transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'simonbor.bell@gmail.com',
                pass: crypt.decrypt(encryptedPassword)
            }
        });

        transport.sendMail(this, (error, info) => {
            if (error) {
                console.log(error);
                callback(false);
            } else {
                console.log('Message sent: ' + info.response);
                callback(this, true);
            }
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
