exports.getgrades = function(tg, chatid){
const req = require('request');
const fs = require('fs');
function get_null_grades(groupid, course_name){
	var nullgrades = [];
	var options = {
	url: 'https://api.accredible.com/v1/all_credentials?group_id=' + groupid + '&page_size=10000',
		headers: {
		'Content-Type':'application/json',
		'Authorization':'Token token=8ea45871abbb657e2f8e4a162b8c586e'
		}
	};
	req.get(options,function(err, httpResponse, body) {
		if (err) {
			return console.error('failed:', err);
		}
		let info = JSON.parse(body);
		let credentials = info.credentials;
		let len = credentials.length;
		for( let i in credentials){
			if (credentials[i].grade == 0){
				nullgrades.push(credentials[i].grade);
			}
		}
		tg.sendMessage(chatid, '<pre>'+ course_name + ' - ' + nullgrades.length + '/' + len + '</pre>', {
			parse_mode:'HTML'});
	});
	return nullgrades;
}
var options = {
	url: 'https://api.accredible.com/v1/issuer/all_groups?page_size=10000',
	headers: {
		'Content-Type':'application/json',
		'Authorization':'Token token=8ea45871abbb657e2f8e4a162b8c586e'
	}
};
req.get(options,function(err, httpResponse, body) {
	if (err) {
		return console.error('failed:', err);
	}
	let info = JSON.parse(body);
	let groups = info.groups;
	let ids = [];
	for (let i in groups){
		ids.push(groups[i].id);
		get_null_grades(groups[i].id, groups[i].course_name);
	}
});
}