
let demoWmuString = `|config|toc=true|toctitle=Content|keepComments=yes

|htmlComment
|=
\|config|toc=true|toctitle=Content

|h1|=Basics



|h2|=Inline

|h3|=Text formatting

**bold** //italics// !!underline!! ~~striktrought~~

Combination: !!**//tekst//**!!

^^superscript^^ and __subscript__

Example inline code \`\`if () then x else y \`\`.

|h3|=Inline quotes

Someone said ""something"" sometime ago

|h3|=Hyperlinks

A hyperlink with text: [[Go to Wikipedia]]@@https://en.wikipedia.org@@
A hyperlink without text: @@https://en.wikipedia.org@@

|h3|=Inline styling

Example of an inline class: [[Some special styling]]##smallcaps##



|h2|=Blocks


|h3|=Paragraphs

Default paragraph, no need for a \`\`\|par\`\` tag.

|par|format=smallcaps
|=
This is a paragraph with a css class called ""smallcaps""


Commentaar blok:

<!-- Lijsten -->

|h3|=Lists

Examples of an inline list:

*) list inline 1 with disc
-) list inline 2

o) list inline 1 with circle
-) list inline 2

#) list inline 1 with square
-) list inline 2

-) list inline 1 with dash
-) list inline 2

Paragraph with a list inside is not a html list, just lines of text:
- inside list item 1
- inside list item 2
This is still the paragraph

|list|format=inside
|=
* bullets inside
* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

|list|:-:|w=50
|=
* this is a list which has a width of 50% and text is justified
- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

List with tabs between pipes:

|list
|=
|- item 1
|\t|- item 1.1
|\t|\t|- item 1.1.1
|\t|- item 1.2

|list|start=2
|=
1 renumbered to two 
2 and three
3 and four

|list|type=A
|=
- should be A
- should be B

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


|h3|=Images

|img|=https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg
|title=This is the title of the image


|h3|=Glossary

|glossary
|=
C
|css
|css3
||**Cascading Style Sheets**; a style sheet language used for describing the presentation of a document written in a markup language such as HTML
H
|html
||**Hyper Text Markup Language**; the standard markup language for documents designed to be displayed in a web browser
J
|js
||**JavaScript**; a programming language that conforms to the ECMAScript specification

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

The default is to place them at the end of the text, but they can also be at the foot of the chapter.

Example of using((1)) a note. And another one((2))

|fn|id=1
|=
This is the note text

|fn|id=2
|=
This is the second note text


|h2|=Markdown support

|h3|=Header 1

|code
|=
|Markdown header 1
|===
|Text

|h3|=Header 2

|code
|=
Markdown header 2
----
Text

`;