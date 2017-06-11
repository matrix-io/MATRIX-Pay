const io = require('socket.io')();
const faceRecognition = require('./lib/faceRecog.js'); 
//Socket.io Server
//on client connection
io.on('connection', function(client) {
    var newUserName = "";
    console.log('user connected');
    //on face train request
    client.on('TrainRequest', function(username_email) {
        newUserName = username_email;
        if(trainFace(newUserName)){
			client.emit('TrainSuccess',true )
		}; //emit true is sent if facial recog passed
    });
    client.on('PaymentRequest', function(payment_info) {
        visaPay.approveSale(testBody, function(data) {
            if (data !== 'settlementError')
                client.emit('PaymentSuccess', true);
            else
                client.emit('PaymentSuccess', false);
        });
    });
});

io.listen(8888);
