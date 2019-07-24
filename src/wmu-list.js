var wmubase = require('./wmu-base');
var wmupar = require('./wmu-par');
  
function wmulistparse(allVar, body) {

  let result = [];

  result.push(
    '<ul' +
    (allVar['block-align'] || allVar['format']
      ? ` class="${(allVar['block-align'] ? wmubase.alignmentClass(allVar['block-align'], true) : '')} ` +
        `${(allVar['format'] ? allVar['format'] : '')} "`
      : '') +
    '>' + wmubase.eol);
  
  //result.push(body.replace(/^(- *)/gm, '').replace(/^(.+)$/gm, '\t<li>$1</li>'));
  result.push(listItems(body));

  result.push(wmubase.eol + '</ul>' + wmubase.eol + wmubase.eol);

  return result.join('');
}

function unorderedList(unused, ul) {
  return '<ul>' + wmubase.eol + 
      listItems(ul) + wmubase.eol +
      '</ul>';
}

function listItems(li) {
  return '\t<li>' + li.replace(/^- */gm,'').replace(/\r?\n?$/,'').split(/[\r\n]+/).join('</li>' + wmubase.eol + '\t<li>') + '</li>';
}

module.exports = {
  wmulistparse,
  unorderedList,
  listItems
};
  