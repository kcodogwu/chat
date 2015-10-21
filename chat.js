var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/js/vendor/jquery-1.11.3.min.js', function(req, res){
  res.sendFile(__dirname + '/public/js/vendor/jquery-1.11.3.min.js');
});

io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('subscribe', function (data) {
    console.log(data.user + ' joined room: ' + data.room);
    socket.join(data);
  });
  
  socket.on('send message', function (data) {
    var msg = new String(data.message);
    
    if (msg == null || msg == 'undefined') { return; }
    
    console.log(data.sender + ' is posting a message (' + msg + ') into room: ' + data.room);
    io.sockets.in(data.room).emit('chat message', { message: msg });
  });
  
  socket.on('disconnect', function () { 
    console.log('user disconnected'); 
  });
});