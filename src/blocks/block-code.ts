import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, body: string) {

  let result = [];

  result.push(
    '<pre' +
    WmuLib.classAttr(
      WmuLib.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? '',
      allVar['language'] ? 'codelang-' + allVar['language']?.toLowerCase() : ''
    ) +
    '><code>'); // note: no eol here! will produce empty line
  
  result.push( body ? WmuLib.Encode( WmuLib.NormalizeNewline(body) ) : '[Warning: no code found]' );

  result.push(WmuLib.eol + '</code></pre>' + WmuLib.eol + WmuLib.eol);

  return result.join('');
}
  