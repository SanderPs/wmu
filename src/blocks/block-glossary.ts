import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, body: string) {

    let result = [];

    // <dl>
    //    <dt>
    //    <dd>

    let items = body.split(WmuLib.eolIn);

    if (items.length) {

        result.push('<dl>' + WmuLib.eol + '\t<div>' + WmuLib.eol);
        
        let prevdef = false;
        for (let x=0; x < items.length;  x++) {
            let def = /^\|\|/.test(items[x]);
            
            if (!def && prevdef) {
                result.push('\t<div>' + WmuLib.eol + '\t</div>' + WmuLib.eol);
            }
            
            if (def) {
                result.push('\t\t<dd>' + items[x].substr(2) + '</dd>' + WmuLib.eol);
            } else {
                result.push('\t\t<dt>' + items[x].substr(1) + '</dt>' + WmuLib.eol);
            }

            prevdef = def;
        }
        
        result.push('\t</div>' + WmuLib.eol + '</dl>' + WmuLib.eol + WmuLib.eol);
    }

    return result.join('');
}
