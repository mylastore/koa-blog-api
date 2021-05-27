
# koa-api

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

20 plots a day on an M1 with 16GB of RAM
``` bash
chia plots create -k 32 -b 3400 -n 7 -r 12 -t /Volumes/extreme1/1 -d /Volumes/extreme1/1
chia plots create -k 32 -b 3400 -n 7 -r 12 -t /Volumes/extreme2/1 -d /Volumes/extreme2/1

chia plots create -k 32 -b 3400 -n 8 -r 12 -t /Volumes/extreme1/2 -d /Volumes/extreme1/2
chia plots create -k 32 -b 3400 -n 8 -r 12 -t /Volumes/extreme2/2 -d /Volumes/extreme2/2
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
Private 

Copyright 2021 Oscar Quinteros

mrtonyq@gmail.com