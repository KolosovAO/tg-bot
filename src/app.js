const TelegramBot = require('node-telegram-bot-api');
const dota = require('./dota');

const token = "340218839:AAELWARY-brV_WGOw7h4bIlCfD5KVSYsd1Q";

const tg = new TelegramBot(token, {
	polling: true
});
tg.on('message', onMessage);

function onMessage(message) {
	if (message.text.split(' ')[0] === '/dota') {
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
}
