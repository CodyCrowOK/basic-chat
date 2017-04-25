const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const words = require('an-array-of-english-words');

let users = {};

const getName = () => {
	return words[Math.floor(Math.random() * words.length)];
};

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', (req, res) => {
	res.sendFile(__dirname + '/style.css');
});

http.listen(3000, () => {
	console.log('listening on port 3000');
});

io.on('connection', socket => {
	users[socket.id] = getName();

	console.log(`${users[socket.id]} joined.`)

	io.sockets.emit('update', users[socket.id] + ' has joined.');
	io.sockets.emit('users', users);

	socket.on('message', msg => {
		io.emit('message', `<b>${users[socket.id]}:</b> ${msg}`);
	});

	socket.on('disconnect', () => {
		console.log(`${users[socket.id]} left.`);
		io.sockets.emit('update', users[socket.id] + ' has left.');
		delete users[socket.id];
		io.sockets.emit('users', users);
	});
});
