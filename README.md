# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (sort of a very simple copy of bit.ly). This small project uses Bootsrap for front end.

## Final Product
When signed in, the user can view their own shortURLs on their homepage.
!["Home Screen"](https://github.com/DOwdev/tinyapp/blob/master/docs/urls_home.png)

If visiting as a guest user, the user will be invited to login or
!["User Login"](https://github.com/DOwdev/tinyapp/blob/master/docs/user_login.png)

sign in.
!["User Signin"](https://github.com/DOwdev/tinyapp/blob/master/docs/user_register.png)

Once logged in, the authenticated user is able to delete, modify, and create new shortURLs
!["URL Edit"](https://github.com/DOwdev/tinyapp/blob/master/docs/urls_edit.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.