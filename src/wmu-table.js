var wmubase = require('./wmu-base');

function wmutableparse(allVar, header, body) {

  let result = [];

  result.push('<table' +
  (allVar['block-align'] || allVar['format']
    ? ' class="' +
    (allVar['block-align'] ? 'table-' + wmubase.alignmentClass(allVar['block-align']) + ' ' : '') +
    (allVar['format'] ? allVar['format'] + ' ' : '')
    + '"'
    : '') +
  '>' + wmubase.eol);
  
  if (allVar['caption']) {
    result.push('<caption>' + allVar['caption'] + '</caption>' + wmubase.eol);
  }

  result.push( wmutableparse_header(header) );

  result.push( wmutableparse_body(body) );

  result.push( '</table>' + wmubase.eol + wmubase.eol );

  return result.join('');
}

function wmutableparse_body(body) {

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

function wmutableparse_header(header) {

  let rows = header.split(wmubase.eolIn); // todo: prevent error when not present
  let headerrow = rows[0].slice(0,-1).split(/ *\| */);
  let alignrow = rows[1].slice(0,-1).split(/ *\| */);

  let result = [];

  for (i = 0; i < alignrow.length; i++) {
    alignrow[i] = wmubase.alignmentClass(alignrow[i]);
  }

  result.push('<tr>' + wmubase.eol);
  for (i = 0; i < headerrow.length; i++) {
    result.push(
      '\t<th' +
      (alignrow[i] ? ' class="cell-' + alignrow[i] + '"' : '') +
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
  wmutableparse
};
