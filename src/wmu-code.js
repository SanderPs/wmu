var wmubase = require('./wmu-base');
  
function wmucodeparse(allVar, body) {

  let result = [];

  let tableLanguageStr = allVar['language'] ? 'devlang-' + allVar['language'] : '';
  result.push(
    '<pre' +
    (allVar['block-align'] || allVar['format'] || tableLanguageStr
      ? ` class="${(allVar['block-align'] ? wmubase.alignmentClass(allVar['block-align'], true) : '')} ` +
        `${(allVar['format'] ? allVar['format'] : '')} ${tableLanguageStr} "`
      : '') +
    '><code>' + wmubase.eol);
  
  result.push(body);

  result.push(wmubase.eol + '</code></pre>' + wmubase.eol + wmubase.eol);

  return result.join('');
}
  
module.exports = {
  wmucodeparse
};
  