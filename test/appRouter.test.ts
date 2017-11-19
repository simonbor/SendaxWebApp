import {} from 'jest';
import { Mail } from "../src/appModels";
import cfg = require('../src/appConfig');
import { BaseProvider, Sender } from '../src/appCore';
const Router: any = require("../src/appRouters/AppRouter");

var mongoose = require('mongoose');
mongoose.Promise = Promise;

describe('Test Router methods', () => {
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

    test('The processRequest test', (done) => {
        const mail = new Mail({ type: 'Mail', token: "0", mailProvider: "../../test/mocks/nodemailer", repeat: 0, delay: 0 });

        Router.processRequest(mail, (result) => {
            expect(result.timeToSend).toBeGreaterThan(0);
            expect(result.kind).toEqual('Mail');
            expect(result).toBeInstanceOf(Object);
            done();
        }, false);

    });
});
