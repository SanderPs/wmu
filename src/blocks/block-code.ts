import { stringify } from "querystring";
import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, body: string[], output: string) {

  let result = [];
  let output_codepre = (output === 'code-pre'); // otherwise: 'table'

  result.push(
    output_codepre ? '<pre' : '<div class="code-default">' + WmuLib.eol + '\t<table'
  );

  result.push(
    WmuLib.classAttr(
      WmuLib.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'],
      allVar['language'] ? 'codelang-' + allVar['language']?.toLowerCase() : ''
    )
  );

  result.push(
    output_codepre ? '><code>' + WmuLib.eol : '>' + WmuLib.eol // note: no eol between <pre> and <code>; this will produce empty line
  );

  result.push( body?.length ? 
    output_codepre ?
      WmuLib.Encode( WmuLib.NormalizeNewline( body[0] ) )
      :
      parseCode( body[0] )
    : '[Warning: no code found]'
  );

  result.push(
    output_codepre ? 
    '\t</code>' + WmuLib.eol + '</pre>' 
    : 
    '\t</table>' + WmuLib.eol + '</div>' + WmuLib.eol + WmuLib.eol
  );

  return result.join('');
}

function parseCode(code: string): string {
  let result = [];
  let regex = /([\s\S]*?)(?:(?<!\])::(ins|del|note)::)?(?:\r?\n|$)/g; // TODO: uses "negative lookbehind", browser support?
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