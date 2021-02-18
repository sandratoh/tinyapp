const { assert } = require('chai');
const { findUserIdByEmail } = require('../helpers/loginHelpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('findUserIdByEmail', () => {
  it('should return a user with valid email', () => {
    const user = findUserIdByEmail(testUsers, 'user@example.com');
    const expectedOutput = 'userRandomID';
    assert.strictEqual(user, expectedOutput);
  });

  it('should return undefined if email is not in database', () => {
    const user = findUserIdByEmail(testUsers, 'noemail@example.com');
    const expectedOutput = undefined;
    assert.strictEqual(user, expectedOutput);
  });
});