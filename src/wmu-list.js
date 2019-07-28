var wmubase = require('./wmu-base');
var wmupar = require('./wmu-par');
  
function wmulistparse(allVar, body) {

  let result = [];

  result.push(
    '<ul' +
    wmubase.classAttr(
      (allVar['block-align'] ? wmubase.alignmentClass(allVar['block-align'], true) : ''),
      allVar['format']
      ) +
    '>' + wmubase.eol);
  
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
  