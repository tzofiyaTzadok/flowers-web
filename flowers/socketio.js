socket_io = require('socket.io')
const Message = require('./model')("Message");


module.exports = function(server) {
	var io = socket_io(server);
	io.on('connection', function(socket){
			socket.on('username', function(msg){
				console.log("username " + msg);
		    socket.username = msg;
	  	});
		  socket.on('chat message', async function(data){
		  	let message = {username:socket.username, msg:data.msg, date:data.date};
		    try {
		  		await Message.create(message);
		        console.log("Message created");
		    } catch (err) {
		        console.log("Message created error")
		    }
		    io.emit('chat message', message);
		  });
	});
}