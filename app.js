var express = require('express');
var app = module.exports = express.createServer();
var stdin = process.stdin;

var clients = new Array();
var i=0, k=0, m=0;
var flag=true;
var way=true;

// Parameters
var msg="HI TESTING ";
var timeColor=200;
var timeMsg=800;

// Handle type
stdin.resume();
stdin.on('data', function() {
  if(flag) {
    flag=false;
    setInterval(function(){
      if(way) {
        if(i<clients.length) {
          if(i!=0)
            clients[i-1].emit('msg', {color: '#fff'}); 
          clients[i].emit('msg', {color: '#ff0000'}); 
          i++;
        } else {
          i=clients.length-1;
          way=false;
        }
      } else {
        if(i>0) {
          clients[i].emit('msg', {color: '#fff'}); 
          clients[i-1].emit('msg', {color: '#ff0000'}); 
          i--;
        } else {
          way=true;
        }
      }
    }, timeColor);
    setInterval(function(){
    if(m<clients.length) {
        if(k<msg.length) {
            clients[m].emit('letter', {string: msg[k]}); 
            m++; k++;
          } else {
            k=0;
          }
        }
    }, timeMsg);
  }
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


// IO
var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
  if(flag) {
    clients.push(socket);
  	socket.on('disconnect', function(){
      clients.splice(clients.indexOf(socket),1);
  	});
  }
});

// Routes
app.get('/', function(req, res){
  if(flag)
    res.render('index', {
      title: 'Experiment 1'
    });
  else
    res.render('late', {
      title: 'Too Late :('
    });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
