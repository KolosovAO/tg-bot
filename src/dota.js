const request = require('request');
const heroesArray = require(`./heroes.js`).heroes;

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
  
    return new Promise((res, rej) => {
      request.get(options, (err, resp, body) => {
        if (err) {
          rej(err);
        } else {
          res(body);
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
function getHeroesList() {
    return heroesArray.map(item => `${item.id} - ${item.local}`).join("\n");
}
function getHeroesNames(team1, team2) {
    let heroes1 = [];
    let heroes2 = [];
    heroesArray.forEach(hero => {
        if (team1.find(item => item == hero.id)) {
            heroes1.push(hero.local);
        } else if (team2.find(item => item == hero.id)) {
            heroes2.push(hero.local);
        }
    });
    return heroes1.join(", ") + " vs " + heroes2.join(", ");
}
function find(str) {
    return heroesArray.filter(item => item.local.toLowerCase().indexOf(str) !== -1).map(item => `${item.id} - ${item.local}`).join("\n");
}


function getPicksByMatch(id) {
    const options = {
        url: `https://api.opendota.com/api/matches/${id}`,
        method: 'GET',
    };
    
    return new Promise((res, rej) => {
        request.get(options, (err, resp, body) => {
            if (err) {
                rej(err);
            } else {
                res(body);
            }
        });
    }).
        then(match => JSON.parse(match)).
        then(match => {
            const pickbans = match.picks_bans;
            const team1 = [];
            const team2 = [];
            pickbans.forEach(pickban => {
                if (pickban.is_pick) {
                    if (pickban.team === 0) {
                        team1.push(pickban.hero_id);
                    } else {
                        team2.push(pickban.hero_id);
                    }
                }
            })
            return [team1, team2];
        });
}

function getProMatches(count) {
    const options = {
        url: `https://api.opendota.com/api/proMatches`,
        method: 'GET',
    };
    
    return new Promise((res, rej) => {
        request.get(options, (err, resp, body) => {
            if (err) {
                rej(err);
            } else {
                res(body);
            }
        });
    }).
        then(matches => JSON.parse(matches)).
        then(matches => matches.slice(0, count)).
        then(matches => matches.map(match => {
            const date = new Date(match.start_time * 1000);
            return {
                id: match.match_id,
                date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
                teams: `${match.radiant_name || "unknown"}: ${match.radiant_score} vs ${match.dire_name || "unknown"}: ${match.dire_score}`,
                winner: (match.radiant_win ? match.radiant_name : match.dire_name) || "unknown",
                tournament: match.league_name
            }
        }));
}

function getHeroesIcons(team1, team2) {
    let team1Icons = "";
    let team2Icons = "";

    for (const hero of heroesArray) {
        if (team1.find(id => id == hero.id)) {
            team1Icons += `<img src=${hero.icon}></img>`
        } else if (team2.find(id => id == hero.id)) {
            team2Icons += `<img src=${hero.icon}></img>`
        }
    }
    return team1Icons + " vs " + team2Icons;
}

function findTeam(str) {
    const options = {
        url: "https://api.opendota.com/api/teams",
        method: 'GET',
    };

    return new Promise((res, rej) => {
        request.get(options, (err, resp, body) => {
            if (err) {
                rej(err);
            } else {
                res(body);
            }
        });
    }).
        then(data => JSON.parse(data)).
        then(data => data.filter(item => item.name.toLowerCase().indexOf(str) !== -1)).
        then(data => data.reduce((result, item) => result + `${item.team_id}: ${item.name}\n`, ""))
}

function getTeamInfo(id) {
    const options = {
        url: `https://api.opendota.com/api/teams/${id}`,
        method: 'GET',
    };

    return new Promise((res, rej) => {
        request.get(options, (err, resp, body) => {
            if (err) {
                rej(err);
            } else {
                res(body);
            }
        });
    }).
        then(data => JSON.parse(data)).
        then(team => `id: ${team.team_id}\nname: ${team.name}\nrating: ${team.rating}\nstat: ${team.wins}-${team.losses}`)
}

function getTeamHeroesInfo(id, heroes) {
        const options = {
        url: `https://api.opendota.com/api/teams/${id}/heroes`,
        method: 'GET',
    };

    return new Promise((res, rej) => {
        request.get(options, (err, resp, body) => {
            if (err) {
                rej(err);
            } else {
                res(body);
            }
        });
    }).
        then(data => JSON.parse(data)).
        then(data => data.filter(hero => heroes.find(id => id == hero.hero_id))).
        then(heroes => heroes.reduce((result, hero) => result + `name: ${hero.localized_name}\nwins: ${hero.wins}\ngames: ${hero.games_played}\n\n`, ""));
}

exports.getProMatches = getProMatches;
exports.getPicksByMatch = getPicksByMatch;
exports.getWinrate = getWinrate;
exports.find = find;
exports.findTeam = findTeam;
exports.getHeroesList = getHeroesList;
exports.getHeroesNames = getHeroesNames;
exports.getHeroesIcons = getHeroesIcons;
exports.getTeamInfo = getTeamInfo;
exports.getTeamHeroesInfo = getTeamHeroesInfo;