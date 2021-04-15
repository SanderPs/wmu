import { IBlockDefinition, IHtmlPositions } from "./types";

export const eol = "\r\n";
export const eolIn = /\r?\n/;
export const eolInStr = '\r?\n'; // todo: hieronder in regexs vervangen

export const DefaultProjectFileName: string = 'config.wmu';

export function pageHtml(vars: IHtmlPositions): string {

  // todo: solve \r\n issues:
  let templ = `<!doctype html>
<html lang='${vars.lang}'>
\t<head>
\t\t<meta charset="utf-8">
\t\t<title>boek</title>

\t\t<link rel="stylesheet" href="css/book-imitate.css">
\t\t<link rel="stylesheet" href="css/base.css">
${vars.head}
\t</head>

\t<body class="multipage">

<div class="bookpage">
${vars.toc}
</div>
  
${vars.body}

${this.EndOfBookPlaceholder()}

${vars.index}

\t</body>
</html>`;

  return templ;
}

// todo: solve \r\n issues:
export function fragmentHtml(vars: IHtmlPositions): string {

  let templ = `${vars.toc}\r
\r
${vars.body}\r
\r
${vars.index}
`;

  return templ;
}

export function parseDef(str: string) {

  let parsedDef = str
    .replace(/^\|/, "") // remove all | at the beginning of each line
    .replace(/[\r\n\|]+$/, "") // remove all \r \n and | at the end of each line
    .split(/[\r\n\|]+/); // split on \r \n and |
    
  let isHeader = /(h|header)\d/.test(parsedDef[0]);
  let blockType = isHeader ? 'h' : parsedDef[0];
  
  let allVar : IBlockDefinition = {
    'block-type': blockType
  };
  
  if (isHeader) {
    allVar['level'] = parseInt( parsedDef[0].substring(1) ) ?? 7; // todo: error
  }

  for (let x = 1; x < parsedDef.length; x++) {
    let nameValue = parsedDef[x].split("=");
    if (nameValue.length === 1) { // cases: 'somevalue'
      if (/^\d+$/.test(nameValue[0])) {
        allVar['number'] = parseInt(nameValue[0], 10); // 'number=(digits)'
      } else {
        if (/[:-]+/.test(nameValue[0])) {
          allVar['block-align'] = nameValue[0]; // 'block-align=(alignment string with : and -)'
        } else {
          allVar['title'] = nameValue[0]; // else: 'title=(string)'
        }
      }
    } else { 
      if (nameValue[0].length === 0) { // cases: '=somevalue'
        // just a '=' without name -> default
        switch (blockType) {
          case 'header':
          case 'h':
            allVar['title'] = nameValue[1];
            break;
          case 'code':
          case 'c':
            allVar['language'] = nameValue[1];
            break;
          case 'block':
          case 'b':
            allVar['format'] = nameValue[1].split(/[ \t;,]+/);
            break;
          case 'img':
          case 'i':
            allVar['src'] = nameValue[1];
            break;
          case 'list':
          case 'l':
            allVar['start'] = nameValue[1];
            break;
          case 'footnote':
          case 'fn':
            allVar['id'] = nameValue[1];
            break;
        }
      } else {
        let key=nameValue[0];
        if (key=='w') {
          key='width';
        }
        allVar[key] = nameValue[1];
      }
    }
  }
  return allVar;
}

export function alignmentClass(str: string, isBlock: boolean): string | null {
  let prefix = isBlock ? 'block-' : 'text-';
  if (/^-+:$|r/.test(str)) {
    return prefix + 'right';
  } else if (/^-+:-+$|c/.test(str)) {
    return prefix + 'center';
  } else if (/^:-+$|l/.test(str)) {
    return prefix + 'left';
  } else if (/^:-+:$|f|c/.test(str)) {
    return prefix + 'fill'; // :-: fill = table: 100%, cell: justify
    // todo: justify alleen bij meerdere regels
  }
  return ''; // todo: throw
}

// todo: classAttr and attrString, should be one function

export function classAttr(...args: (string|string[])[]) {
  let list = args.filter(function (el) {
    let result = Array.isArray(el) ? el.join(' ') : el; // todo: flat?
    return el != null && el.length > 0;
  });

  return list.length ? ' class="' + list.join(' ') + '"' : '';
}

export function attrString(name: string, ...args: string[]) {
  let list = args.filter(function (el) {
    return el != null && el.length > 0;
  });

  return list.length ? name + '="' + list.join(' ') + '"' : '';
}

export function valignmentClass(str: string) {
  if (/_/.test(str)) {
    return 'v-bottom';
  } else if (/-/.test(str)) {
    return 'v-middle';
  } else if (/T/.test(str)) {
    return 'v-top';
  }
  return '';
}

// Create a signature hash
// based on: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
export function newElementId(str: string) {
  return 'id_' + hashCode(str); // todo: keep list and check
}

function hashCode(str: string, max?: number) {
  var hash = 0;
  if (!str.length) return hash;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(max ? hash % max : hash);
};

export function createNotesPlaceholder(el: string) {
  return `<!-- footnotes ${el} -->` + this.eol + this.eol;
}

export function EndOfBookPlaceholder() {
  return '<!-- # notes-endofbook # -->';
}

export function Encode(str: string) {
  return str?.replace(/[<>]/gim, function(i) {
    return '&#'+i.charCodeAt(0)+';';
  });
}

export function NewlineToBr(str: string) {
  return str.replace(/\r?\n/g, '<br />' + this.eol);
}

export function NormalizeNewline(str: string) {
  return str.replace(/\r?\n/g, this.eol);
}