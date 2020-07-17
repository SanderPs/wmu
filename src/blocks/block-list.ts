import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";
import * as wmulist from "./../features/wmu-list";

export function parse(allVar: IBlockDefinition, body: string) {
    return new wmulist.ListTree(body).toHtml();
}

export function unorderedList(unused: string, ul: string) {
  return '' +
    '<ul>' + WmuLib.eol + 
      listItems(ul) + WmuLib.eol +
    '</ul>';
}

export function listItems(li: string) {
  return '' + 
    '\t<li>' +
      li.replace(/^- */gm,'')
        .replace(/\r?\n?$/,'')
        .split(/[\r\n]+/)
        .join('</li>' + WmuLib.eol + '\t<li>') +
    '</li>';
}
  