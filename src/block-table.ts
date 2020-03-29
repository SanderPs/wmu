import * as wmubase from "./wmu-base";

export function parse(allVar: wmubase.IBlockDefinition, header: string, body: string) {

  let result: string[] = [];

  result.push('<table' +
    wmubase.classAttr(
      wmubase.alignmentClass(allVar['block-align'] ?? '', true) ?? '',
      allVar['format'] ?? ''
    ) +
    '>' + wmubase.eol);

  if (allVar['caption']) {
    result.push('<caption>' + allVar['caption'] + '</caption>' + wmubase.eol);
  }

  result.push(parse_header(header));

  result.push(parse_body(body));

  result.push('</table>' + wmubase.eol + wmubase.eol);

  return result.join('');
}

function parse_body(body: string) {

  let result = [];

  if (body) {
    let rows: string[] = body.split(wmubase.eolIn);

    for (let i = 0; i < rows.length; i++) {
      result.push(
        rows[i]
          // first the beginning and end of a row:
          .replace( 
            /(.+)\|$/gm,
            '<tr>' + wmubase.eol +
            '\t<td>$1</td>' + wmubase.eol +
            '</tr>' + wmubase.eol
          )
          // then each pipe character:
          .replace(/\|/g, '</td>' + wmubase.eol + '\t<td>')
      );
    }
  }

  return result.join('');
}

function parse_header(header: string) {

  let rows: string[] = header.split(wmubase.eolIn); // todo: prevent error when not present
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
        alignrow[i] = wmubase.alignmentClass(alignrow[i], false) ?? '';
      }
    }

    if (valignrow.length) {
      for (let i = 0; i < valignrow.length; i++) {
        valignrow[i] = wmubase.valignmentClass(valignrow[i]);
      }
    }
  }

  let result = [];

  result.push('<tr>' + wmubase.eol);

  for (let i = 0; i < headerrow.length; i++) {
    result.push(
      '\t<th' +
      wmubase.classAttr(alignrow[i], valignrow[i]) +
      '>' +
      headerrow[i] +
      '</th>' +
      wmubase.eol
    );
  }

  result.push('</tr>' + wmubase.eol);

  return result.join('');
}
