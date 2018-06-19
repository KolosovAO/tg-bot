function getMatchups(team) {
    return team.map(id => {
        const file = require(`./matchups${id}.json`);
        return JSON.parse(file);
    });
}

exports.getWinrate = function getWinrate(team1, team2) {
    const heroes = getMatchups(team1);
    let count = 0;
    heroes.forEach(hero => {
        if (!Array.isArray(hero)) {
            console.log("not valid array");
        } else {
            const avHeroWr = hero.reduce((total, item) => {
                if (team2.find(val => val == item.hero_id)) {
                    const wr = item.wins / item.games_played;
                    total += isNaN(wr) ? 0.5 : wr;
                }
                return total;
            }, 0) / 5;
            count += avHeroWr;
        }
    });
    return count / 5;
}

exports.getHeroesList = function getHeroesList() {
    const file = require(`./heroes.json`);
    return JSON.parse(file).map(item => `${item.id} - ${item.name}`).join("\n");
}