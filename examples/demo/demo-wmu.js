
let demoWmuString = `|config|toc=true|toctitle=Content|keepComments=yes

|htmlComment
|=
\|config|toc=true|toctitle=Content

|h1|=Basics



|h2|=Inline

|h3|=Text formatting

**bold** //italics// __underline__ ~~striktrought~~

Combination: __**//tekst//**__

^^superscript^^ and ^_subscript_^

Example inline code \`\`if () then x else y \`\`.

|h3|=Inline quotes

Someone said ""something"" sometime ago

|h3|=Hyperlinks

With a link: [[Go to Wikipedia]]@@https://en.wikipedia.org@@

|h3|=Inline styling

Example of an inline class: [[Some special styling]]##smallcaps##



|h2|=Blocks

In het 2e hoofdstuk... ((2.1)) ook een voettekst

|fn|id=2.1
|=
Footnote for chapter 2

|h1|=Tenslotte

|code
language=js
|=
function [[x()]]::ins:: [[y()]]::del:: {
   if (y) {
      // bla::ins::
   } else {
      // huh?::del::
   }
   return [[result]]::ins::::ins::
}
|
// comment [[on this piece of code]]::note::::note::
|h3|=Paragraphs

Default paragraph, no need for a \`\`\|par\`\` tag.

|par|format=smallcaps
|=
This is a paragraph with a css class called ""smallcaps""


|h3|=Lists

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

|h3|=Tables

|table|:-:|multiline=yes
|class=specialcss
|=
::align:::
---|=|---:|=|:---:|=|-:-|=|---
|=
::header::
1|=|2|=|3|=|4|=|5
|=
This|=|is|=|a|=|table|=|!

|h3|=Code block

|code
language=js
|=
// example of a function
|
function x() {
   if (y) {
      // bla
   } else {
      // huh?
   }
}
|
// commenting the code

|h3|=Images

|img|=https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg
|title=Image that explains it all


|h3|=Glossary

|glossary
|=
|css
|css3
||Cascading Style Sheets
|html
||Hyper Text Markup Language

|h3|=Quotes

|quote|-:
caption=Figuur 1|
format=abc
|=
Everything should be made as simple as possible, but no simpler.
|=
Albert Einstein

|h3|=Blocks

|block|=thumbsup-class
|=
Different from paragraph?


|h2|=Features

|h3|=Index words

Some text with index word: [[Jung]]==Jung, Carl== etc.

Some text with index word: [[Jung]]==Jung, Carl== etc.

Some text with index word: [[Freud]]==Freud, Sigmund== etc.

|h3|=Footnotes

Example of using((1)) a note. And another one((2))

|fn|id=1
|=
This is the note text

|fn|id=2
|=
This is the second note text

In het 2e hoofdstuk... ((2.1)) ook een voettekst

|fn|id=2.1
|=
Footnote for chapter 2



|h2|=Markdown support

|h3|=Header 1

|code
|=
|Markdown header 1
|===
|Text

|h3|=Header 2

Markdown header 2
----
Text

`;