var fs = require("fs");
var ejs = require('ejs');


var meta = JSON.parse(fs.readFileSync("meta.json", "utf8").toString());

for (line in meta) {
    console.log(JSON.stringify(line));
    console.log(JSON.stringify(meta[line]));

    var temp = fs.readFileSync("template.ejs").toString();

    var st = ejs.render(temp, {
        filename: "template.ejs",
        meta: meta[line]
    });

    var o = fs.writeFileSync(line + "_v2.tpl.html", st);

}
