# wmu

More advanced then Markdown, simpler than LaTeX

## Code

|folder|||
|---|---|---|
|`/src/`|source files (ts)||
|`/dist/es5/`|output of tsc|node (ES5)|
|`/dist/lib/`|output of webpack.config.js|browser umd (CommonJS, AMD, global variable)|
|`/dist/lib_esm/`|tsc -m es6 --outDir dist/lib-esm|ES6/ES2015|

## Bugs

- spaties: na tekst voor regeleinde, en op lege regel

## Handig:

- zie https://github.com/matteobruni/tsparticles/blob/master/webpack.config.js
- idem voor packages scripts!

## Todo
- alternatieve-regex.js
- todo: inline en block list?!
- todo: markdown compatability?
- adding |toc -> set createtoc to true
- output list of all used css classes

- footnotes, chapter endnotes, book endnotes
- footnote: -> note



- escape all characters
- escape blocks: |par \|code
- idee: **title** en daarna paragraaf tekst -> markdown-header-3

- alle .css naar een css map? of hoe dit ditribueren? (unpkg)

## Todo - programmeren

- `mode` in `webpack.config.js`
- package.json:     "build": "./node_modules/.bin/tsc"
- soms nog 'var' ipv 'let'?
- ts: return types van function ed
- ook css met webpack: https://webpack.js.org/loaders/css-loader/