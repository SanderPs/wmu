import * as wmubase from "./../wmu-base";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition) {

  if (!allVar['src']?.length) {

    return '<div class="wmu-error">Image without source</div>';
  }

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
