var ipport = prompt("port");
var con = document.createElement('script');
con.src = "http://"+'localhost:'+ipport+"/socket.io/socket.io.js"
document.body.appendChild(con);

function startconnection(){
    (function($){
    var socket = io.connect('http://'+'localhost:'+ipport);
    var carac = ["\'", "\"" ,"$" ,"\`" , "\\", " "];

    $('#nameForm').submit(function(event){
        event.preventDefault();
        if ($('#t-nom').val() == ""){
            socket.emit('login', 'invité');
            return;
        }
        if($('#t-nom').val().length > 30){
            alert("Votre taille de pseudo ne dois pas dépasser 30 caractères");
            return;
        }
        for(var letter of $('#t-nom').val()){
            if(carac.includes(letter)){
                alert("Ces caractères sont interdit :\n$  \'  \"  \`  \\ espace");
                return;
            }
        }
        var elements = document.getElementsByClassName('username')
        for(var user of elements){
            if ("user-"+$('#t-nom').val() == user.id){
                alert("Pseudo déjà pris");
                return;
            }
        };
        socket.emit('login', $('#t-nom').val());
    });

    socket.on('newUser',function(user){
        if($('#user-'+user.oldPseudo) != undefined){
            $('#user-'+user.oldPseudo).remove();
        }
        $('#list_part').append('<li id=\"user-' + user.pseudo + '\" class="username">' + user.pseudo + "</li>")
    });
    socket.on('delUser',function(user){
        if($('#user-'+user) != undefined){
            $('#user-'+user).remove();
        }
    });

    $('#msgForm').submit(function(event){
        event.preventDefault();
        if($('#t-entre').val() != ""){
            $('#chat_box').append('<div class="chat_bubble chat_bubble-right">' + $('#t-entre').val() + '</div>');
            socket.emit('sendMsg', $('#t-entre').val());
            $('#t-entre').attr('value', "");
        }
    });

    socket.on('servMsg',function(message){
        $('#chat_box').append('<p class="chat_bubble_name">' + message.name + '</p><div class="chat_bubble chat_bubble-left">' + message.msg + '</div>\n');
    });

    })(jQuery);
}