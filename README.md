<p align="center">
  <a href="http://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-text="KoaJS starter boilerplate with full user authentication. " data-url="https://github.com/mylastore/koa-blog-api" data-lang="en" data-show-count="false">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</p>

# koa-api
This is a starter boilerplate inspired by the famous [hackathon-stater](https://github.com/sahat/hackathon-starter) and [koa-vue-notes-api](https://github.com/johndatserakis/koa-vue-notes-api),  built using [Koa](http://koajs.com/) (2.5.1) as the backend and [Svelte](https://svelte.dev/) (3.17.1) as the frontend. Click [here](https://github.com/mylastore/svelte-boilerplate) to see the frontend svelte.js on github. I choose Koa and Svelte both for speed.

## Example front end live app
Click [here](https://sveltekit.mylastore.com/) to view the app live.


## Features
- Koa 2.13.0
- Fully written using async/await & Classes
- Koa-Router
- Koa-Ratelimit with Redis
- Koa-Bodyparser
- KCors
- Koa-Json-Error for JSON requests/responses
- Koa-Useragent to get client user-agent data
- Bcrypt
- Sendgrid for emails
- JWT
- Nodemon for running in development
- Babel
- PM2 for running in production
- MongoDB with Mongoose (mongoose validation)
- Seed data for testing app
- TODO - testing
- log4js for logging
- Password recover system with token
- Multi user blog 
- Image handling with sharp(converting everything to webp)

## Installing / Getting started
Important: use .env for all production credentials
Make sure you have redis up and running for rate limiting to work.

``` bash
# install dependencies
npm install

# Development with nodemon with hot reload
npm start

# build for production with prettier and babel
npm run build

# serve in production using the pm2 ecosystem.json file
npm run production

# run prettier on the project
npm run pretty

# run tests
npm run test

# Rund seed data !important will rewrite your MongoDB data and delete all uploaded images##
npm run seed
```

## General Information

Example data: users (with roles) and blogs.

API has a fleshed-out user login/signup/forgot/reset authentication/email verification system using JWT.

### User Authentication Process

User authentication process:

- User creates an account
- User verifies email
- User logs in
- The server sends and `accessToken`
- We take the `accessToken` and decode it using `jwt-decode`. This gets us the logged in user's information. Then we store the `accessToken`
- Each protected endpoint will be expecting you to attach the `accessToken` 

### PM2

This project features an `ecosystem.json` file that is the target of the PM2 implementation in production.

The `src` folder is the heart of the program.

#### Note

You will need to make sure you have redis running (for the rate-limiter). Or if you prefer to remove or disable, the 
code is located in the index.js

### controllers

We use controllers to keep our router thin. 

The controller's responsibility is to manage the request body and make sure it's nice and clean when it eventually

gets sent to a `model` to make database calls.

### db

MongoDB with Mongoose for speed and fairly easy to used.

### middleware

The custom middleware we're using is based on the `koa-jwt` library.

### models

Our models folder where database calls are made and validation is performed

### routes

This is where we do authentication for restricted URL

### index.js

index.js it's the brain of the app.

### Testing

Jest for testing WORK IN PROGRESS - TODO 

## License
Copyright 2021 Oscar Quinteros

[MIT](http://opensource.org/licenses/MIT)