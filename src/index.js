var wmu = require('./wmu-main');
var fs = require('fs')


let testAll = `|quote|-:
caption=Figuur 1|
format=abc
|=
Dit is een interessante quote
|=
Door iemand

|h1|=Hoofdstuk 1

Zomaar een paragraaf

Dit is text[[1]] met een voetnoot, en gewoon nog een[[2]]

|fn|=1
|=
Dit is een voetnoot voor nr. 1

|fn|=2
|=
En deze is voor nr 2.

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

|h1|Hoofdstuk 2

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

Combinatie **//tekst//**

En ^^superscript^^ maar ook ^_subscript_^

Met een [small]##inline class## als output

Markdown header 1
===
test

Markdown header 2
----

Dit is tekst met voetnoot[[A]]

|fn|=A
|=
Hier staat de voetnoot tekst

The end
`;

let html_0 = wmu.transformPage(testAll, { createToc: true });
fs.writeFileSync('./out/test-all.html',html_0,'utf8');

console.log(html_0);



let wmu_string = `
|config|toc

|h1|=Hoofdstuk 1

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
|someone brings pain.


Dit is tekst met voetnoot[[1]]

|fn|=1
|=
Hier staat de voetnoot tekst


`;

   let html_1 = wmu.transformFragment(wmu_string, { createToc: true });
   fs.writeFileSync('./out/fragmenttest.html',html_1,'utf8');


   wmu.transformProject("./config.wmu", { outputPath: './out'});

