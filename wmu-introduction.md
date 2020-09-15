
Blocks
---

Any wmu string is first split up in blocks and a blocks is defined by text followed by two or more newlines:

```
block 1

block 2
```

This is converted to:

```
<p>
block 1
</p>

<p>
block 2
</p>
```

But a block can start with a pipe '|' character and an identifier, for instance: '|quote ...' or '|glossary ...'

```
|quote
|=
Something someone apparently sometime said
|=
The name of this person
```

```
<blockquote>
	<div>
Something someone apparently sometime said
	</div>
	<footer>The name of this person</footer>
</blockquote>
```

As you can see blocks have parts and these are divided by a line with '|='.


Parts
---

Depending on the type of the block (based on the identifier), a block can have 0, 1 or 2 parts.

Example of a block without parts:

```
|header1|title=Chapter1
```

Note that this can also be written as: `|h1|=Chapter1`



Empty lines in blocks
---

Because you may want to use an empty line inside a block, you can use the pipe character '|' to 'connect' lines together:

```
|quote
|=
Something someone apparently sometime said
|
Something else someone apparently said some other time
```

In wmu all pipe charactes '|' at the beginning of a line of any of the parts are removed. So the above example could also have been written like this:

```
|quote
|=
|Something someone apparently sometime said
|
|Something else someone apparently said some other time
```




Single newlines
---
Wmu respects (single) newlines at the end of a line, and will turn these into <br/>'s. With the exception of |code block's.

```
Paragraph 1

Paragraph 2
With more text
```

```
<p>
Paragraph 1
</p>

<p>
Paragraph 2<br/>
With more text
</p>
```




Extra (more then 2) newlines
---

Because wmu split blocks on two *or more* newlines, you can use extra newlines in your source document to make it more readable, especially handy for header blocks:

```
|h1|=Chapter 1

Some text for Chapter 1




|h2|=Fist paragraph of Chapter 1

Some text for fist paragraph of Chapter 1
```



Table of contents
---

Wmu automatically creates a table of contents if you want to. You can do this by using a '|config' block:

Either:

```
|config|toc=true
```

Or:

```
|config|toctitle=Table of Content
```



Code
---

```
|code
|=
> npm -version
```

vs

```
``> npm -verions``
```



Benefits of wmu
---

More easy to extend then Markdown
