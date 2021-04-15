import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, body: string[]) {

    let result = [];

    // output:
    // <dl>
    //  <div>
    //    <dt>
    //    <dd>

    let items = body[0].split(WmuLib.eolIn);

    if (items.length) {

        result.push('<dl>' + WmuLib.eol);
        
        let prevlvl = -1;
        for (let x=0; x < items.length;  x++) {
            let lvl = (items[x].match(/^([\| \t])*/)[0].replace(/[\t ]/g,''))?.length;

            if (lvl<2 && lvl !== prevlvl) {
              if (prevlvl !== -1) {
                result.push('\t</div>' + WmuLib.eol);
              }
              result.push('\t<div class="dl-level-' + lvl + '">' + WmuLib.eol);
            }

            if (lvl===0) {
              result.push(
                '\t\t<dt>' + items[x] + '</dt>' + WmuLib.eol);
            }
            if (lvl===1) {
              result.push('\t\t<dt>' + items[x].substr(1) + '</dt>' + WmuLib.eol);
            }
            if (lvl===2) {
                result.push('\t\t<dd>' + items[x].substr(2) + '</dd>' + WmuLib.eol);
            }

            prevlvl = lvl;
        }
        if (prevlvl !== -1) {
          result.push('\t</div>' + WmuLib.eol);
        }

        result.push('</dl>' + WmuLib.eol + WmuLib.eol);
    }

    return result.join('');
}
