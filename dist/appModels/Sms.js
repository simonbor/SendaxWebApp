"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Core = require("../appCore");
class Sms extends Core.BaseProvider {
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
    }
    ;
    insert(cb) {
        super.insert(cb);
    }
    ;
    send(cb) {
        // TODO: here implement send SMS logic
    }
    update() {
        // update sent order
        super.update();
    }
    store(callback) {
        // update sent order
        super.store(this._id);
    }
}
exports.Sms = Sms;
//# sourceMappingURL=Sms.js.map