// Add this at the very top
process.chdir(__dirname + '/../../backend');

const serverless = require('serverless-http');
const app = require('../../backend/server');

module.exports.handler = serverless(app);
