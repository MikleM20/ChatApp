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
    
    
    //User sends message or commands
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

    //Prints own message in bold and in italic
    socket.on('own message', function(data){
        time = calcTime('Calgary', -6);
        $chat.append('<div id="msg"><h6>'+time+'</h6><strong style="color:'+data.nameCol+'">'+data.user+'</strong>: <strong><i>'+data.msg+'</i></strong></div>');
    });

    //Prints other user's message
    socket.on('new message', function(data){
        time = calcTime('Calgary', -6);
        $chat.append('<div id="msg"><h6>'+time+'</h6><strong style="color:'+data.nameCol+'">'+data.user+': </strong>'+data.msg+'</div>');
    });

    //Tells user who tried to change name that it is taken
    socket.on('name feedback', function(data){
        $chat.append('<div id="msg"><strong>The name '+data.desired+' is taken your username is still '+data.user+'.</strong></div>');
    });

    //Tells all users if someone changed their name
    socket.on('name changed', function(data){
        $chat.append('<div id="msg"><strong>'+data.user+'changed their name to '+data.desired+'.</strong></div>');
    });

    //Tells user that namecolow will change from here on
    socket.on('color changed', function(data){
        $chat.append('<div id="msg">Your name will now show as <strong style="color:'+data.desired+'">THIS </strong> color.</strong></div>');
    });

    //Tell someone they connected
    socket.on('you joined', function(data){
        $chat.append('<div id="msg"><strong style="color:green">You Connected</strong></div>');
    });

    //Tells others that someone connected
    socket.on('someone joined', function(data){
        $chat.append('<div id="msg"><strong style="color:green">'+data.user+' Connected</strong></div>');
    });

    //Updats the user list
    socket.on('get users', function(data){
        let html='';
        for(i = 0;i <data.length;i++){
            console.log(data.length);
            html += '<li class="list-group-item">'+data[i]+'</li>';
        }
        $users.html(html);
    });

    //Once user loads page
    window.onload= newUser();

    //Get timestamp
    function calcTime(city, offset) {
        
        let d = new Date();
        let utc = d.getTime() + (d.getTimezoneOffset() * 60000);    
        let nd = new Date(utc + (3600000*offset));
    
        return nd.toLocaleString();
    }
    
    //Make random username
    function newUser(){
        $username = '' + Math.random().toString(36).substr(2, 9);
        console.log('%s',$username);
        socket.emit('new user', $username, function(data){
            document.getElementById("who").innerHTML = "" + $username;
        });
    }

});