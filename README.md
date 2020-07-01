# wmu

More advanced than Markdown, simpler than LaTeX

This is a library that converts wmu to html.

**Note** this repository is not ready yet for its first beta release!!! There are still many things that need to be finished, figured out or rewriten.

Read the [quick introduction](wmu.md) to get an idea of wmu markup

## Main issues

- using JS find and replace is fast but doesn't result in clean/solid code
- started as proof-of-concept js code, so it's not really clean and solid everywhere (yet!)
- i am still figuring out what wmu should be like, so some code is a bit experimetal/temporary
- css files are also just to make it work and/or temporary

## Run the code

### 1 In a browser

```
> npm install
> npm run build
```

Then open `/examples/demo/demo.html` in your browser!

### 2 In VS Code

Open in VS Code and run (F5)

## Roadmap

#### PagedJS

Render books using (CSS) Paged Media

https://www.pagedjs.org/documentation/02-getting-started-with-paged-js/#starting-pagedjs  
https://github.com/pagedjs/pagedjs  
https://www.pagedmedia.org/paged-js/  

#### JSON support

Support for JSON blocks

https://lihautan.com/json-parser-with-javascript/

#### Text to Diagram support

For instance:  

https://github.com/mermaid-js/mermaid  
https://www.diagram.codes/ (commercial)  
https://modeling-languages.com/text-uml-tools-complete-list/  

## Code

|folder|||
|---|---|---|
|`/src/`|source files (ts)||
|`/dist/es5/`|output of tsc|ES5|
|`/dist/lib/`|output of webpack|umd for browser (CommonJS, AMD, global variable)|
|`/dist/lib_esm/`|output of tsc (-m es6)/lib-esm|ES6/ES2015|

## Bugs

(none)

## Todo

- `|cover`
- `> npx wmu --watch`
- not only return html, but also errors and warnings
- alternatieve-regex.js
- in latex `{\"o}` is automatically converted to `ö`
- todo: inline en block list?!
- todo: markdown compatability?
- adding |toc -> set createtoc to true
- output list of all used css classes
- footnotes, chapter endnotes, book endnotes
- footnote: -> note
- unescape inline markup etc. (for writing about wmu)
- escape all characters
- escape blocks: |par \|code
- idee: **title** en daarna paragraaf tekst -> markdown-header-3

## Todo - programmeren

- soms nog 'var' ipv 'let'?
- ts: return types van function ed
- ook css met webpack naar /dist/: https://webpack.js.org/loaders/css-loader/