/*
*Primary File for app for simple Helow World printing API
*/

//Module Initialization
var http = require('http');
var url  = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

//Server Creation
var server = http.createServer(function(req, res){

  //get the url and parse url
  var parseUrl = url.parse(req.url,true);

  //get the path
  var path = parseUrl.pathname;
  var trimedUrl = path.replace(/^\/+|\/+$/g,'');

  //get the http request method
  var method = req.method.toLowerCase();

  //get the query string as an Object
  var queryStringObject = parseUrl.query;

  //Get the headers as an Object
  var headers = req.headers;

  //Get the payloads if any
  var payLoadsDecoder = new StringDecoder('utf-8');
  var buffer = '';

  //appending Payloads to the empty 'buffer' string, if no data comes in buffer is going to an empty string
  req.on('data',function(data){
    buffer += payLoadsDecoder.write(data);
  });

  //on the end of request the response is send
  req.on('end',function(){
      buffer += payLoadsDecoder.end();

      //Constructing Data Object to send to the handlers
      var data = {
        'trimedPath' : trimedUrl,
        'method' : method,
        'queryStringObject' : queryStringObject,
        'headers' : headers,
        'payload' : buffer
      };

      //Chosing The different Handlers According to request
      var choseHandlers = typeof(router[trimedUrl]) !== 'undefined' ? router[trimedUrl] : handlers.undifined;

      //Sendeing Data Object to the chosen Handlers
      choseHandlers(data,function(statusCode,payload){
        //Chequing Status code is number or not! & default to 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        //Chequing payload is an object & defaults to Empty object
        payload = typeof(payload) == 'object' ? payload : {};

        //converting Object Payload to a String
        var payloadString = JSON.stringify(payload);

        //Writing statusCode to the response head
        res.writeHead(statusCode);
        //returning sring payload
        res.end(payloadString);

        //log the requested path
        console.log('The request is come with this things:\n',trimedUrl,'\n',method,'\n',queryStringObject,'\n',headers,'\n',payload);
      });
  });
});

//Defining handlers Object
var handlers = {};

//Hellow handler
handlers.hellow = function(data,callback){
  callback(403,{'Welcome' : 'Hellow, I am Suman Debnath. Welcome to NodeMasterClass HomeWork Assignment #1. Thank You For watching.'});
};
//Undifiend Handler
handlers.undifined = function(data,callback){
  callback(404,{'Error' : 'No data has been found!'});
};

handlers.home = function(data,callback){
  callback(200,{'Hellow' : 'This is Our Root! please visit /hellow for Welcome invitation'});
};

//Difining router
var router = {
  'hellow' : handlers.hellow,
  'home' : handlers.home
};

//Start server and listen on port 3000
server.listen(3000,function(){
  console.log('The server is listning on port 3000');
});
