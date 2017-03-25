"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var assert = require('assert');
var Core = require('../appCore');
// ------------------------------------------
// cryptoPasswordTest
// ------------------------------------------
function cryptoPasswordTest() {
    var crypt = require('../appCore/Crypt.js');
    var flatPassword = process.env.CRYPTO_KEY || 'MyPassword';
    var encPassword = crypt.encrypt(flatPassword);
    var decPassword = crypt.decrypt(encPassword);
    assert.notEqual(flatPassword, encPassword, "The flat and encrypted passwords should be NOT EQUAL");
    assert.equal(flatPassword, decPassword, "The flat and decrypted passwords should be EQUAL");
}
exports.cryptoPasswordTest = cryptoPasswordTest;
// ------------------------------------------
// BaseProviderUpdate
// ------------------------------------------
function baseProviderUpdateTest() {
    var Test = (function (_super) {
        __extends(Test, _super);
        function Test() {
            _super.apply(this, arguments);
        }
        Test.prototype.valid = function () { throw new Error("Not implemented"); };
        Test.prototype.insert = function (calback) { };
        Test.prototype.send = function (calback) { };
        Test.prototype.update = function () { return _super.prototype.update.call(this); };
        Test.prototype.store = function (calback) { };
        return Test;
    }(Core.BaseProvider));
    var testOrders = [
        new Test({ type: 'Test', delay: 100, repeat: '0' }),
        new Test({ type: 'Test', delay: 100, repeat: 'h5' }),
        new Test({ type: 'Test', delay: 100, repeat: 'w2' }),
        new Test({ type: 'Test', delay: 0, repeat: 'x666' })
    ];
    testOrders[0].update();
    testOrders[1].update();
    testOrders[2].update();
    testOrders[2].update();
    testOrders[3].update();
    assert.ok(testOrders[0].repeated === 1, "testOrders[0] - After running update() the 'repeated' field is should be incremented");
    assert.equal(testOrders[0].sent, true, "testOrders[0] - sent field should be true after the update");
    assert.ok(testOrders[1].timeToSend - new Date().getTime() === Core.RepeatPeriods.H, "testOrders[1] - The timeToSend is should be set to RepeatPeriods.H + Date().getTime()");
    assert.ok(testOrders[2].repeated === 2, "testOrders[2] - After twice running update() the 'repeated' field is should be twice incremented");
    assert.ok(testOrders[2].timeToSend - new Date().getTime() === Core.RepeatPeriods.W, "testOrders[2] - The timeToSend is should be set to RepeatPeriods.W + Date().getTime()");
    assert.ok(testOrders[2].sent, "testOrders[2] - The sent field after two update() calls is should be true");
    assert.ok(testOrders[3].repeated === 1 && testOrders[3].timeToSend === (new Date().getTime() + testOrders[3].delay), "testOrders[3] - Repeated incremented and the timeToSend == delay + NOW");
}
exports.baseProviderUpdateTest = baseProviderUpdateTest;
// ------------------------------------------
// factoryActivatorTest
// ------------------------------------------
function factoryActivatorTest() {
    var instance = Core.Activator.createInstance('Mail', {});
    assert.ok(typeof instance === "object", "The Activator.createInstance is should get a new object");
    assert.ok(instance !== null, "The Activator.createInstance is should get an object !== null");
}
exports.factoryActivatorTest = factoryActivatorTest;
// ------------------------------------------
// performingSendTest
// ------------------------------------------
function performingSendTest() {
    var Test = (function (_super) {
        __extends(Test, _super);
        function Test() {
            _super.apply(this, arguments);
        }
        Test.prototype.valid = function () { throw new Error("Not implemented"); };
        Test.prototype.insert = function (calback) { };
        Test.prototype.send = function (calback) { };
        Test.prototype.store = function (calback) { };
        return Test;
    }(Core.BaseProvider));
    var testOrders = [
        new Test({ type: 'Test' }),
        new Test({ type: 'Test' })
    ];
    Core.Sender.sendThese(testOrders, function (sentNum) {
        assert.ok(sentNum > 0, "The sendAll should return positive whole number");
    });
}
exports.performingSendTest = performingSendTest;
//# sourceMappingURL=UnitTest1.js.map