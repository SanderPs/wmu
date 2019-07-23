var wmubase = require('./wmu-base');
  
function wmulistparse(allVar, body) {

  let result = [];

  result.push(
    '<ul' +
    (allVar['block-align'] || allVar['format']
      ? ` class="${(allVar['block-align'] ? wmubase.alignmentClass(allVar['block-align'], true) : '')} ` +
        `${(allVar['format'] ? allVar['format'] : '')} "`
      : '') +
    '>' + wmubase.eol);
  
  result.push(body.replace(/^(- *)/gm, '').replace(/^(.+)$/gm, '\t<li>$1</li>'));

  result.push(wmubase.eol + '</ul>' + wmubase.eol + wmubase.eol);

  return result.join('');
}
  
module.exports = {
  wmulistparse
};
  