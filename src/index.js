var wmu = require('./wmu-main');
var fs = require('fs')

const eol = "\r\n";


let test = wmu.transformWmu(`|quote|-:
caption=Figuur 1|
format=abc
|=
Dit is een interessante quote
|=
Door iemand

|h1|=Hoofdstuk 1

Zomaar een paragraaf

|code
language=js
|=
full Reference, and Help. You can also Save & Share with the Community, and view patterns you create or favorite in My Patterns.

|table|:-:
|class=specialcss
|=
|1|2|3|4|
|:-|
|=
|a|b|c|d|e|`, {});

console.log(test);



let wmu_string = `|h1|=Hoofdstuk 1

Dit is een test




Meer **bold** en //italics// en __underscore__ en ~~striketrough~~ enz

|table|:-:
|format=dash
|caption=Fig 1.
|=
|a|b|c|d|e|
|:---|---:|:---:|-:-|---|
|=
|1|2|3|4|5|

|quote|-:
|=
|Lover brings much hapiness,
|much more so than pining for
|someone brings pain.`;

   let html_1 = wmu.transformFragment(wmu_string, { createToc: true });
   fs.writeFileSync('./out/fragmenttest.html',html_1,'utf8');


   let html_2 = wmu.processConfigFile("./config.wmu", {});
   fs.writeFileSync('./out/book.html',html_2,'utf8');
