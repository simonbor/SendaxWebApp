import {} from 'jest';
import { Mail } from "../src/appModels";
var mongoose = require('mongoose');
import cfg = require('../src/appConfig');
import { BaseProvider, Sender } from '../src/appCore';

// Think about testing following scenarios - 
// 1. { $and: [{ $or: [{ sent: false }, { sent: { $exists: false } }] }, { timeToSend: { $lt: now } }] }
// 2. ...

describe.only('Test BaseProviders methods', () => {
    beforeAll(function(done) {
        let uri = cfg.dbUrl
        mongoose.connect(uri, { useMongoClient: true }, done);
    });
    beforeEach(() => {
    });
    afterEach((done) => {        
        mongoose.connection.db.dropCollection('Orders', function(err, result) {
            done();
        });
    });
    afterAll(function(done) {
        mongoose.disconnect(done);
    });

    test('The send mechanism quantity functionality test', (done) => {

        let testOrders = [
            new Mail({ type: 'Test', token: "0", mailProvider: "../../test/mocks/nodemailer" }),
            new Mail({ type: 'Test', token: "1", mailProvider: "../../test/mocks/nodemailer" })
        ],
        expectSentNum = 0;

        BaseProvider.insertMany(testOrders, (err)=>{
            if(!err){
                Sender.sendThese(testOrders, (sentNum: any) => {
                    expectSentNum = sentNum;
                    expect(expectSentNum).toBe(2);
                    done();
                });
            } else {
                console.log(`testOrders insert error: ${err}`);
                done();
            }
        });
    });
});
