import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, header: string, body: string) {

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

  result.push(parse_header(header));

  result.push(parse_body(body));

  result.push('</table>' + WmuLib.eol + WmuLib.eol);

  return result.join('');
}

function parse_body(body: string) {

  let result = [];

  if (body) {
    let rows: string[] = body.split(WmuLib.eolIn);

    for (let i = 0; i < rows.length; i++) {
      result.push(
        rows[i]
          // first the beginning and end of a row:
          .replace( 
            /(.+)\|$/gm,
            '<tr>' + WmuLib.eol +
            '\t<td>$1</td>' + WmuLib.eol +
            '</tr>' + WmuLib.eol
          )
          // then each pipe character:
          .replace(/\|/g, '</td>' + WmuLib.eol + '\t<td>')
      );
    }
  }

  return result.join('');
}

function parse_header(header: string) {

  let rows: string[] = header.split(WmuLib.eolIn); // todo: prevent error when not present
  let headerrow: string[] = rows[0].slice(0, -1).split(/ *\| */);
  
  let alignrow: string[] = []; // per column a css class for horizontal alignment
  let valignrow: string[] = []; // per column a css class for vertical alignment

  if (rows.length > 1) {
    for (let x = 1; x < rows.length; x++) {
      if (/^v=/.test(rows[x])) {
        // vertical align
        valignrow = rows[x].slice(2, -1).split(/ *\| */);
      } else {
        // horizontal align
        alignrow = rows[x].slice(0, -1).split(/ *\| */);
      }
    }

    if (alignrow.length) {
      for (let i = 0; i < alignrow.length; i++) {
        alignrow[i] = WmuLib.alignmentClass(alignrow[i], false) ?? '';
      }
    }

    if (valignrow.length) {
      for (let i = 0; i < valignrow.length; i++) {
        valignrow[i] = WmuLib.valignmentClass(valignrow[i]);
      }
    }
  }

  let result = [];

  result.push('<tr>' + WmuLib.eol);

  for (let i = 0; i < headerrow.length; i++) {
    result.push(
      '\t<th' +
      WmuLib.classAttr(alignrow[i], valignrow[i]) +
      '>' +
      headerrow[i] +
      '</th>' +
      WmuLib.eol
    );
  }

  result.push('</tr>' + WmuLib.eol);

  return result.join('');
}
