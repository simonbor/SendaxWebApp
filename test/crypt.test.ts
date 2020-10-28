import {} from 'jest';

test('flat password is should be match the decrypted password', () => {
    const crypt = require('../src/appCore/Crypt');

    const flatPassword: string = 'tEsTpAsSwOrD';
    const encPassword = crypt.encrypt(flatPassword);
    const decPassword = crypt.decrypt(encPassword);
    
    // // to create a new password uncomment next lines and run the test
    // console.log(`dec pass: ${decPassword}`);
    // console.log(`enc pass: ${encPassword}`);

    expect(flatPassword).not.toMatch(encPassword);
    expect(flatPassword).toMatch(decPassword);
  });

