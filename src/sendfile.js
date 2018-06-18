//sendile.js
const fs = require('fs');
const request = require('request');
var formData = {
    'photo': fs.readFileSync('congrats.png'),
	'chat_id': 299831865
};
var uploadOptions = {
    "url": "https://api.telegram.org/bot340218839:AAELWARY-brV_WGOw7h4bIlCfD5KVSYsd1Q/sendPhoto",
    "method": "POST",
    "formData": formData
}
var req = request(uploadOptions, function(err, resp, body) {
    if (err) {
        console.log('Error ', err);
    } else {
        console.log('upload successful', body)
    }
});