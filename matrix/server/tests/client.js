const io = require('socket.io-client');
const client = "ws://localhost:1337";
//const client = "192.168.0.106:3000";

const socket = io(client);

console.log('init connect');
socket.on("connection", function (){
	console.log('hi');
})

