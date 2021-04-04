const { assert } = require('chai');

const { emailLookup, urlsForUser } = require('../helpers');

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

const testData = {
    b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
    i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
  };

describe('emailLookup', function() {
  it('should return a user with valid email', function() {
    const user = emailLookup("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user,expectedOutput);
  });
  it('should return undefined if invalid email', function() {
    const user = emailLookup("user3@example.com", testUsers)
    const expectedOutput = undefined;
    assert.equal(user,expectedOutput);
  });
});

describe('urlsForUser', function() {
    it('should return an object if urls with valid email', function() {
      const user = urlsForUser("userRandomID", testData);
      const expectedOutput = {
        b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
        i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
      };
      assert.deepEqual(user,expectedOutput);
    });
    it('should return undefined if no urls with valid email', function() {
      const user = emailLookup("user1", testData);
      const expectedOutput = undefined;
      assert.deepEqual(user,expectedOutput);
    });
  });