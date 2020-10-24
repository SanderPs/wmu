import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, body: string[]) {

  let result = [];

  result.push(
    '<div' +
    WmuLib.classAttr(
      WmuLib.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? ''
    ) +
    '>' + WmuLib.eol);
  
  result.push(body);

  result.push(WmuLib.eol + '</div>' + WmuLib.eol + WmuLib.eol);

  return result.join('');
}
