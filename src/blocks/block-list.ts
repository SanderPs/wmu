import * as wmubase from "./../wmu-base";
import * as wmulist from "./../wmu-list";
   
export function parse(allVar: wmubase.IBlockDefinition, body: string) {
    return new wmulist.ListTree(body).toHtml();
}

export function unorderedList(unused: string, ul: string) {
  return '' +
    '<ul>' + wmubase.eol + 
      listItems(ul) + wmubase.eol +
    '</ul>';
}

export function listItems(li: string) {
  return '' + 
    '\t<li>' +
      li.replace(/^- */gm,'')
        .replace(/\r?\n?$/,'')
        .split(/[\r\n]+/)
        .join('</li>' + wmubase.eol + '\t<li>') +
    '</li>';
}
  