# Sendax

Sendax is a message engine.
It can send/order sending scheduled routine messages over the Internet by HTTP request

## Installation notes - server environment variables

1. set the NODE_ENV = "production" 
2. set MLAB_SENDAX_URI = "/*connection string*/" 
3. set CRYPTO_KEY = "/*the email password*/"

## Start notes

1. docker-compose up -d mongo
2. docker-compose up mongo-seed
3. docker build -t app --build-arg crypto_key=<gmail password> .
4. docker-compose up app
5. order sending by request the http://localhost:3000/mail/<token>/<from email>/<to email>/0/0/<subject>/<text>

## To do
1. -- For repair the project tests I need inject the mongoose - http://brianflove.com/2016/10/04/typescript-declaring-mongoose-schema-model/, http://rob.conery.io/2012/02/24/testing-your-model-with-mocha-mongo-and-nodejs/
    1.1 -- Should to refactoring the tests structure - http://www.albertgao.xyz/2017/06/19/test-your-model-via-jest-and-mongoose/, https://www.terlici.com/2014/09/15/node-testing.html, http://www.scotchmedia.com/tutorials/express/authentication/1/06
2. -- Organize the project structure - https://github.com/basarat/typescript-book/blob/master/docs/quick/nodejs.md
3. Extend the app by add the Telegram support - https://core.telegram.org/api/obtaining_api_id
4. Add history and active orders
