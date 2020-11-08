'use strict'

require('dotenv').config()

const env = 'development'
const port = process.env.PORT
const src = env === 'production' ? './build/index' : './src/index'

require('babel-polyfill')
if (env === 'development') { require('babel-register')}

const app = require(src).default

//Here we're assigning the server to a variable because
//we're going to want to manually rip down the server in testing
const server = app.listen(port)
console.log('http://localhost:' + port)
console.log("Running in "  + process.env.NODE_ENV + " v" + process.env.NPM_PACKAGE_VERSION)

//Exporting the actual server here for testing availability
module.exports = {server: server}