var wmubase = require('./wmu-base');
var wmulist = require('./wmu-list');
   
function parse(allVar, body) {

  let result = [];

//  let listType = allVar['type'] ? allVar['type'] ? 
//  let numerical = allVar['start'] ?
//      /^\d/.test(allVar['start']) :
//      1 ;

  if (true) {
    
    return wmulist.newListTree(body).toHtml();

  } else {
  let items = body.split(wmubase.eolIn);

  let listInfo = [];
  let depth = -1;

  for (let x=0; x < items.length;  x++) {
    let row = items[x].match(/^(\|*)(.*?(?: +))(.*)$/);

    if (row[1].length !== depth) {

      if (row[1].length > depth) {
        // one down
        depth++;
        let listUnordered = row[2].charAt(0) === '-';
        listInfo.push({
          type: row[2].charAt(0),
          index: 1,
          depth: depth
        });


        result.push('\n' + '\t'.repeat(depth) + '<ul>\n');
        result.push('\t'.repeat(depth + 1) + '<li>' + row[3]);
      } else {
        // one up

        result.push('</li>\n' +'\t'.repeat(depth) + '</ul>\n');
        result.push('\t'.repeat(depth) + '</li>\n');
        result.push('\t'.repeat(depth) + '<li>' + row[3]);

        let crnt = listInfo.pop();
        depth--;
      }
    } else {
      // just another item
      result.push('</li>\n' + '\t'.repeat(depth + 1) + '<li>' + row[3]);
    }
  }
  for (let y=listInfo.length-1; y>=0; y--) {
    result.push('\t'.repeat(listInfo[y].depth + 1) + '</li>\n');
    result.push('\t'.repeat(listInfo[y].depth) + '</ul>\n');
    }


    let numerical = false; // todo
  result.push(
    '<' + (numerical ? 'ol' : 'ul') +
    (allVar['start'] ? ' start="' + allVar['start'] + '"' : '') +
    (allVar['type'] ? ' type="' + allVar['type'] + '"': '') + 
    wmubase.classAttr(
      (allVar['block-align'] ? wmubase.alignmentClass(allVar['block-align'], true) : ''),
      allVar['format']
      ) +
    '>' + wmubase.eol);
  
  result.push(listItems(body));

  result.push(wmubase.eol + '</' + (numerical ? 'ol' : 'ul') + '>' + wmubase.eol + wmubase.eol);
    }

  return result.join('');
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
  