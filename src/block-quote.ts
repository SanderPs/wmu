import * as wmubase from "./wmu-base";

export function parse(allVar: wmubase.IBlockDefinition, quote: string, source: string) {

  let result: string[] = [];

  result.push(
    '<blockquote' +
    wmubase.classAttr(
      wmubase.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? ''
        ) +
  '>' + wmubase.eol);

  result.push('\t<p>' + wmubase.eol + quote + wmubase.eol + '\t</p>' + wmubase.eol);

  if (source) {
    result.push('\t<footer>' + source + '</footer>' + wmubase.eol);
  }

  result.push('</blockquote>' + wmubase.eol + wmubase.eol);

  return result.join('');
}
