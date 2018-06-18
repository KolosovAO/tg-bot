function serial_date(name, tg, chatid){
	var request = require('request');
	var cheerio = require('cheerio');	
	var result;
	var URL = 'http://www.toramp.com/search.php?search=' + name;
	request(URL, function (err, res, body) {
    if (err) throw err;
	var $ = cheerio.load(body);
    if ($('.tdSearch_left').children().attr('href')!=undefined){
	var findSerial = 'http://toramp.com/' + $('.tdSearch_left').children().attr('href');
	request(findSerial, function(err,res,body){
		var $ = cheerio.load(body);
		var maintitle = 'Осуществляется поиск сериала ' + $('h1.title-basic').children().first().text();  
		tg.sendMessage(chatid, '<pre>' + maintitle + '</pre>', {
			parse_mode:'HTML'});
		if (err) throw err;
		if ($('[id=not-air]').text()==='')
			result = 'Сериал закончен.';
		else{
			var nextSeria = $('[id=not-air].air-date').first().text();
			var title = $('[id=not-air].title-of-episodes').first().text();
			var number =  $('[id=not-air]').first().text(); 
			if (nextSeria===' ') 
				result = 'Дата выхода пока не известна.';
			else 
				result =  'Следущая серия ' + number + ' ' + title + ' выходит ' + nextSeria;
		}	
			tg.sendMessage(chatid, '<pre>' + result + '</pre>', {
				parse_mode:'HTML'});
	});
	} else {
		tg.sendMessage(chatid, '<pre>' + result + '</pre>', {
			parse_mode:'HTML'});
	}
});
}
exports.serialDate = serial_date;