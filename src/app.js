const TelegramBot = require('node-telegram-bot-api');
const dota = require('./dota');
const constants = require('./constants');
const COMMANDS = constants.COMMANDS;

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

tg.on('message', (message) => {
	const {command, options} = parseMessage(message.text);
	if (!command) {
		return;
	}
	switch(command) {
		case COMMANDS.GET_MATCH_WINRATE:
			dota.getPicksByMatch(options).then(([team1, team2]) => getWinrate(message, team1, team2));
			return;
		case COMMANDS.GET_WINRATE:
			const rawTeams = options.split(",");
			const [team1, team2] = rawTeams.map(team => team.split(" "));
			if (!Array.isArray(team1) || !Array.isArray(team2) || team1.length !== 5 || team2.length !== 5) {
				sendMessage(message.chat.id, "invalid format");
				return;
			}
			getWinrate(message, team1, team2);
			return;
		case COMMANDS.FIND_HERO:
			sendMessage(message.chat.id, dota.findHero(options));
			return;
		case COMMANDS.FIND_TEAM:
			dota.findTeam(options).then(data => {
				sendMessage(message.chat.id, data)
			});
			return;
		case COMMANDS.FIND_TEAM_HEROES:
			const [team, rawHeroes] = options.split("-");
			const heroes = rawHeroes.split(" ");
			dota.getTeamHeroes(team, heroes).then(data => {
				sendMessage(message.chat.id, data);
			});
			return;
		case COMMANDS.FIND_TEAM_INFO:
			dota.getTeamInfo(options).then(data => {
				sendMessage(message.chat.id, data);
			});
			return;
		case COMMANDS.GET_HEROES_LIST:
			sendMessage(message.chat.id, dota.getHeroesList());
			return;
		case COMMANDS.GET_LAST_PRO_MATCHES:
			dota.getProMatches(options).then(matches => {
				matches.forEach(match => {
					let msg = '';
					for (const key in match) {
						msg += `${key}: ${match[key]}\n`;
					}
					sendMessage(message.chat.id, msg);
				});
			});
			return;
	}
});

function sendMessage(chatId, msg) {
	tg.sendMessage(chatId, '<pre>' + msg + '</pre>', {
		parse_mode:'HTML'
	});
}

function parseMessage(msg) {
	let command;
	let options;
	if (msg[0] !== "/") {
		return {command, options};
	}
	const whitespaceIndex = msg.indexOf(" ");
	if (whitespaceIndex === -1) {
		command = msg;
	} else {
		command = msg.slice(0, whitespaceIndex);
		options = msg.slice(whitespaceIndex + 1);
	}
	return {command, options};
}

function getWinrate(message, team1, team2) {
	tg.sendMessage(message.chat.id, `<pre>${dota.getHeroesNames(team1, team2)}</pre>`, {
		parse_mode:'HTML'
	});
	dota.getWinrate(team1, team2).then(result => {
		sendMessage(message.chat.id, `winrate - ${result}`);
	}).catch(e => {
		sendMessage(message.chat.id, "something goes wrong");
	});
}