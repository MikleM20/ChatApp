var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('server ran');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


app.get('/style.css', function(req, res){
    res.sendFile(__dirname + '/style.css');
});

app.get('/script.js', function(req, res){
    res.sendFile(__dirname + '/script.js');
});

io.sockets.on('connection', function(socket, callback){
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);    

    //disconnect
    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: %s sockets connected", connections.length);
    });

    //Send Message
    socket.on('send message', function(data){
        
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    //New User
    socket.on('new user', function(data,callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
    
});