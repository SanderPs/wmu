# wmu

More advanced then Markdown, simpler then LaTeX

## Code

|folder|||
|---|---|---|
|`/src/`|source files (ts)||
|`/lib/`|output of tsc|node (ES5)|
|`/dist/`|output of webpack.config.js|browser umd (CommonJS, AMD, global variable)|
|`/lib_esm/`|tsc -m es6 --outDir lib-esm|ES6/ES2015|

NB: anders opzetten: alles in `/dist/` (zie notes-wmu/.../js-versions.wmu)

## Bugs

- spaties: na tekst voor regeleinde, en op lege regel

## Handig:

- zie https://github.com/matteobruni/tsparticles/blob/master/webpack.config.js
- idem voor packages scripts!

## Todo

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