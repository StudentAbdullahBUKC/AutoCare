const serverless = require('serverless-http');
const app = require('../../backend/server'); // points to your server.js

module.exports.handler = serverless(app);