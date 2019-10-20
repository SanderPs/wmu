var wmubase = require('./wmu-base');
  
function parse(allVar, body) {

    let result = [];

    // <dl>
    //    <dt>
    //    <dd>

    let items = body.split(wmubase.eolIn);

    if (items.length) {

        result.push('<dl>' + wmubase.eol + '\t<div>' + wmubase.eol);
        
        let prevdef = false;
        for (let x=0; x < items.length;  x++) {
            let def = items[x].charAt(0) === '|';
            
            if (!def && prevdef) {
                result.push('\t<div>' + wmubase.eol + '\t</div>' + wmubase.eol);
            }
            
            if (def) {
                result.push('\t\t<dd>' + items[x].substr(1) + '</dd>' + wmubase.eol);
            } else {
                result.push('\t\t<dt>' + items[x] + '</dt>' + wmubase.eol);
            }

            prevdef = def;
        }
        
        result.push('\t</div>' + wmubase.eol + '</dl>' + wmubase.eol + wmubase.eol);
    }

    return result.join('');
}
  
module.exports = {
  parse
};
  