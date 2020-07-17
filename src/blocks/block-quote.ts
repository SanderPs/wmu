import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, quote: string, source: string) {

  let result: string[] = [];

  result.push(
    '<blockquote' +
    WmuLib.classAttr(
      WmuLib.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? ''
        ) +
  '>' + WmuLib.eol);

  result.push('\t<div>' + WmuLib.eol + WmuLib.NewlineToBr( quote ) + WmuLib.eol + '\t</div>' + WmuLib.eol);

  if (source) {
    result.push('\t<footer>' + source + '</footer>' + WmuLib.eol);
  }

  result.push('</blockquote>' + WmuLib.eol + WmuLib.eol);

  return result.join('');
}
