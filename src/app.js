require('dotenv').config()
const firebase = require('firebase')
const express = require('express');
const routes = require('./routes')
const cors = require('cors')

var config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
}

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.cors = cors()
    firebase.initializeApp(config)
  }

  middlewares() {
    this.server.use(cors)
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes)
  }
}
module.exports = new App().server;