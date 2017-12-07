import {} from 'jest';
import { Sms } from "../src/appModels";
import cfg = require('../src/appConfig');
import { BaseProvider, Sender } from '../src/appCore';
var mongoose = require('mongoose');
mongoose.Promise = Promise;

describe('Test BaseProviders methods for Sms', () => {
    beforeAll(function(done) {
        mongoose.connect(cfg.dbUrl, { useMongoClient: true }, done);
    });
    beforeEach((done) => {
        mongoose.connection.db.dropCollection('Orders', () => {
            done();
        });
    });
    afterEach((done) => {        
        mongoose.connection.db.dropCollection('Orders', () => {
            done();
        });
    });
    afterAll(function(done) {
        mongoose.disconnect(done);
    });

    test('The send SMS mechanism quantity functionality test', (done) => {

        let testOrders = [
            new Sms({ type: 'Test', token: "0", smsProvider: "../../test/mocks/nexmo",
                repeat: 0, delay: 0 }),
            new Sms({ type: 'Test', token: "0", smsProvider: "../../test/mocks/nexmo",
                repeat: 0, delay: 0 })
        ];

        BaseProvider.create(testOrders, (err)=>{
            if(!err){
                Sender.sendThese(testOrders, (sentNum: any) => {
                    expect(sentNum).toBe(2);
                    done();
                });
            } else {
                console.log(`testOrders insert error: ${err}`);
                done();
            } 
        });
    });
});
