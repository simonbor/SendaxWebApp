import {} from 'jest';
import Core = require('../src/appCore');

test('', () => {
    let instance = Core.Activator.createInstance('Mail', {});
    
    expect(typeof instance === "object").toBeTruthy(); // "The Activator.createInstance is should get a new object");
    expect(instance).not.toBeNull(); // "The Activator.createInstance is should get an object !== null");
  });

