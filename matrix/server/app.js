const db = require('./lib/dataStoreManager.js');
const visaPay = require('./lib/visa_pay.js');
const leds = require('./lib/led.js');
const _ = require('lodash');
const io = require('socket.io')();
const port = 1337;

// testing db

//let testUser = db.createUser(
		//"Jorge.castillo@admobilize.com",
		//1234,
		//1234,
		//11,
		//30,
		//"Jorge M. Castillo"
//);

//let testUser = db.createUser(
		//"wow@gmail.com",
		//3333,
		//4444,
		//20,
		//10,
		//"Wow M castillo"
//);
//db.addUser(testUser);
//db.list();
// Server will listen for two requests: Register and Pay 

io.on('connection', (client) => {
	console.log('CONNECTED');
	console.log(client);
	//leds.spoke(90);

	//client.on('registerRequest', (userInfo) => {

		//if(_.isUndefined(userInfo)){

			//client.emit('Success', false);
			//leds.error();

		//}
		
		//// check if user is already in DB
		//if(db.exists(userInfo.email)){
		
			//client.emit('registerFailure', false); 
			//leds.error();
		
		//}else{
			
			//db.addUser(userInfo);
			//client.on('ready', ()=> {

				//client.emit('registerSuccess', true);
				
			//});

			//leds.success();
		//}
	//});

	//client.on('paymentRequest', () =>{
			
	//});
});

io.listen(port);
