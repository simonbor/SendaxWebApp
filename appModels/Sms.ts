import Core = require('../appCore/AppCore');

export class Sms extends Core.BaseProvider implements Core.IProvider {

    constructor(json) {
        super(json);
    }

    valid() {
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

    send(): void {
        // TODO: here implement send SMS logic
    }

    update(): any {
        // update sent order
        super.update();
    }

    store(orderId): void {
        // update sent order
        super.store(orderId);
    }
} 
