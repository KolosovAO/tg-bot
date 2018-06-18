//pahomer.js
exports.say = function(){
	var fs = require('fs');
	var text = fs.readFileSync('greenelephant.txt', 'utf8');
	var arr = text.split('—');
	var rand = Math.floor((Math.random() * arr.length)); 
	var rez = arr[rand];
	return rez;
};
exports.found = function(search){
	var fs = require('fs');
	var text = fs.readFileSync('greenelephant.txt', 'utf8');
	var arr = text.split('—');
	var temp = [];  
	for(var i in arr){
		if(arr[i].toLowerCase().indexOf(search) + 1)
			temp.push(arr[i]);
	}
	if(temp.length>0){
		var rand = Math.floor((Math.random() * temp.length)); 
		var rez = temp[rand];
		return rez;
	}
	return 0;
};