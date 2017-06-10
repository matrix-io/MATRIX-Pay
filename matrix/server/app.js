const fs =  require('fs');
const _ = require('lodash');
const jsonFile = require('jsonfile');
//const MODELS = 'models.json';
//const STORAGE_PATH = '/home/pi/matrix-os/apps/server.matrix/storage/'; 
const MODELS = 'models.json';
const STORAGE_PATH = './storage/';

// create models.json if it doesn't exist;
let fd;
//try{

	//console.log('Checking : ' + STORAGE_PATH+MODELS);
	//fd = fs.openSync(STORAGE_PATH+MODELS, 'r');
	
//}catch(e){
	
	console.log('No models.json, creating...');
	fd = fs.openSync(STORAGE_PATH+MODELS, 'w');

//}


// TESTINGGGGGGGGGGGG DELETE THIS!!!!!!!
console.log('>>>>FLUSHING JSON STORE..,');
jsonFile.writeFileSync(STORAGE_PATH+MODELS, [] );


fs.closeSync(fd)
console.log(MODELS+' exists, ready to go!');

// testing section YA DIG!!
let name1 = 'jorge';
let model1 = _.range(40);

let name2 = 'daniel';
let model2 = _.range(-40);

// WRITE
console.log('\n WRITING SAMPLE PAIRS');
writeModel(name1,model1);
writeModel(name2,model2);
writeModel('DUDE',_.range(40));

// READ
//console.log('\n LISTING '+ MODELS);

//console.log(listModels());



function Profile(name, pin, age) {
	this.name = name;
	this.model =  
}

// nameModelPair: {'name', 'model'};
function writeModel(name, model){

	// CHECK MODELS.JSON EXISTS
	if(_.isUndefined(name) || _.isUndefined(model)){
		console.error('undefined model pair');
		return;
	}

	let pair = new NameModelPair(name,model)
	
	// UPDATE
	if(exists(pair)){
		console.log('Updating... ' + pair.name);
		//let models = listModels();
	}
	// APPEND
	else{
		console.log('Appending...' + pair.name);
		//jsonFile.writeFileSync(STORAGE_PATH+MODELS, pair, {flag: 'a'});
		let jsonBuffer = listModels();
		jsonBuffer[jsonBuffer.length] = pair;
		//console.log('current buffer:'+ jsonBuffer);
		jsonFile.writeFileSync(STORAGE_PATH+MODELS, jsonBuffer);
		console.log('current store:'+ listModels());	
		//let newBuffer = require(STORAGE_PATH+MODELS);
		//console.log('NEW BUFFER:'+newBuffer);
	}
	//console.log(pair);

	return;
};


// returns an array of objs [{'name', 'model'}]
function listModels(){

	return JSON.parse(fs.readFileSync(STORAGE_PATH+MODELS));

}
// returns bool on existence of pair 
function exists(pair){
	
	if(typeof(pair) !== 'object'){
		console.log('needs to be an must be of type NameModelPair');
	}

	//let modelsArray = listModels();
	let modelsArray = []

	_.each(modelsArray, (storedPair)=>{

		if(pair === storedPair){
			return true;
		}

	});

	return false;
};

