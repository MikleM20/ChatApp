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
        socket.broadcast.emit('new message', {msg: data, user: socket.username, nameCol: socket.color});
        socket.emit('own message', {msg: data, user: socket.username, nameCol: socket.color});
    });

    //New User
    socket.on('new user', function(data,callback){
        callback(true);
        socket.username = data;
        socket.color = '#000000';
        users.push(socket.username);
        console.log(users.length);
        updateUsernames();
    });

    //Change Nickname
    socket.on('change name', function(data){
        if(users.includes(data)){
            socket.emit('name feedback', {desired: data, user: socket.username});
        }
        else{
            //console.log("Initial name %s", socket.username);
            users.splice(users.indexOf(socket.username), 1, data);
            socket.broadcast.emit('name changed', {desired: data, user: socket.username});
            socket.emit('name changed', {desired: data, user: socket.username});
            socket.username = data;
            updateUsernames();
            //console.log("Name after %s", socket.username);
        }
    });

    //Change Nickname color when sending
    socket.on('change color', function(data){
        //console.log("Initial color %s", socket.color);
        socket.color = data;
        socket.emit('color changed', {desired: data});
        //console.log("Color after %s", socket.color);
    });

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
    
});