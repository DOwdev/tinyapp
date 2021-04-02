const express = require('express');
const app = express();
const PORT = 8080;
const crypto = require('crypto');
let cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { generateRandomString, emailLookup, urlsForUser } = require('./helpers');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }));

app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$qMcr7jJ77yZPb0F1KzRuZevd2rOrCxFozGjgR0dU1KZKVhuFoUMtq"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$qMcr7jJ77yZPb0F1KzRuZevd2rOrCxFozGjgR0dU1KZKVhuFoUMtq"
  }
};

app.get('/', (req,res)=>{
  res.send('hello!');
});

app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    let newDB = urlsForUser(req.session.user_id, urlDatabase);
    const templateVars = {
      user: users[req.session.user_id],
      urls: newDB
    };
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req,res)=>{
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    const templateVars = {
      user: users[req.session.user_id],
    };
    res.render("urls_new", templateVars);
  }
});

app.post("/urls", (req,res)=>{
  if (!req.session.user_id) {
    res.status(403).send("not authorized");
  } else {
    let id = generateRandomString();
    urlDatabase[id] = {
      longURL: req.body.longURL,
      userID: req.session.user_id
    };
    res.redirect(`/urls/${id}`);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  if (!req.session.user_id || urlDatabase[shortURL].userID !== req.session.user_id) {
    res.status(403).send("not authorized");
  } else {
    const templateVars = {
      shortURL,
      longURL,
      user: users[req.session.user_id]
    };
    res.render("urls_show", templateVars);
  }
});

app.post("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if (!req.session.user_id || urlDatabase[shortURL].userID !== req.session.user_id) {
    res.status(403).send("not authorized");
  } else {
    let newLongURL = req.body.newLongURL;
    urlDatabase[shortURL].longURL = newLongURL;
    res.redirect('/urls');
  }
});

app.get('/u/:shortURL', (req,res)=>{
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req,res) => {
  let shortURL = req.params.shortURL;
  if (!req.session.user_id || urlDatabase[shortURL].userID !== req.session.user_id) {
    res.status(403).send("not authorized");
  } else {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

app.post('/logout', (req, res)=>{
  req.session = null;
  res.redirect('/urls');
});

app.get('/register',(req,res)=>{
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render('user_register', templateVars);
});

app.post('/register', (req, res)=>{
  let email = req.body.email;
  let password = bcrypt.hashSync(req.body.password, 10);
  if (!email || !password) {
    res.status(400)
      .send("Bad Request 400");
  } else if (!emailLookup(email,users)) {
    res.status(400)
      .send("Bad Request 400, email already in use");
  } else {
    let id = generateRandomString();
    let newUser = {
      id,
      email,
      password
    };
    users[id] = newUser;
    req.session.user_id = id
      res.redirect("/urls");
  }
});

app.get('/login', (req,res)=>{
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render('user_login', templateVars);
});

app.post('/login', (req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  if (emailLookup(email, users)) {
    res.status(403).send("error 403");
  } else {
    for (let user in users) {
      if (users[user].email === email) {
        if (bcrypt.compareSync(password, users[user].password)) {
          req.session.user_id = users[user].id;
            res.redirect("/urls");
        } else {
          res.status(403).send("error 403. Wrong password.");
        }
      }
    }
        
  }
});

app.get('/urls.json', (req,res)=>{

  res.json(urlDatabase);
});

app.get('/users.json', (req,res)=>{

    res.json(users);
  });

app.listen(PORT, ()=>{
  console.log(`example app listening on ${PORT}`);
});