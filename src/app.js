const TelegramBot = require('node-telegram-bot-api');
const dota = require('./dota');

const TOKEN = "340218839:AAELWARY-brV_WGOw7h4bIlCfD5KVSYsd1Q";

const options = {
	webHook: {
		// Port to which you should bind is assigned to $PORT variable
		// See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
		port: process.env.PORT
		// you do NOT need to set up certificates since Heroku provides
		// the SSL certs already (https://<app-name>.herokuapp.com)
		// Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
	}
};
const url = process.env.APP_URL || 'https://aser-samara-test-bot.herokuapp.com:443';

const tg = new TelegramBot(TOKEN, options);

tg.setWebHook(`${url}/bot${TOKEN}`);

tg.on('message', onMessage);

function getWinrate(message, team1, team2) {
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

function onMessage(message) {
	if (message.text.split(' ')[0] === '/dota') {
		const raw = message.text.slice(6).split(",");
		const [team1, team2] = raw.map(team => team.split(" "));
		if (!Array.isArray(team1) || !Array.isArray(team2) || team1.length !== 5 || team2.length !== 5) {
			tg.sendMessage(message.chat.id, `<pre>invalid format</pre>`, {
				parse_mode:'HTML'
			});
			return;
		}
		getWinrate(message, team1, team2);
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
	if (message.text.split(' ')[0] === '/last') {
		const count = message.text.split(' ')[1];
		dota.getProMatches(count).then(matches => {
			matches.forEach(match => {
				let msg = '';
				for (const key in match) {
					msg += `${key}: ${match[key]}\n`;
				}
				tg.sendMessage(message.chat.id, `<pre>${msg}</pre>`, {
					parse_mode:'HTML'
				});
			});
		})
	}
	if (message.text.split(' ')[0] === '/match') {
		const id = message.text.split(' ')[1];
		dota.getPicksByMatch(id).then(([team1, team2]) => getWinrate(message, team1, team2));
	}
	if (message.text.split(' ')[0] === '/findteam') {
		const raw = message.text.split(' ')[1];
		dota.findTeam(raw).then(data => {
			tg.sendMessage(message.chat.id, `<pre>${data}</pre>`, {
				parse_mode:'HTML'
			});
		})
	}
	if (message.text.split(' ')[0] === '/teamheroes') {
		const [team, rawHeroes] = message.text.slice(7).split("-");
		const heroes = rawHeroes.split(" ");
		dota.getTeamHeroesInfo(team, heroes).then(data => {
			tg.sendMessage(message.chat.id, `<pre>${data}</pre>`, {
				parse_mode:'HTML'
			});
		});
	}
	if (message.text.split(' ')[0] === '/teaminfo') {
		const id = message.text.split(' ')[1];
		dota.getTeamInfo(id).then(data => {
			tg.sendMessage(message.chat.id, `<pre>${data}</pre>`, {
				parse_mode:'HTML'
			});
		});
	}
}

