var wmu = require('./wmu-main');
var fs = require('fs')

const eol = "\r\n";

let wmu_string = "|h|1|'Hoofdstuk 1'" + eol + eol +
    "Dit is een test" + eol + eol + eol + eol + eol +
    "Meer **bold** en //italics// en __underscore__ en ~~striketrough~~ enz" + eol + eol +
    "|table|:-:" + eol +
    "|format=dash" + eol +
    "|caption=Fig 1." + eol +
    "||" + eol +
    "|a|b|c|d|e|" + eol +
    "|:---|---:|:---:|-:-|---|" + eol +
    "||" + eol +
    "|1|2|3|4|5|" + eol +
    eol + eol +
    "|quote|-:" + eol +
    "||" + eol +
    "|Lover brings much hapiness," + eol +
    "|much more so than pining for" + eol +
    "|someone brings pain." + eol +eol; 

   let html_1 = wmu.transformFragment(wmu_string, { createToc: true });
   fs.writeFileSync('./out/fragmenttest.html',html_1,'utf8');


   let html_2 = wmu.processConfigFile("./config.wmu", {});
   fs.writeFileSync('./out/book.html',html_2,'utf8');
