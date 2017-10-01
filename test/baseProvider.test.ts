import {} from 'jest';
import Core = require('../src/appCore');
import * as Models from "../src/appModels";

import cfg = require('../src/appConfig');
var mongoose = require('mongoose');
process.env.NODE_ENV = 'test';

describe('Test the removeComment method', () => {
    //let comment;
    beforeAll(() => {
        mongoose.connect(cfg.app.dbUrl);
    });
    beforeEach(() => {
        // comment = new CommentModel(testData.normalComment);
        // return comment.save();
    });
    afterEach(() => {
        // return CommentModel.removeComments();
    });
    afterAll((done) => {
        mongoose.disconnect(done);
    });
});

class Provider extends Core.BaseProvider implements Core.IProvider {
    /* valid(): boolean { return super.valid(); }
    insert(callback) { }
    send(callback): void { }
    update(): boolean { return super.update(); }
    store(callback): void { } */
}

test('Should failed when env not test ', () => {
    expect(process.env.NODE_ENV).toEqual('test');
});

test('test BaseProvider Validation method', () => {

    let testOrders = [
        new Provider({ type: 'Test', delay: -1, repeat: '-1' }),
        new Provider({ type: 'Test', delay: 0, repeat: 'h13' }),
        new Provider({ type: 'Test', delay: 0, repeat: 'z2' }),
        new Provider({ type: 'Test', delay: 0, repeat: 'h' }),
        new Provider({ type: 'Test', delay: -1, repeat: '12h' }),
        new Provider({ type: 'Test', delay: 100, repeat: '0' }),
        new Provider({ type: 'Test', delay: 100, repeat: 'h5' }),
        new Provider({ type: 'Test', delay: 100, repeat: 'w2' }),
        new Provider({ type: 'Test', delay: 0, repeat: 'x666' })
    ];

    expect(testOrders[0].valid()).toEqual(false);
    expect(testOrders[1].valid()).toEqual(false);
    expect(testOrders[2].valid()).toEqual(false);
    expect(testOrders[3].valid()).toEqual(false);
    expect(testOrders[4].valid()).toEqual(false);
    expect(testOrders[5].valid()).toEqual(true);
    expect(testOrders[6].valid()).toEqual(true);
    expect(testOrders[7].valid()).toEqual(true);
    expect(testOrders[8].valid()).toEqual(false);
});

test('Base Provider Update Test', () => {
    
    const timeGap = 10; // prevent other values in the Date().getTime() throw the test

    let testOrders = [
        new Core.BaseProvider({ type: 'Test', delay: 100, repeat: '0' }),
        new Core.BaseProvider({ type: 'Test', delay: 100, repeat: 'h5' }),
        new Core.BaseProvider({ type: 'Test', delay: 100, repeat: 'w2' }),
        new Core.BaseProvider({ type: 'Test', delay: 0, repeat: 'x666' })
    ];
   
    testOrders[0].update();
    testOrders[1].update();
    testOrders[2].update();
    testOrders[2].update();
    testOrders[3].update();

    expect(testOrders[0].repeated).toBe(1); // After running update() the 'repeated' field is should be incremented");
    expect(testOrders[0].sent).toBe(true); // sent field should be true after the update');

    //console.log('testOrders[3].timeToSend: ' + testOrders[3].timeToSend);

    expect(testOrders[1].timeToSend - new Date().getTime()).toBeLessThanOrEqual(Core.RepeatPeriods.H); //, 'testOrders[1] - The timeToSend is should be set to RepeatPeriods.H + Date().getTime()');
    expect(testOrders[1].timeToSend - new Date().getTime() + timeGap).toBeGreaterThanOrEqual(Core.RepeatPeriods.H); //, 'testOrders[1] - The timeToSend is should be set to RepeatPeriods.H + Date().getTime()');

    expect(testOrders[2].repeated).toBe(2); // After twice running update() the 'repeated' field is should be twice incremented");
    expect(testOrders[2].timeToSend - new Date().getTime() + timeGap).toBeGreaterThanOrEqual(Core.RepeatPeriods.W); // The timeToSend is should be set to RepeatPeriods.W + Date().getTime()');
    expect(testOrders[2].sent).toBeTruthy(); // The sent field after two update() calls is should be true');

    expect(testOrders[3].repeated).toBe(1); // Repeated incremented and the timeToSend == delay + NOW');
    expect(testOrders[3].sent).toBe(false); // Repeated incremented and the timeToSend == delay + NOW');
    // expect(testOrders[3].timeToSend + timeGap).toBeGreaterThan(new Date().getTime() + testOrders[3].delay); // Repeated incremented and the timeToSend == delay + NOW');
});

test('The send mechanism quantity functionality test', () => {
    let testOrders = [
        new Models.Mail({ type: 'Test' }),
        new Models.Mail({ type: 'Test' })
    ],
    expectSentNum = 0;

    Core.Sender.sendThese(testOrders, (sentNum: any) => {
        console.log(sentNum);
        expectSentNum = sentNum;
    });

    expect(expectSentNum).toBe(2);    
});

