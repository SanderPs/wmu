import * as wmubase from "./wmu-base";
  
export function parse(allVar: wmubase.IBlockDefinition) {

  let result = [];

  result.push('<figure>' + wmubase.eol);

  result.push(
    '<img' +
    wmubase.classAttr(
      wmubase.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? ''
    ) +
    ' src="' + allVar['src'] + '" />' + wmubase.eol);

  if (allVar['title']) {
      result.push('<figcaption>' + allVar['title'] + '</figcaption>' + wmubase.eol);
  }

  result.push('</figure>' + wmubase.eol + wmubase.eol);

  return result.join('');
}
