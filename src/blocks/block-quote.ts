import * as wmubase from "./../wmu-base";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, quote: string, source: string) {

  let result: string[] = [];

  result.push(
    '<blockquote' +
    wmubase.classAttr(
      wmubase.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? ''
        ) +
  '>' + wmubase.eol);

  result.push('\t<div>' + wmubase.eol + wmubase.NewlineToBr( quote ) + wmubase.eol + '\t</div>' + wmubase.eol);

  if (source) {
    result.push('\t<footer>' + source + '</footer>' + wmubase.eol);
  }

  result.push('</blockquote>' + wmubase.eol + wmubase.eol);

  return result.join('');
}
