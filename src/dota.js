const request = require('request');

function getLiveMatchups(team) {
    return Promise.all(team.map(id => getMatchup(id))).then(results => {
        return results.map(result => JSON.parse(result));
    });
}
function getMatchup(id) {
    const options = {
      url: `https://api.opendota.com/api/heroes/${id}/matchups`,
      method: 'GET',
    };
  
    return new Promise((resolve, reject) => {
      request.get(options, (err, resp, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }

function getWinrate(team1, team2) {
    return getLiveMatchups(team1).then(heroes => {
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
    });
}
exports.getHeroesList = function getHeroesList() {
    const file = require(`./heroes.json`);
    return JSON.parse(file).map(item => `${item.id} - ${item.name}`).join("\n");
}