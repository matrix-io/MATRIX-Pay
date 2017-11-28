//initial variables
const fs = require('fs');
const io = require('socket.io')();
const fr =  require('./lib/faceRecog.js');
const visaPay = require('./lib/visa_pay.js');


console.log(fr);
//console.log(db);
//////////////////////////
/// User Data Storage
//////////////////////////
//create a writable json file
// reads and saves to json file
var user_sec = [];
function readData() {
    console.log('reading data...');
    return JSON.parse(fs.readFileSync(__dirname+'/userDatabase.json', 'utf8'));//read json file    
    
}
function readSecurity() {
    console.log('reading sec..');
    return JSON.parse(fs.readFileSync(__dirname+'/security.json', 'utf8'));//read json file    
}

var userDatabase = readData();
var current_email = '';
var userSecurity = readSecurity();

//save changes made to database
function saveData(){
    console.log('saving data...');
    fs.writeFileSync(__dirname+'/userDatabase.json',JSON.stringify(userDatabase,null,2) ,'utf8');
}
function saveSecurity(){
    console.log('saving sec...');
    fs.writeFileSync(__dirname+'/security.json',JSON.stringify(user_sec,null,2) ,'utf8');
}

//////////////////////////
/// SOCKET.IO
//////////////////////////
//on connection
io.on('connection', function(client) {

    console.log('user connected');
    console.log(readData());
    console.log(readSecurity());
    //obtain user email to begin database registration
    client.on('RegisterRequest', function(user_email){

        //if training passed
        current_email = user_email;
        fr.trainFace(current_email, ()=>{
        	client.emit('RegisterResult', 0);	
        });
        // response codes : 0 => success , 1 => email in use, 2 => server error
    });
    //obtain credit card info
    var user_info = {};
    //user_sec.push(userSecurity);
    client.on('UserInfo',function(data){
        console.log("This is dataaaaaaa" + JSON.stringify(data));
        userDatabase[current_email] = data;
        saveData();
        console.log(readData());
        userSecurity = data.security
        saveSecurity();
        console.log(readSecurity());
        user_info = data;
        user_sec.push(userSecurity);
        console.log(user_sec);
        saveSecurity();
    });

    //attempt to make a transaction
    client.on('PaymentRequest',function(price, security){
        price = price / 100;
        console.log('security: ' + security);
        console.log(user_sec);
        //check if user face validates result : bool(true = pass) (false = fail)
        if(!user_sec.includes(security)){
            client.emit('PaymentResult', false)
            
        }
        else{
            fr.recognize(current_email, (result) =>{
                if(result){
                    client.emit('PaymentResult', true)
                    matrix.led('green').render();
        
                    setTimeout(function() {
                        matrix.led('black').render();
                    }, 2000);
                
                }
                else {
                    client.emit('PaymentResult', false)
                    matrix.led('red').render();
                    
                    setTimeout(function() {
                        matrix.led('black').render();
                    }, 2000);
                }    
            });
        }  
       
    });
    client.on('disconnect', function () {
        readData();
        readSecurity();
        saveData();
        saveSecurity();
        console.log('user disconnected');
    });
});

matrix.on('client1', function(){
    fr.reset('client1');
    userDatabase = '';
    saveData();
    userSecurity = '';
    saveSecurity();
});
matrix.on('client2', function(){
    fr.reset('client2');
    userDatabase = '';
    saveData();
    userSecurity = '';
    saveSecurity();
});
matrix.on('client3', function(){
    fr.reset('client3');
    userDatabase = '';
    saveData();
    userSecurity = '';
    saveSecurity();
});
matrix.on('listtags', function(){
    fr.listTags();
});
io.listen(3001);
console.log('server running');