
let demoWmuString = `|config|toc=true|toctitle=Content

|h0|=This is a part

|h1|=Intro Hoofstuk (1)

|h2|=Paragraaf (1.1)

|h3|=Sub (1.1.1)

|h4|=x

|h5|=y

|h6|=z

|h2|=Paragraaf (1.2)

Opmaak: **bold** //italics// __underline__ ~~striktrought~~

Combinatie **//tekst//**

En ^^superscript^^ maar ook ^_subscript_^

Some \`\`inline code\`\`

|par|format=xyz
|=
This is a paragraph with a css class called \`\`xyz\`\`

Some text with index word: [[Jung]]==Jung, Carl== etc.

Some text with index word: [[Jung]]==Jung, Carl== etc.

Some text with index word: [[Freud]]==Freud, Sigmund== etc.

With a link: [[Go to Wikipedia]]@@https://en.wikipedia.org@@

Example of class: [[Some special styling]]##my-styling##

Example of using((1)) a note. And another one((2))

|fn|id=1
|=
This is the note text

|fn|id=2
|=
This is the second note text

|h1|=Overig

In het 2e hoofdstuk... ((2.1)) ook een voettekst

|fn|id=2.1
|=
Footnote for chapter 2

|h1|=Tenslotte

|code
language=js
|=
function x() {
   if (y) {
      // bla
   } else {
      // huh?
   }
}
|
// commentaar

|quote|-:
caption=Figuur 1|
format=abc
|=
Dit is een interessante quote
|=|
Door iemand

|table|:-:|multiline=yes
|class=specialcss
|=
::align:::
---|=|---:|=|:---:|=|-:-|=|---
|==|
::header::
1|=|2|=|3|=|4|=|5
|==|
This|=|is|=|a|=|table|=|!

Commentaar blok:

<!-- Lijsten -->

|h2|=Lijsten 

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


|list|=1|type=A
|=
1 een 
2 twee
3 drie

|list
|=
|a indicates lowercase letters
|- should be 'b'
||A indicates uppercase letters
|||i indicates lowercase Roman numerals
||||I indicates uppercase Roman numerals
|||||1 indicates numbers (default)
|- should be 'c'


|img|=https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg
|title=Image that explains it all

|block|=thumbsup-class
|=
Heel goed gedaan!


Markdown header 1
===
test

Markdown header 2
----

|h1|=Glossary (definitie lijst)

|glossary
|=
|css
|css3
||Cascading Style Sheets
|html
||Hyper Text Markup Language

|h0|=Deel II

`;