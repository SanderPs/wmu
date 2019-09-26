var wmubase = require('./wmu-base');
  
function parse(allVar, body) {

  let result = [];

  result.push(
    '<div' +
    wmubase.classAttr(
      (allVar['block-align'] ? wmubase.alignmentClass(allVar['block-align'], true) : null),
      allVar['format']
    ) +
    '>' + wmubase.eol);
  
  result.push(body);

  result.push(wmubase.eol + '</div>' + wmubase.eol + wmubase.eol);

  return result.join('');
}
  
module.exports = {
  parse
};
  