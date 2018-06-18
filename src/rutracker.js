//rutracker.js
exports.find = function find(query, res_count, tg, chatid){
var RutrackerApi = require('rutracker-api');
var username = 'DyadyaValera',
    password = 'fxmAe';
var rutracker = new RutrackerApi();
rutracker.login(username, password);
setTimeout(function(){
rutracker.search(query, function(data){
	for (i in data){
		tg.sendMessage(chatid, '<pre>id - ' + data[i].id + ' ' + data[i].title + '</pre>', {
			parse_mode:'HTML'});
		if (--res_count == 0){
			return;
		}
	}
});
},1000);
}

exports.download = function download(id){
	var RutrackerApi = require('rutracker-api');
	var username = 'DyadyaValera',
    password = 'fxmAe';
	var rutracker = new RutrackerApi();
	rutracker.login(username, password);
	setTimeout(function(){
		rutracker.download(id, function(response)
		{
			var fs = require('fs');
			var path = 'C:/Users/zmei/Desktop/'; 
			response.pipe(fs.createWriteStream(path + id + '.torrent'));
		});
	},2000);
}