var wmubase = require('./wmu-base');

function parse(allVar, header, body) {

  let result = [];

  result.push('<table' +
    wmubase.classAttr(
      (allVar['block-align'] ? wmubase.alignmentClass(allVar['block-align'], true) : ''),
      allVar['format']
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

function parse_body(body) {

  let result = [];

  if (body) {
    body = body.split(wmubase.eolIn);

    for (i = 0; i < body.length; i++) {
      result.push(
        body[i]
          .replace(
            /(.+)\|$/gm,
            '<tr>' + wmubase.eol + '\t<td>$1</td>' + wmubase.eol + '</tr>' + wmubase.eol
          )
          .replace(/\|/g, '</td>' + wmubase.eol + '\t<td>')
      );
    }
  }

  return result.join('');
}

function parse_header(header) {

  let rows = header.split(wmubase.eolIn); // todo: prevent error when not present
  let headerrow = rows[0].slice(0, -1).split(/ *\| */);
  let alignrow = [], valignrow = [];

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
      for (i = 0; i < alignrow.length; i++) {
        alignrow[i] = wmubase.alignmentClass(alignrow[i], false);
      }
    }

    if (valignrow.length) {
      for (i = 0; i < valignrow.length; i++) {
        valignrow[i] = wmubase.valignmentClass(valignrow[i]);
      }
    }
  }

  let result = [];

  result.push('<tr>' + wmubase.eol);

  for (i = 0; i < headerrow.length; i++) {
    result.push(
      '\t<th ' +
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

module.exports = {
  parse
};
