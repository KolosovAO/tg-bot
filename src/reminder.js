exports.add = function add(v, tg, chatid){
	const fs = require('fs');
	var rs = fs.readFileSync('reminder.json','utf8');
	var json = JSON.parse(rs);
	json.push(v);
	fs.writeFileSync('reminder.json',JSON.stringify(json),'utf8');
	tg.sendMessage(chatid,'<pre> Заметка "' + v +'" добавлена</pre>', {
		parse_mode:'HTML'});
}
exports.read = function read(tg, chatid){
	const fs = require('fs');
	var rs = fs.readFileSync('reminder.json','utf8');
	var json = JSON.parse(rs);
	for (i in json){
		tg.sendMessage(chatid,'<pre>' + i + ' - ' + json[i] +'</pre>', {
			parse_mode:'HTML'});
	}
}
exports.del = function del(index, tg, chatid){
	const fs = require('fs');
	var rs = fs.readFileSync('reminder.json','utf8');
	var json = JSON.parse(rs);
	tg.sendMessage(chatid,'<pre> Заметка "' + json.splice(index,1) +'" удалена</pre>', {
		parse_mode:'HTML'});
	fs.writeFileSync('reminder.json',JSON.stringify(json),'utf8');	
}