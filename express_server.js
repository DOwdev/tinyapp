const express = require('express');
const app = express();
const PORT = 8080;
const crypto = require('crypto');
let cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

app.set("view engine", "ejs");

//helper function ->  will move later
function generateRandomString(){
    let id = crypto.randomBytes(3).toString('hex');
    return id;
};


const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

app.get('/', (requ,res)=>{
    res.send('hello!');
});

app.get("/urls", (req, res) => {
    const templateVars = { 
        username: req.cookies["username"],
        urls: urlDatabase
    };
  res.render("urls_index", templateVars);
  });

app.get("/urls/new", (req,res)=>{
    const templateVars = { 
        username: req.cookies["username"],
    };
    res.render("urls_new", templateVars);
});

app.post("/urls", (req,res)=>{
    let id = generateRandomString();
    urlDatabase[id]=req.body.longURL;
    res.redirect(`/urls/${id}`);
});

app.get("/urls/:shortURL", (req, res) => {
   let shortURL = req.params.shortURL;
   let longURL = urlDatabase[shortURL];
   const templateVars = {
       shortURL,
       longURL,
        username: req.cookies["username"]
   };
   res.render("urls_show", templateVars);
  });

  app.post("/urls/:shortURL", (req, res) => {
    let shortURL = req.params.shortURL;
    let newLongURL = req.body.newLongURL;
    urlDatabase[shortURL] = newLongURL;
    res.redirect('/urls');
   });

 app.get('/u/:shortURL', (req,res)=>{
    let shortURL = req.params.shortURL;
    let longURL = urlDatabase[shortURL];
    res.redirect(longURL);
 }); 

 app.post('/urls/:shortURL/delete', (req,res) => {
    let shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect("/urls");
 });

 app.post('/login', (req,res)=>{
     let username = req.body.username;
     res
     .cookie('username', username)
     .redirect("/urls");
 })

 app.post('/logout', (req, res)=>{
     res.clearCookie('username');
     res.redirect('/urls');
 })

app.get('/urls.json', (req,res)=>{

    res.json(urlDatabase);
});

app.listen(PORT, ()=>{
    console.log(`example app listening on ${PORT}`)
});