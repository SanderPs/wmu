var wmubase = require('./wmu-base');
var wmulist = require('./wmu-list');
   
function parse(allVar, body) {
    return new wmulist.ListTree(body).toHtml();
}

function unorderedList(unused, ul) {
  return '<ul>' + wmubase.eol + 
      listItems(ul) + wmubase.eol +
      '</ul>';
}

function listItems(li) {
  return '\t<li>' 
    + li.replace(/^- */gm,'')
      .replace(/\r?\n?$/,'')
      .split(/[\r\n]+/)
      .join('</li>' + wmubase.eol + '\t<li>') 
    + '</li>';
}

module.exports = {
  parse,
  unorderedList,
  listItems
};
  