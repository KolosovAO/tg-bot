//timer.json
exports.add = function add(hours,minutes,seconds){
	var now = new Date();
	var cmins = minutes - now.getMinutes();
	var chours = hours - now.getHours();
	var cseconds = seconds - now.getSeconds();
	setTimeout(function interval(){
		var current = new Date();
		console.log(current.getHours() + ':' + current.getMinutes() + ':' + current.getSeconds() + ' FINISHED');
		return;
	}, 60000*cmins+60000*60*chours+1000*cseconds);
	return 60000*cmins+60000*60*chours+1000*cseconds;
}
