import {} from 'jest';

test('flat password is should be match the decrypted password', () => {
    const crypt = require('../src/appCore/Crypt');
    
    const flatPassword: string = process.env.CRYPTO_KEY || 'MyPassword';
    const encPassword = crypt.encrypt(flatPassword);
    const decPassword = crypt.decrypt(encPassword);
    
    expect(flatPassword).not.toMatch(encPassword);
    expect(flatPassword).toMatch(decPassword);
  });

