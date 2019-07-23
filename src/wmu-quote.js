var wmubase = require('./wmu-base');

function wmuquoteparse(allVar, quote, source) {

  let result = [];

  // todo: iets anders met classes
  result.push(
    '<blockquote' +
    (allVar['block-align'] || allVar['format']
    ? ' class="' +
    (allVar['block-align'] ? 'table-' + wmubase.alignmentClass(allVar['block-align'], true) + ' ' : '') +
    (allVar['format'] ? allVar['format'] + ' ' : '')
    + '"'
    : '') +
  '>' + wmubase.eol);


  result.push('\t<p>' + wmubase.eol + quote + wmubase.eol + '\t</p>' + wmubase.eol);

  if (source) {
    result.push('\t<footer>' + source + '</footer>' + wmubase.eol);
  }

  result.push('</blockquote>' + wmubase.eol + wmubase.eol);

  return result.join('');
}

module.exports = {
  wmuquoteparse
};
