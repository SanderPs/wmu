import * as wmubase from "./../wmu-base";
  
export function parse(allVar: wmubase.IBlockDefinition, body: string) {

  let result = [];

  result.push(
    '<div' +
    wmubase.classAttr(
      wmubase.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? ''
    ) +
    '>' + wmubase.eol);
  
  result.push(body);

  result.push(wmubase.eol + '</div>' + wmubase.eol + wmubase.eol);

  return result.join('');
}
