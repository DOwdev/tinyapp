const express = require('express');
const app = express();
const PORT = 8080;
const crypto = require('crypto');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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
    const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
  });

app.get("/urls/new", (req,res)=>{
    res.render("urls_new");
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
       longURL
   }
   res.render("urls_show", templateVars);
  });

 app.get('/u/:shortURL', (req,res)=>{
    let shortURL = req.params.shortURL;
    let longURL = urlDatabase[shortURL];
    res.redirect(longURL);
 }) 

 app.post('/urls/:shortURL/delete', (req,res) => {
    let shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
    res.redirect("/urls");
 })

app.get('/urls.json', (req,res)=>{
    res.json(urlDatabase);
});

app.listen(PORT, ()=>{
    console.log(`example app listening on ${PORT}`)
});