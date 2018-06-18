const fs = require('fs');

function getHeroes(team) {
    return team.map(id => {
        const file = require(`./matchups${id}.json`);
        return JSON.parse(file);
    });
}

exports.getWinrate = function getWinrate(team1, team2) {
    console.log(team1, team2)
    console.log(getHeroes(team1))
    return getHeroes(team1).reduce(
        (av, hero) => av + team2.reduce(
                (res, enemy) => {
                    const matchup = hero.find(item => item.hero_id == enemy);
                    const wr = matchup.wins / matchup.games_played;
                    return res + (isNaN(wr) ? 0.5 : wr);
                }, 0) / 5, 0
    ) / 5;
}

exports.getHeroesList = function getHeroesList() {
    const file = require(`./heroes.json`);
    return JSON.parse(file).map(item => `${item.id} - ${item.name}`).join("\n");
}