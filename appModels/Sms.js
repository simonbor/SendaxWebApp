"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Core = require('../appCore');
var Sms = (function (_super) {
    __extends(Sms, _super);
    function Sms(json) {
        _super.call(this, json);
    }
    Sms.prototype.valid = function () {
        // perform base validation
        if (!_super.prototype.valid.call(this)) {
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
    ;
    Sms.prototype.insert = function (cb) {
        _super.prototype.insert.call(this, cb);
    };
    ;
    Sms.prototype.send = function () {
        // TODO: here implement send SMS logic
    };
    Sms.prototype.update = function () {
        // update sent order
        _super.prototype.update.call(this);
    };
    Sms.prototype.store = function (orderId) {
        // update sent order
        _super.prototype.store.call(this, orderId);
    };
    return Sms;
}(Core.BaseProvider));
exports.Sms = Sms;
//# sourceMappingURL=Sms.js.map