import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, body: string[]) {

  let result: string[] = [];

  result.push('<table' +
    WmuLib.classAttr(
      WmuLib.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? ''
    ) +
    '>' + WmuLib.eol);

  if (allVar['caption']) {
    result.push('<caption>' + allVar['caption'] + '</caption>' + WmuLib.eol);
  }

  result.push(parse_body(allVar, body));

  result.push('</table>' + WmuLib.eol + WmuLib.eol);

  return result.join('');
}

function parse_body(allVar: IBlockDefinition, body: string[]) {

  let result = [];

  let regex_header = /[ \t\r\n]*::header::[ \t\r\n]*/; // todo
  let regex_HAlign = /[ \t\r\n]*::h?align::[ \t\r\n]*/;
  let regex_VAlign = /[ \t\r\n]*::valign::[ \t\r\n]*/;

  let regex_cell = /[ \t\r\n]*\|=\|[ \t\r\n]*/gm;
  let HAlignCells: string[];

  if (body?.length) {

    for (let i = 0; i < body.length; i++) {

      let j = 0;

      let isHeader = regex_header.test(body[i]);
      if (isHeader) {
        body[i] = body[i].replace(regex_header, '');
      }

      let isHAlign = regex_HAlign.test(body[i]);
      if (isHAlign) {
        body[i] = body[i].replace(regex_HAlign, '');
        HAlignCells = body[i].split(regex_cell);
      }

      let isVAlign = regex_VAlign.test(body[i]);
      if (isVAlign) {
        body[i] = body[i].replace(regex_VAlign, '');
      }

      if (!isHAlign && !isVAlign) {
        let cellType = isHeader ? 'th' : 'td';

        result.push(
          // first the beginning and end of a row:
          ('\t<tr>' + WmuLib.eol +
            '\t\t<' + cellType +
            (HAlignCells?.[0] ?
              ' class="' + WmuLib.alignmentClass(HAlignCells?.[0], false) + '"' :
              ''
            ) +
            '>' +
            body[i] +
            '</' + cellType + '>' + WmuLib.eol +
            '\t</tr>' + WmuLib.eol)
            // then all inside seprators:
            .replace(/[ \t\r\n]*\|=\|[ \t\r\n]*/gm,
              function () {
                return '' +
                  '</' + cellType + '>' + WmuLib.eol +
                  '\t\t<' + cellType +
                  (HAlignCells?.[++j] ?
                    ' class="' + WmuLib.alignmentClass(HAlignCells?.[j], false) + '"' :
                    ''
                  ) +
                  '>'
              }
            )
        );
      }
    }
  }
  else {
    result.push( '[Warning: no table found]' );
  }

  return result.join('');
}
