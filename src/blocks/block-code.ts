import { stringify } from "querystring";
import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, body: string[]) {

  let result = [];
  let tmp_output = 'table'; // or 'code-pre' (the old way)

  result.push(
    tmp_output === 'code-pre' ? '<pre' : '<div class="code-default">' + WmuLib.eol + '\t<table'
  );

  result.push(
    WmuLib.classAttr(
      WmuLib.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? '',
      allVar['language'] ? 'codelang-' + allVar['language']?.toLowerCase() : ''
    )
  );

  result.push(
    (tmp_output === 'code-pre') ? '><code>' + WmuLib.eol : '>' + WmuLib.eol // note: no eol between <pre> and <code>; this will produce empty line
  );

  result.push( body?.length ? 
    (tmp_output === 'code-pre') ?
      WmuLib.Encode( WmuLib.NormalizeNewline( body[0] ) )
      :
      parseCode( body[0] )
    : '[Warning: no code found]'
  );

  result.push(
    (tmp_output === 'code-pre') ? 
    '\t</code>' + WmuLib.eol + '</pre>' 
    : 
    '\t</table>' + WmuLib.eol + '</div>' + WmuLib.eol + WmuLib.eol
  );

  return result.join('');
}

function parseCode(code: string): string {
  let result = [];
  let regex = /([\s\S]*?)(?:::([^:]*?)::)?(?:\r?\n|$)/g; // TODO: uses "negative lookbehind", browser support?
  let res: RegExpExecArray;

  while (( res = regex.exec( code )) !== null) {
    if (res.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    else {
      result.push( '\t\t<tr' + 
        (res[2] ? ' class="' + res[2] + '"' : '') + 
        '><td>' + (res[1] && res[1].length ? WmuLib.Encode( res[1] ) : '&nbsp;') + '</td></tr>' + WmuLib.eol );
    }
  }

  return result.join('');
}