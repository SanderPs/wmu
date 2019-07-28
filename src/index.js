var wmu = require('./wmu-main');
var fs = require('fs')

const eol = "\r\n";


let testAll = `|quote|-:
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
function x() {
   if (x) {
      // bla
   } else {
      // huh?
   }
}

|table|:-:
|class=specialcss
|=
|1|2|3|4|
|:-|
|=
|a|b|c|d|e|

- lijst inline

paragraaf:
- inline lijst in paragraaf
- 2
En weer verder

|list|-:-
|=
- nummer 1
- nummer 2
- nummer 3

|c|=csharp
|=
var x=Repo<Person>().Where(i => i.Deleted && i.PersonStatus==65)
      .ToList();

|img|=./my-image.jpeg
|title=Image that explains it all

|block|=thumbsup-class
|=
Heel goed gedaan!

The end
`;

let html_0 = wmu.composeHtml(testAll, null, { createToc: true, fullHtml: true });
fs.writeFileSync('./out/test-all.html',html_0,'utf8');

console.log(html_0);



let wmu_string = `|h1|=Hoofdstuk 1

Dit is een test




Meer **bold** en //italics// en __underscore__ en ~~striketrough~~ enz

|table|:-:
|format=dash
|caption=Fig 1.
|=
|a|b|c|d|e|
|:---|---:|:---:|-:-|---|
|v=T||-||_|
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
