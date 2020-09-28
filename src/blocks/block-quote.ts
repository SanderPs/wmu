import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, quote: string) {

  let result: string[] = [];

  let text = quote.split(/[ \t\r\n]*\|=\|[ \t\r\n]*/m);

  result.push(
    '<blockquote' +
    WmuLib.classAttr(
      WmuLib.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? ''
        ) +
  '>' + WmuLib.eol);

  result.push('\t<div>' + WmuLib.eol + WmuLib.NewlineToBr( text[0] ) + WmuLib.eol + '\t</div>' + WmuLib.eol);

  if (text?.[1]?.length) {
    result.push('\t<footer>' + WmuLib.NewlineToBr( text[1] ) + '</footer>' + WmuLib.eol);
  }

  result.push('</blockquote>' + WmuLib.eol + WmuLib.eol);

  return result.join('');
}
