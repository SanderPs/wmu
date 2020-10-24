import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, body: string[]) {

  let result: string[] = [];

  result.push(
    '<blockquote' +
    WmuLib.classAttr(
      WmuLib.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? ''
        ) +
  '>' + WmuLib.eol);

  result.push('\t<div>' + WmuLib.eol + WmuLib.NewlineToBr( body[0] ) + WmuLib.eol + '\t</div>' + WmuLib.eol);

  if (body?.[1]?.length) {
    result.push('\t<footer>' + WmuLib.NewlineToBr( body[1] ) + '</footer>' + WmuLib.eol);
  }

  result.push('</blockquote>' + WmuLib.eol + WmuLib.eol);

  return result.join('');
}
