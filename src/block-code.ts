import * as wmubase from "./wmu-base";
  
export function parse(allVar: wmubase.IBlockDefinition, body: string) {

  let result = [];

  result.push(
    '<pre' +
    wmubase.classAttr(
      wmubase.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? '',
      allVar['language'] ? 'codelang-' + allVar['language']?.toLowerCase() : ''
    ) +
    '><code>' + wmubase.eol);
  
  result.push(body);

  result.push(wmubase.eol + '</code></pre>' + wmubase.eol + wmubase.eol);

  return result.join('');
}
  