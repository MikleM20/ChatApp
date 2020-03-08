$(function(){
    var socket = io.connect();
    var $messageform = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');
    var $users =$('#users');
    var $username = '';
    var $window = $('html');
    var $userList = ('#userList');
    var time;
    var currentUser = document.getElementById("who").innerHTML;
    
    

    $messageform.submit(function(e){
        e.preventDefault();
        if($message.val().includes("/nickcolor")){
            var splitCommand = $message.val().split(" ");
            var desiredColor = "#"+splitCommand[1];
            console.log(desiredColor);
            socket.emit('change color', desiredColor);
        }
        else{
            socket.emit('send message', $message.val());
        }
        $message.val('');
    });

    socket.on('own message', function(data){
        time = calcTime('Calgary', -6);
        $chat.append('<div class="well"><h6>'+time+'</h6><strong style="color:'+data.nameCol+'">'+data.user+'</strong>: <strong>'+data.msg+'</strong></div>');
    });

    socket.on('new message', function(data){
        time = calcTime('Calgary', -6);
        $chat.append('<div class="well"><h6>'+time+'</h6><strong style="color:'+data.nameCol+'">'+data.user+': </strong>'+data.msg+'</div>');
    });

    socket.on('get users', function(data){
        var html='';
        for(i = 0;i <data.length;i++){
            console.log(data.length);
            html += '<li class="list-group-item">'+data[i]+'</li>';
        }
        $users.html(html);
    });

    window.onload= newUser();

    function calcTime(city, offset) {
        
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);    
        var nd = new Date(utc + (3600000*offset));
    
        return nd.toLocaleString();
    }
    
    function newUser(){
        $username = '' + Math.random().toString(36).substr(2, 9);
        console.log('%s',$username);
        socket.emit('new user', $username, function(data){
            document.getElementById("who").innerHTML = "" + $username;
        });
        //$username='';
    }

});