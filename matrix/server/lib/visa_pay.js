//initial vars
var request = require('request');
var crypto = require('crypto');
//VISA API Keys
var config = {
    apiKey: 'G1942FZ3MN8BM298HXE221FwqEwxyd-6tFHw9iOdLB_aDhr9o',
    sharedSecret: 'x//AJHkgG}6l5q9IQujQBXKR2CIR2{ASlj@BM8n8'
};
/////////////////////////////
// EXPORTED FUNCTIONS
/////////////////////////////
module.exports = {
    approveSale: function (payment_request_body, callback) {
        //status to see settlement result
        var payStatus = "";
        //request options
        var payment_request_options = {
            uri: 'https://sandbox.api.visa.com/cybersource/payments/v1/sales?apikey=' + config.apiKey,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-pay-token': getXPayToken('payments/v1/sales', 'apikey=' + config.apiKey, payment_request_body)
            },
            body: payment_request_body
        }
        //send request
        request(payment_request_options, function(error, response, body) {
            if(error){
                console.log(error);
            }
            else{
                //if settlement status is valid
                if(JSON.parse(body).status !== null && JSON.parse(body).status !== undefined){
                    payStatus = JSON.parse(body).status;
                }
                //settlement status is invalid
                else{
                    payStatus = 'settlementError';
                }
                //send settlement result
                callback(payStatus);
            }
        });
    }
}

/////////////////////////////
// LOCAL FUNCTIONS
/////////////////////////////
//Create XPayToken for cybersource api
function getXPayToken(resourcePath, queryParams, postBody) {
    var timestamp = Math.floor(Date.now() / 1000);
    var sharedSecret = config.sharedSecret;
    var preHashString = timestamp + resourcePath + queryParams + postBody;
    var hashString = crypto.createHmac('SHA256', sharedSecret).update(preHashString).digest('hex');
    var preHashString2 = resourcePath + queryParams + postBody;
    var hashString2 = crypto.createHmac('SHA256', sharedSecret).update(preHashString2).digest('hex');
    var xPayToken = 'xv2:' + timestamp + ':' + hashString;
    return xPayToken;
}