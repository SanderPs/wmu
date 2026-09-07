## WMU Basics

### 1. Blocks

Documents are divided into blocks separated by **2 or more newlines**

(¶ added for clarity)

```
block 1¶
¶
block 2¶
¶
¶
block 3¶
```

Output:
```
<p>block 1</p>
<p>block 2</p>
<p>block 3</p>
```


### 2. Explicit empty lines

If you want an empty line in a block you use a `|`

```
block 1

block 2
|
still block 2

block 3
```

Output:
```
<p>block 1</p>
<p>block 2<br/>
<br/>
still block 2</p>
<p>block 3</p>
```

You can use `|` for all lines:
```
|code  
|=  
|let x=1;  
|  
|console.log(x);  
```

Or just for the empty lines:

```
|code  
|=  
let x=1;  
|  
console.log(x);  
```

### 3. Blocks are paragraphs by default

A block is translated by default to a paragraph. It can also be declared a paragraph by using `|par`

```
The first paragraph

|par
|=
The second paragraph

The third paragraph
```

Output:
```
<p>The first paragraph</p>
<p>The second paragraph</p>
<p>The third paragraph</p>
```

### 3. Adding variables/parameters

a block can have variables like `|<identifier>|<key>=value`

```
The first paragraph

|par|format=my-class
|=
The second paragraph

The third paragraph
```

Output:
```
<p>The first paragraph</p>
<p class="my-class">The second paragraph</p>
<p>The third paragraph</p>
```

### 4. Blocks can have multiple parts

Blocks can have parts separated by `|=\n`

```
|quote
|=
Something someone said
|=
- by someone
```

Output:
```
<blockquote>
	<div>Something someone said</div>
	<footer>- by someone</footer>
</blockquote>
```



### 5. Inline markup

Text can have inline markup and inline commands

```
**bold** ***strong*** //italic// ///emphasized/// !!underline!! ~~striketrough~~
```

Output:
```
<b>bold</b> <strong>strong</strong> <i>italic</i> <em>emphasized</em> <u>underline</u> <del>striketrough</del>
```


## Wmu Contexts

Wmu includes a standard for projects consisting of multiple files.

|Method|Input|Output|
|---|---|---|
|transformProject|a project file listing wmu files|full html|
|transformFragment|a wmu string|html fragment (without `body`, `head` and `html`)|
|transformPage|a wmu string|full html|


## Escaping characters

You can place `\\` before a character to 'escape' it. This to prevent it from having meaning. For instance:

```
|par|format=cssclass
|=
\\|A paragraph that starts with a |

\\|code|language=wmu
\\|=
\\|code: for when you want to write some code 

|h1|=A title with \\| in it
```

Would look like:
``` 
|A paragraph that starts with a |

|code|language=wmu
|=
|code: for when you want to write some code 

A title with | in it
```


## Default variables

Some blocks have default variables, so you can leave the name out:

```
|h3|title=Chapter 3
```

Is the same as:

```
|h3|=Chapter 3
```

_Todo: list of default variables for each block that have one_

## Alignment

Blocks (with 'block-align=') and cells of tables can be aligned horizontally:

|Code|Alignment|
|---|---|
|`-:-`|center|
|`-:`|right|
|`:-`|left|
|`:-:`|justify|

## Vertical alignment

Cells in tables can also be aligned vertically:

|Code|Alignment|
|---|---|
|`T`|top|
|`-`|middle|
|`_`|bottom|

```
|table|:-:
|=
::header::
th 1|=|th 2|=|th 3|=|th 4|=|th 5
|=
::align::
:---|=|---:|=|:---:|=|-:-|=|---
|=
::valign::
T|=| |=|-|=| |=|_
|=
cell 1 |=| cell 2 |=| cell 3 |=| cell 4 |=| cell 5
```

## Standard Markup

||WMU markup|
|---|---|
|bold|`**text**`|
|italic|`//text//`|
|underscore|`!!text!!`|
|striketrough|`~~text~~`|
|inline quote|`""text""`|
|inline code|` ``text`` `|
|superscript|`^^text^^`|
|subscript|`__text__`|

## Other inline Markup codes

||WMU markup|
|---|---|
|css class|`[[text]]##cssclass#`|
|link|`[[text]]@@url@@`|
|img|_todo_|

## Titles / headers

Wmu knows 7 headers: h0 - h6. Use h0 if you want to group chapters (`h1`) into parts.

## Table of contents

Wmu has _automatic_ table of contents based on the headers. If the default is off, turn it on by using:

```
|config|toc=true|toctitle=Table of Contents
```

Note that `h6` is excluded from this. It should be used for normal headers without numbering

## Quotes

```
|quote
|=
Everything should be made as simple as possible, but not simpler
|=
Albert Einstein
```

## Images

```
|img|=https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg
|title=Image that explains it all
```

## Index

Terms in a text can be listed in an index with `[[text]]==listunder==`:

```
Some text with index word: [[Jung]]==Jung, Carl== etc.

Some text with index word: [[Freud]]==Freud, Sigmund== etc.
```

This will result in an index with the letters J and F and the items `Jung, Carl` and `Freud, Sigmund`.

## Notes

Wmu also supports notes:

```
This text has a note((1))

|fn|id=1
|=
This is the note
```

You can put notes everywhere you want (usually right after it is used like the example above). The note text will be moved to the end of a chapter, or at the end of the complete text/book. If there are no chapters, notes will be appended at the end of the text.

## Lists

```
|list|start=2|type=A
|=
1 should be B
2 should be C
3 should be D
```
Nested lists should always have | at the start of the line where the number of | determines the depth:


## Glossary

```
|glossary
|=
|css
|css3
||Cascading Style Sheets
|html
||Hyper Text Markup Language
```

## Block

```
|block|=thumbsup-class
|=
This is how it's done!
```

## Markdown-like titles

||WMU markup|
|---|---|
|h1 title|`title\n===`|
|h2 title|`title\n---`|

## Differences compated to Markdown

- wmu respects newlines
