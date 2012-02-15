var port = 8080;

// start up a simple HTTP server and serve static files
var nodeStatic = require('node-static'),
        fileServer = new(nodeStatic.Server)('./public');

var httpServer = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    });
});
httpServer.listen(port);

// use socket io to push information to clients
var io = require('socket.io').listen(httpServer),
        gravatar = require('gravatar'), // used for some cool avatars
        history = []; // history of all messages

io.sockets.on('connection', function (socket) {
    socket.emit('history', history);
  
    socket.on('message', function (message) {
        var outputMessage = {
            name: message.name,
            avatar: gravatar.url(message.email, {s: 48, d: 'wavatar', r: 'g'}),
            message: message.message
        };
    
        history.push(outputMessage);
        socket.broadcast.emit('message', outputMessage);
        // I'm also sending it back to the client to save some time during the
        // presentation.
        socket.emit('message', outputMessage);
    });
});
