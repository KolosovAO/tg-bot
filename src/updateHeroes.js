const request = require('request');
const fs = require('fs');

function updateHeroes() {
    request("https://api.opendota.com/api/heroStats", (err, resp, body) => {
        return new Promise((res, rej) => {
            if (err) {
                rej(err);
            }
            res(body);
        }).then(data => JSON.parse(data)).then(heroes => heroes.map(hero => (
            {
                id: hero.id.toString(),
                icon: "http://cdn.dota2.com" + hero.icon,
                img: "http://cdn.dota2.com" + hero.img,
                name: hero.name,
                local: hero.localized_name
            })
        )).then(data => {
            fs.writeFileSync("heroes.json", JSON.stringify(data), "utf8")
        })
    })
}

updateHeroes()