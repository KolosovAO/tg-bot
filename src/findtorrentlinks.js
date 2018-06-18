//findtorrentlinks.js
exports.find = function(url){
	var arr = [];
	var torrent_arr = [];
	function find_url(url){
		var request = require('request');
		var cheerio = require('cheerio');
		request(url, function (err, res, body) {
			var $ = cheerio.load(body);
			var links = $('a'); 
			$(links).each(function(i, link){
				arr.push($(link).attr('href'));
			});
		});
	}
	find_url(url);
	setTimeout(function(){
		for(i in arr){
			if (arr[i]!=undefined)
				if (arr[i].indexOf('.torrent')+1)
					torrent_arr.push(arr[i]);
		}
	},2000);
	setTimeout(function(){
		fs = require('fs');
		fs.writeFile('torrentlinks.txt',torrent_arr,'utf8');
	},4000);
}
exports.read = function(){
	fs = require('fs');
	var string = fs.readFileSync('torrentlinks.txt','utf8');
	if (string)
		var arr = string.split(',');
	else 
		var arr = 0;
	return arr;
}