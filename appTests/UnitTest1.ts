import assert = require('assert');
import Core = require('../appCore');

// ------------------------------------------
// cryptoPasswordTest
// ------------------------------------------
export function cryptoPasswordTest() {
    const crypt = require('../appCore/Crypt.js');

    const flatPassword: string = process.env.CRYPTO_KEY || 'MyPassword';
    const encPassword = crypt.encrypt(flatPassword);
    const decPassword = crypt.decrypt(encPassword);

    assert.notEqual(flatPassword, encPassword, "The flat and encrypted passwords should be NOT EQUAL");
    assert.equal(flatPassword, decPassword, "The flat and decrypted passwords should be EQUAL");
}

// ------------------------------------------
// BaseProviderUpdate
// ------------------------------------------
export function baseProviderUpdateTest() {

    class Test extends Core.BaseProvider implements Core.IProvider {
        valid(): boolean { throw new Error("Not implemented"); }
        insert(calback) { }
        send(calback): void { }
        update(): boolean { return super.update(); }
        store(calback): void { }
    }

    let testOrders: Core.BaseProvider[] = [
        new Test({ type: 'Test', time: 100, repeat: '0' }),
        new Test({ type: 'Test', time: 100, repeat: 'h5' }),
        new Test({ type: 'Test', time: 100, repeat: 'w2' }),
        new Test({ type: 'Test', time: 0, repeat: 'x666' })
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
    assert.ok(testOrders[3].repeated === 1 && testOrders[3].timeToSend === (new Date().getTime() + testOrders[3].time), "testOrders[3] - Repeated incremented and the timeToSend == time + NOW");
}

// ------------------------------------------
// factoryActivatorTest
// ------------------------------------------
export function factoryActivatorTest() {

    let instance = Core.Activator.createInstance('Mail', {});

    assert.ok(typeof instance === "object", "The Activator.createInstance is should get a new object");
    assert.ok(instance !== null, "The Activator.createInstance is should get an object !== null");
}

// ------------------------------------------
// performingSendTest
// ------------------------------------------
export function performingSendTest() {

    class Test extends Core.BaseProvider implements Core.IProvider {
        valid(): boolean { throw new Error("Not implemented"); }
        insert(calback) {}
        send(calback): void {}
        store(calback): void {}
    }

    let testOrders: Core.BaseProvider[] = [
        new Test({ type: 'Test' }),
        new Test({ type: 'Test' })
    ];

    Core.Sender.sendThese(testOrders, (sentNum: any) => {
        assert.ok(sentNum > 0, "The sendAll should return positive whole number");
    });
}