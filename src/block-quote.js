var wmubase = require('./wmu-base');

function parse(allVar, quote, source) {

  let result = [];

  result.push(
    '<blockquote' +
    wmubase.classAttr(
      (allVar['block-align'] ? wmubase.alignmentClass(allVar['block-align'], true) : ''),
      allVar['format']
        ) +
  '>' + wmubase.eol);

  result.push('\t<p>' + wmubase.eol + quote + wmubase.eol + '\t</p>' + wmubase.eol);

  if (source) {
    result.push('\t<footer>' + source + '</footer>' + wmubase.eol);
  }

  result.push('</blockquote>' + wmubase.eol + wmubase.eol);

  return result.join('');
}

module.exports = {
  parse
};
