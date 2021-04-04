const express = require('express');
const app = express();
const PORT = 8080;
const crypto = require('crypto');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const { generateRandomString, emailLookup, urlsForUser } = require('./helpers');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(methodOverride('_method'))
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
  res.redirect('/urls');
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

//GET urls_new to add new URL for user
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

//POST new url into database and redirect to GET /urls
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

//GET urls_show to allow for 
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

//Edit button to PUT new URL
app.put("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if (!req.session.user_id || urlDatabase[shortURL].userID !== req.session.user_id) {
    res.status(403).send("not authorized");
  } else {
    let newLongURL = req.body.newLongURL;
    urlDatabase[shortURL].longURL = newLongURL;
    res.redirect('/urls');
  }
});

//When shortURL used, send to longURL
app.get('/u/:shortURL', (req,res)=>{
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//DELETE URL
app.delete('/urls/:shortURL/delete', (req,res) => {
  let shortURL = req.params.shortURL;
  if (!req.session.user_id || urlDatabase[shortURL].userID !== req.session.user_id) {
    res.status(403).send("not authorized");
  } else {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});

//user logout
app.post('/logout', (req, res)=>{
  req.session = null;
  res.redirect('/urls');
});

//send to register page
app.get('/register',(req,res)=>{
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render('user_register', templateVars);
});

//register new user
app.post('/register', (req, res)=>{
  let email = req.body.email;
  let password = bcrypt.hashSync(req.body.password, 10);
  if (!email || !password) {
    res.status(400)
      .send("Bad Request 400");
  } else if (emailLookup(email,users)) {
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

//send user to login page
app.get('/login', (req,res)=>{
  let templateVars = {
    user: users[req.session.user_id]
  };
  res.render('user_login', templateVars);
});

//login user
app.post('/login', (req,res)=>{
  let email = req.body.email;
  let password = req.body.password;
  let userID = emailLookup(email, users);
  if (!userID) {
    res.status(403).send("error 403");
  } else {
        if (bcrypt.compareSync(password, users[userID].password)) {
          req.session.user_id = userID;
            res.redirect("/urls");
        } else {
          res.status(403).send("error 403. Wrong password.");
        }
      }
});

app.listen(PORT, ()=>{
  console.log(`example app listening on ${PORT}`);
});