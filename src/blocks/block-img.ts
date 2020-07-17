import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition) {

  if (!allVar['src']?.length) {

    return '<div class="wmu-error">Image without source</div>';
  }

  let result = [];

  result.push('<figure>' + WmuLib.eol);

  result.push(
    '<img' +
    WmuLib.classAttr(
      WmuLib.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? ''
    ) +
    ' src="' + allVar['src'] + '" />' + WmuLib.eol);

  if (allVar['title']) {
      result.push('<figcaption>' + allVar['title'] + '</figcaption>' + WmuLib.eol);
  }

  result.push('</figure>' + WmuLib.eol + WmuLib.eol);

  return result.join('');
}
