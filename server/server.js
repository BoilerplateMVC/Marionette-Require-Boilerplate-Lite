// DEPENDENCIES
// ============
var express = require("express"),
    http = require("http"),
    port = (process.env.PORT || 8001),
    server = module.exports = express();

// SERVER CONFIGURATION
// ====================
server.configure(function () {

    server.use(express["static"](__dirname + "/../public"));

    server.use(express.errorHandler({

        dumpExceptions:true,

        showStack:true

    }));

    server.use(server.router);
});

// SERVER
// ======

// Start Node.js Server
http.createServer(server).listen(port);

console.log('Welcome to MRB-Lite!\n\nPlease go to http://localhost:' + port + ' to start using Marionette, Require.js and Backbone.js');