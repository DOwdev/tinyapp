const express = require('express');
const app = express();
const PORT = 8080;
const crypto = require('crypto');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//helper function ->  will move later
function generateRandomString(){
    let id = crypto.randomBytes(64).toString('hex');
    id = id.substring(0, 6);
    console.log(id);
    return id;
}
generateRandomString();

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
    console.log(req.body);
    res.send('ok');
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

app.get('/urls.json', (req,res)=>{
    res.json(urlDatabase);
});

app.listen(PORT, ()=>{
    console.log(`example app listening on ${PORT}`)
});