$(function(){
    var socket = io.connect();
    var $messageform = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');
    var $users =$('#users');
    var $username = '';
    var $window = $('html');
    var $userList = ('#userList');
    
    

    $messageform.submit(function(e){
        e.preventDefault();
        socket.emit('send message', $message.val());
        $message.val('');
    });



    socket.on('new message', function(data){
        $chat.append('<div class="well"><strong>'+data.user+': </strong>'+data.msg+'</div>');
    });

    socket.on('get users', function(data){
        var html='';
        for(i = 0;i < data.length;i++){
            html += '<li class="list-group-item">'+data[i]+'</li>';
        }
        $users.html(html);
    });

    window.onload= newUser();
    
    function newUser(){
        $username = '' + Math.random().toString(36).substr(2, 9);
        console.log('%s',$username);
        socket.emit('new user', $username, function(data){
        });
        document.getElementById("who").innerHTML = "You are: " + $username;
        $username='';
    }

});