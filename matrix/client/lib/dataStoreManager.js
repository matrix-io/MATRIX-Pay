const fs =  require('fs');
const _ = require('lodash');
const jsonFile = require('jsonfile');
//const MODELS = 'models.json';
//const STORAGE_PATH = '/home/pi/matrix-os/apps/server.matrix/storage/'; 
const MODELS = 'models.json';
const STORAGE_PATH = './storage/';

/*	User profiles:
	{
		email1 : {},
		email2: {},

	}
*/


function init(){
	// create models.json if it doesn't exist;
	let fd;
	fd = fs.openSync(STORAGE_PATH+MODELS, 'w');
	fs.closeSync(fd)
};

function createCreditCard(email, pin, cvc, expMonth, expDay, ccName) {
	// ... dont judge me
	if( _.isUndefined(pin)      ||
		_.isUndefined(cvc)      ||
		_.isUndefined(expMonth) ||
		_.isUndefined(expDay)   ||
		_.isUndefined(ccName)	
	){
		console.log('invalid user parameters')
		return;
	}		
	return {
		email: email.toLowerCase(),
		pin: pin,
		cvc: cvc,
		ccName: ccName,
		expDay: expDay,
		expMonth: expMonth
	};
}

// nameModelPair: {'name', 'model'};
function writeDB(userInfo){

	if(_.isUndefined(userInfo) || typeof(userInfo) !== 'object'){
		console.error('undefined info!');
		return;
	}

	let jsonBuffer = list();
	jsonBuffer[jsonBuffer.length] = userInfo;
	console.log(jsonBuffer);
	jsonFile.writeFileSync(STORAGE_PATH+MODELS, jsonBuffer);

	return;
};

// returns an array of objs [{'name', 'model'}]
function list(){

	return JSON.parse(fs.readFileSync(STORAGE_PATH+MODELS));

}
// returns bool on existence of an email 
function exists(userEmail){	
	if(typeof(userEmail) !== 'string'){
		console.log('needs to be a string');
	}

	let currentUsers = list();
	let isExists = false;
	_.each(currentUsers, (currentUser)=>{
			
		if(userEmail.toLowerCase() == currentUser.email){
		
			isExists = true;
		}
	});
	return isExists;
};

module.exports = {
	init: init,
	addUser: writeDB,
	exists: exists,
	createCreditCard: createUser
}
