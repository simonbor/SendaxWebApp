import {} from 'jest';
import { Mail } from "../src/appModels";
import cfg = require('../src/appConfig');
import { BaseProvider, Sender } from '../src/appCore';
var mongoose = require('mongoose');
mongoose.Promise = Promise;

describe('Test BaseProviders methods', () => {
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

    test('The send mechanism quantity functionality test', (done) => {

        let testOrders = [
            new Mail({ type: 'Test', token: "0", mailProvider: "../../test/mocks/nodemailer",
                repeat: 0, delay: 0 }),
            new Mail({ type: 'Test', token: "0", mailProvider: "../../test/mocks/nodemailer",
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
