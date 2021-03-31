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

function emailLookup(email){
    let value = true;
    for(let user in users){
        if(users[user].email === email){
            value = false;
        }
    }
    return value;
};


const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

const users = { 
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
  }

app.get('/', (requ,res)=>{
    res.send('hello!');
});

app.get("/urls", (req, res) => {
    const templateVars = { 
        user: users[req.cookies["user_id"]],
        urls: urlDatabase
    };
  res.render("urls_index", templateVars);
  });

app.get("/urls/new", (req,res)=>{
    const templateVars = { 
        user: users[req.cookies["user_id"]],
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
       user: users[req.cookies["user_id"]]
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

 app.post('/logout', (req, res)=>{
     res.clearCookie('user_id');
     res.redirect('/urls');
 })

 app.get('/register',(req,res)=>{
    const templateVars = { 
        user: users[req.cookies["user_id"]]
    };
     res.render('user_register', templateVars);
 })

app.post('/register', (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;
    if(!email || !password){
        res.status(400)
        .send("Bad Request 400");
    } else if(!emailLookup(email)){
        res.status(400)
        .send("Bad Request 400, email already in use");
    }else{
    let id = generateRandomString();
    let newUser ={
        id,
        email,
        password
    }
    users[id] = newUser;
    res
    .cookie('user_id', id)
    .redirect("/urls");
}
})

app.get('/login', (req,res)=>{
    let templateVars = {
        user: users[req.cookies["user_id"]]
    }
    res.render('user_login', templateVars);
})

app.post('/login', (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    if(emailLookup(email)){
        res.status(403).send("error 403");
    }else{
        for(let user in users){
            if(users[user].email === email){
                if(users[user].password === password){
                    res
                    .cookie('user_id', users[user].id)
                    .redirect("/urls"); 
                } else{
                    res.status(403).send("error 403. Wrong password.");
                }
            }
        }
        
    }
})

app.get('/urls.json', (req,res)=>{

    res.json(urlDatabase);
});

app.listen(PORT, ()=>{
    console.log(`example app listening on ${PORT}`)
});