const request = require('request');
class Dota {
    constructor() {

        this._initHeroes();
    }
    getHeroesList() {
        let list = "";
        for (const key in this._heroes) {
            list += `${key} - ${this._heroes[key].local}\n`;
        }
        return list;
    }
    getHeroesNames(team1, team2) {
        let heroes1 = team1.map(id => this._heroes[id].local);
        let heroes2 = team2.map(id => this._heroes[id].local)

        return heroes1.join(", ") + " vs " + heroes2.join(", ");
    }
    findHero(str) {
        let results = "";
        for (const key in this._heroes) {
            if (this._heroes[key].local.toLowerCase().indexOf(str) !== -1) {
                results += `${key} - ${this._heroes[key].local}\n`;
            }
        }
        return results;
    }
    async getWinrate(team1, team2) {
        const raw = await this._getMatchups(team1);
        const heroes = raw.map(hero => JSON.parse(hero));
        let count = 0;
        heroes.forEach(hero => {
            const avHeroWr = hero.reduce((total, item) => {
                if (team2.find(id => id == item.hero_id)) {
                    const wr = item.wins / item.games_played;
                    total += isNaN(wr) ? 0.5 : wr;
                }
                return total;
            }, 0) / 5;
            count += avHeroWr;
        });
        return count / 5;
    }
    async getTeamHeroes(id, heroes) {
        const url = `https://api.opendota.com/api/teams/${id}/heroes`;
        const raw = await this._getUrlData(url);
        const data = JSON.parse(raw);
        const info = data.filter(hero => heroes.find(id => id == hero.hero_id));
        return info.reduce((result, hero) => result + `name: ${hero.localized_name}\nwins: ${hero.wins}\ngames: ${hero.games_played}\n\n`, "");
    }
    async findTeam(str) {
        const url = "https://api.opendota.com/api/teams";
        const raw = await this._getUrlData(url);
        const data = JSON.parse(raw);
        return data.reduce((result, item) => {
            if (item.name.toLowerCase().indexOf(str) !== -1) {
                result += `${item.team_id}: ${item.name}\n`;
            }
            return result;
        }, "");
    }
    async getProMatches(count) {
        const url = "https://api.opendota.com/api/proMatches";
        const raw = await this._getUrlData(url);
        const data = JSON.parse(raw);
        const matches = data.slice(0, count);
        return matches.map(match => {
            const date = new Date(match.start_time * 1000);
            return {
                id: match.match_id,
                date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
                teams: `${match.radiant_name || "unknown"}: ${match.radiant_score} vs ${match.dire_name || "unknown"}: ${match.dire_score}`,
                winner: (match.radiant_win ? match.radiant_name : match.dire_name) || "unknown",
                tournament: match.league_name
            }
        });
    }
    async getTeamInfo(id) {
        const url = "https://api.opendota.com/api/teams/" + id;
        const raw = await this._getUrlData(url);
        const team = JSON.parse(raw);
        return `id: ${team.team_id}\nname: ${team.name}\nrating: ${team.rating}\nstat: ${team.wins}-${team.losses}`;
    }
    async getPicksByMatch(id) {
        const url = "https://api.opendota.com/api/matches/" + id;
        const raw = await this._getUrlData(url);
        const match = JSON.parse(raw);

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
        });
        return [team1, team2];
    }
    async _initHeroes() {
        const url = "https://api.opendota.com/api/heroStats";
        const raw = await this._getUrlData(url);
        const data = JSON.parse(raw);
        const heroes = {};
        for (const hero of data) {
            heroes[hero.id] = {
                id: hero.id,
                icon: "http://cdn.dota2.com" + hero.icon,
                img: "http://cdn.dota2.com" + hero.img,
                name: hero.name,
                local: hero.localized_name
            };
        }

        this._heroes = heroes;
    }
    _getMatchups(heroes) {
        return Promise.all(heroes.map(id => this._getUrlData(`https://api.opendota.com/api/heroes/${id}/matchups`)));
    }
    _getUrlData(url) {
        const options = {
            url,
            method: 'GET',
        };
        
        return new Promise((res, rej) => {
            request.get(options, (err, _, body) => {
                if (err) {
                    rej(err);
                } else {
                    res(body);
                }
            });
        })
    }
}


module.exports = new Dota();