//initial variables
const fs = require('fs');
const io = require('socket.io')();
const fr =  require('./lib/faceRecog.js');
//const db = require('./lib/dataStoreManager.js');
const visaPay = require('./lib/visa_pay.js');


console.log(fr);
//console.log(db);
//////////////////////////
/// User Data Storage
//////////////////////////
//create a writable json file

function readData() {
    return JSON.parse(fs.readFileSync(__dirname+'/userDatabase.json', 'utf8'));//read json file    
}



var userDatabase = readData();
var current_email = '';

//save changes made to database
function saveData(){
    fs.writeFileSync(__dirname+'/userDatabase.json',JSON.stringify(userDatabase,null,2) ,'utf8');
}

//////////////////////////
/// SOCKET.IO
//////////////////////////
//on connection
io.on('connection', function(client) {
    console.log('user connected');
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
    client.on('UserInfo',function(data){
    	/* 	
    	data
    		{
				security : number
				ccnum : string
				cccvc : number
				ccexpmon : number
				ccexpyear : number
				ccname : string		
    		}
    		+
    		userEmail
    	*/
        console.log(data);
        userDatabase[current_email] = data;
        saveData();
        console.log(readData());
        user_info = data;
    
    });

    //attempt to make a transaction
    client.on('PaymentRequest',function(price, security){
        
        console.log('price: ' + price);
        console.log('security: ' + security);
        
        //check if user face validates result : bool(true = pass) (false = fail)
        fr.recognize(current_email, (result) =>{
            if(result){
            //request body
            var testBody = JSON.stringify({
                'amount': price.toString(),
                'currency': 'USD',
                'payment': {
                    'cardNumber': user_info.ccnum,
                    'cardExpirationMonth': user_info.ccexpmon,
                    'cardExpirationYear': user_info.ccexpyear
                }
            });

            visaPay.approveSale(testBody, function(data){
                console.log(data);
            }); 
                client.emit('PaymentResult', true)
            }
            else {
                client.emit('PaymentResult', false)
            }    
        });
        //emits result of visa payment response
        
    });
});

io.listen(3001);
console.log('server running');