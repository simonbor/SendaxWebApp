"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const algorithm = 'aes-256-ctr';
const password = process.env.CRYPTO_KEY || 'secretPassword';
function encrypt(text) {
    const cipher = crypto.createCipher(algorithm, password);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
function decrypt(text) {
    const decipher = crypto.createDecipher(algorithm, password);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}
exports.encrypt = encrypt;
exports.decrypt = decrypt;
//# sourceMappingURL=Crypt.js.map