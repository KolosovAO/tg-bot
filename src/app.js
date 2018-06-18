const pahomer = require('./pahomer');
const reminder = require('./reminder');
const TelegramBot = require('node-telegram-bot-api');

const token = "340218839:AAELWARY-brV_WGOw7h4bIlCfD5KVSYsd1Q";

const tg = new TelegramBot(token, {
	polling: true
});
tg.on('message', onMessage);
tg.on('callback_query', onCallbackQuery);

const comandStore = {};

function getComand(message) {
	const [command, ...extra] = message.text.split(" ");
	return {
		comand,
		extra
	}
}

function comandChoose(commands) {

}

function onMessage(message) {
/////////////////timer
    console.log('message:', message);
	if (message.text.split(' ')[0] == '/timer'){
		const timer = require('./timer');
		tg.sendMessage(message.chat.id,'<pre>Timer set</pre>', {
			parse_mode:'HTML'
		});
		var timearr = message.text.split(' ')[1].split(':');
		setTimeout(function(){
			tg.sendMessage(message.chat.id,'<pre>ALARM ALARM ALARM</pre>', {
				parse_mode:'HTML'
			});
		}, timer.add(timearr[0],timearr[1],timearr[2]));
	}
//////////////reminder
	if (message.text.split(' ')[0] == '/reminder') {
		//read
		if (message.text == '/reminder'){
			reminder.read(tg, message.chat.id);
		}
		//add
		if (message.text.split(' ')[1] == 'add'){
			reminder.add(message.text.split(' ').slice(2).join(' '), tg, message.chat.id);
		}
		//del
		if (message.text.split(' ')[1] == 'del'){
			reminder.del(message.text.split(' ')[2], tg, message.chat.id);
		}
	}
////////////////bratishka
    if (message.text && message.text.toLowerCase() == '/bratishka') {
        tg.sendMessage(message.chat.id, '<pre>'+ pahomer.say() +'</pre>', {
            parse_mode:'HTML'
        });
        return;
    }
////////////////torrent
	if (message.text.split(' ')[0] == '/torrent') {
		var findtorrentlinks = require('./findtorrentlinks');
		findtorrentlinks.find(message.text.split(' ')[1]);
		setTimeout(function(){
			var linkarr = findtorrentlinks.read();
			if (linkarr===0){
				tg.sendMessage(message.chat.id, '<pre>Не найдено торрент линков</pre>', {
					parse_mode:'HTML'
				});		
			}				
			else{
				for (i in linkarr){
					tg.sendMessage(message.chat.id, '<pre>' + linkarr[i] + '</pre>', {
						parse_mode:'HTML'
					});
				}
			}
		},5000);
        return;
    }
//////////////////serial
	if (message.text.split(' ')[0] == '/serial') {         
		var finder = require('./finder');
		finder.serialDate(message.text.split(' ').slice(1).join('+'), tg, message.chat.id);
        return;
	}
	if (message.text.split(' ')[0] === '/dota') {
		const dota = require('./dota');
		const raw = message.text.slice(6).split(",");
		const [team1, team2] = raw.map(team => team.split(" "));
		tg.sendMessage(message.chat.id, '<pre>winrate - ' + dota.getWinrate(team1, team2) + '</pre>', {
			parse_mode:'HTML'
		});
	}
	if (message.text.split(' ')[0] === '/heroes') {
		const dota = require('./dota');
		tg.sendMessage(message.chat.id, '<pre>' + dota.getHeroesList() + '</pre>', {
			parse_mode:'HTML'
		});
	}
/////////////////rutracker
	if (message.text.split(' ')[0] == '/rutracker') {         
		var rutracker = require('./rutracker');
		let torrent_count = message.text.split(' ')[1];
		rutracker.find(message.text.split(' ').slice(2).join(' '), torrent_count, tg, message.chat.id);
    }
	if (message.text.split(' ')[0] == '/download') {         
		var rutracker = require('./rutracker');
		rutracker.download(message.text.split(' ')[1]);
				tg.sendMessage(message.chat.id, '<pre>Скачено</pre>', {
					parse_mode:'HTML'});
	}
	if (message.text.split(' ')[0] == '/getnullgrades') {         
		const getGrades = require('./getgradecount');
		getGrades.getgrades(tg, message.chat.id);
	}
	if (message.text.split(' ')[0] == '/help') {         
		tg.sendMessage(message.chat.id, '<pre>/reminder /reminder add /reminder del /bratishka /rutracker /download  /serial /torrent /timer /getnullgrades</pre>', {
			parse_mode:'HTML'});
	}
//////////////////////
    if (message.text && message.text.toLowerCase() == '/start') {
        sendStartMessage(message);
        return;
    }
	if (pahomer.found(message.text)!=0){
		tg.sendMessage(message.chat.id, '<pre>' + pahomer.found(message.text) + '</pre>', {
            parse_mode:'HTML'
        });
	}
////////////////////

}
function sendStartMessage(message) {
    var text = 'Здрастить! Здраститя… здраститя!';
    tg.sendMessage(message.chat.id, text);
}
function onCallbackQuery(callbackQuery) {
    console.log('callbackQuery:', callbackQuery);
}
