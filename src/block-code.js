var wmubase = require('./wmu-base');
  
function parse(allVar, body) {

  let result = [];

  result.push(
    '<pre' +
    wmubase.classAttr(
      (allVar['block-align'] ? wmubase.alignmentClass(allVar['block-align'], true) : null),
      allVar['format'],
      allVar['language'] ? 'devlang-' + allVar['language'] : null
    ) +
    '><code>' + wmubase.eol);
  
  result.push(body);

  result.push(wmubase.eol + '</code></pre>' + wmubase.eol + wmubase.eol);

  return result.join('');
}
  
module.exports = {
  parse
};
  