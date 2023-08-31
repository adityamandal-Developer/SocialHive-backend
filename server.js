const http = require('http');
const express = require('express');

//server
const app = express();
const server = http.createServer(app);
//start the server
const PORT = process.env.PORT || 9080
server.listen(PORT, console.log(`server is running on port ${PORT}`))