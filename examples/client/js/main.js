$(function() {
    var messageTemplate = "<img src='{{ avatar }}'> From: {{ name }} <br />{{ message }}";

    var nameInput = $('#inputName'),
        emailInput = $('#inputEmail'),
        messageInput = $('#inputMessage'),
        messageOutput = $('#messageOut');

    var addMessage = function(message, fadeIn) {
        var html = Mustache.render(messageTemplate, message);
        
        var div = document.createElement('div');
        div.innerHTML = html;
        
        if (fadeIn) {
            div.style.display = 'none';
        }
        
        messageOutput.prepend(div);
        
        if (fadeIn) {
            $(div).slideDown('800');
        }
    };

    var socket = io.connect(window.location.origin);
    socket.on('history', function(history) {
        for(var i = 0; i < history.length; i++) {
            addMessage(history[i], false);
        }
    });
    socket.on('message', function(message) {
        addMessage(message, true);
    });
    
    $('button').click(function() {
        // retrieve data from input fields and send it to server
        socket.emit('message', {
            name: nameInput.val(),
            email: emailInput.val(),
            message: messageInput.val()
        });
        
        // we are done, clear the message input field and disable name and email
        messageInput.val('');
        nameInput.attr('disabled', 'disabled');
        emailInput.attr('disabled', 'disabled');
        
        // return false to stop form submission
        return false;
    });
});
