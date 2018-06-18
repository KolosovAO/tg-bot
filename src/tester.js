var fs = require('fs');
var res = fs.readFileSync('rutracker.json','utf8');
res = JSON.parse(res);
console.log(res);