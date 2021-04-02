const crypto = require('crypto');

function generateRandomString() {
    let id = crypto.randomBytes(3).toString('hex');
    return id;
  }
  
//looks if e-mail is already in DB
function emailLookup(email, users) {
    let value = true;
    for (let user in users) {
      if (users[user].email === email) {
        value = false;
      }
    }
    return value;
}
  
//gives object of urls that belong to a user
  function urlsForUser(id, urlDatabase) {
    let urlDBForUser = {};
    for (let url in urlDatabase) {
      if (urlDatabase[url].userID === id) {
        urlDBForUser[url] = urlDatabase[url];
      }
    }
    return urlDBForUser;
  }

module.exports= {generateRandomString, emailLookup, urlsForUser};
  