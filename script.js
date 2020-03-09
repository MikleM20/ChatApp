$(function(){
    let socket = io.connect();
    let $messageform = $('#messageForm');
    let $message = $('#message');
    let $chat = $('#chat');
    let $users =$('#users');
    let $username = '';
    let $window = $('html');
    let $userList = ('#userList');
    let time;
    let currentUser = document.getElementById("who").innerHTML;
    
    

    $messageform.submit(function(e){
        e.preventDefault();
        if($message.val().includes("/nickcolor")){
            let splitCommand = $message.val().split(" ");
            let desiredColor = "#"+splitCommand[1];
            console.log(desiredColor);
            socket.emit('change color', desiredColor);
        }
        else if($message.val().includes("/nick ")){
            let splitCommand = $message.val().split(" ");
            let desiredName = "";
            for(i=1; i<splitCommand.length;i++){
                desiredName = desiredName + splitCommand[i];
            }
            console.log(desiredName);
            socket.emit('change name', desiredName);
            document.getElementById("who").innerHTML = "" + desiredName;
        }
        else{
            socket.emit('send message', $message.val());
        }
        $message.val('');
    });

    socket.on('own message', function(data){
        time = calcTime('Calgary', -6);
        $chat.append('<div id="msg"><h6>'+time+'</h6><strong style="color:'+data.nameCol+'">'+data.user+'</strong>: <strong>'+data.msg+'</strong></div>');
    });

    socket.on('new message', function(data){
        time = calcTime('Calgary', -6);
        $chat.append('<div id="msg"><h6>'+time+'</h6><strong style="color:'+data.nameCol+'">'+data.user+': </strong>'+data.msg+'</div>');
    });

    socket.on('name feedback', function(data){
        $chat.append('<div id="msg"><strong>The name '+data.desired+' is taken your username is still '+data.user+'.</strong></div>');
    });

    socket.on('name changed', function(data){
        $chat.append('<div id="msg"><strong>'+data.user+'changed their name to '+data.desired+'.</strong></div>');
    });

    socket.on('color changed', function(data){
        $chat.append('<div id="msg">Your name will now show as <strong style="color:'+data.desired+'">THIS </strong> color.</strong></div>');
    });

    socket.on('get users', function(data){
        let html='';
        for(i = 0;i <data.length;i++){
            console.log(data.length);
            html += '<li class="list-group-item">'+data[i]+'</li>';
        }
        $users.html(html);
    });

    window.onload= newUser();

    function calcTime(city, offset) {
        
        let d = new Date();
        let utc = d.getTime() + (d.getTimezoneOffset() * 60000);    
        let nd = new Date(utc + (3600000*offset));
    
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