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
		if ((team1 && team2) & (team1.length !== 5 || team2.length !== 5)) {
			tg.sendMessage(message.chat.id, `<pre>invalid format</pre>`, {
				parse_mode:'HTML'
			});
			return;
		}
		tg.sendMessage(message.chat.id, `<pre>${dota.getHeroesNames(team1, team2)}</pre>`, {
			parse_mode:'HTML'
		});
		dota.getWinrate(team1, team2).then(result => {
			tg.sendMessage(message.chat.id, `<pre>winrate - ${result}</pre>`, {
				parse_mode:'HTML'
			});
		}).catch(e => {
			tg.sendMessage(message.chat.id, `<pre>something goes wrong</pre>`, {
				parse_mode:'HTML'
			});
		});
	}
	if (message.text.split(' ')[0] === '/heroes') {
		tg.sendMessage(message.chat.id, '<pre>' + dota.getHeroesList() + '</pre>', {
			parse_mode:'HTML'
		});
	}
	if (message.text.split(' ')[0] === '/find') {
		const raw = message.text.slice(6).split(",");
		tg.sendMessage(message.chat.id, '<pre>' + dota.find(raw) + '</pre>', {
			parse_mode:'HTML'
		});
	}
}
