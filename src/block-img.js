var wmubase = require('./wmu-base');
  
function parse(allVar) {

  let result = [];

  result.push('<figure>' + wmubase.eol);

  result.push(
    '<img' +
    wmubase.classAttr(
      (allVar['block-align'] ? wmubase.alignmentClass(allVar['block-align'], true) : null),
      allVar['format']
    ) +
    ' src="' + allVar['src'] + '" />' + wmubase.eol);

  if (allVar['title']) {
      result.push('<figcaption>' + allVar['title'] + '</figcaption>' + wmubase.eol);
  }

  result.push('</figure>' + wmubase.eol + wmubase.eol);

  return result.join('');
}
  
module.exports = {
  parse
};
  