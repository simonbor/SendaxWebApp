import {} from 'jest';
import { Mail } from "../src/appModels";
import cfg = require('../src/appConfig');
import { BaseProvider, Sender } from '../src/appCore';
var mongoose = require('mongoose');
mongoose.Promise = Promise;

describe('Test Sender methods', () => {
    beforeAll(function(done) {
        let uri = cfg.dbUrl
        mongoose.connect(uri, { useMongoClient: true }, done);
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

    test('The sendAll functionality test', (done) => {

        let testOrders = [
            new Mail({                                      // should to be send
                type: 'Mail', token: "0", repeat: 0, delay: 0, 
                mailProvider: "../../test/mocks/nodemailer",
                timeToSend: 0 }),
            new Mail({                                      // should to be send
                type: 'Mail', token: "0", repeat: 0, delay: 0, 
                mailProvider: "../../test/mocks/nodemailer",
                timeToSend: 0, sent: false }),
            new Mail({                                      // shouldn't be send
                type: 'Mail', token: "0", repeat: 0, delay: 0, 
                mailProvider: "../../test/mocks/nodemailer",
                timeToSend: Number.MAX_SAFE_INTEGER })
        ];

        BaseProvider.create(testOrders, (err)=>{
            if(!err){
                Sender.sendAll((sentNum: any) => {
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
