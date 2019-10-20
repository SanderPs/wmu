var wmubase = require('./wmu-base');
  
function parse(allVar, body) {

    let result = [];

    // <dl>
    //    <dt>
    //    <dd>

    let items = body.split(wmubase.eolIn);

    if (items.length) {

        result.push('<dl>' + wmubase.eol);
        
        for (let x=0; x < items.length;  x++) {
            let def = items[x].charAt(0) === '|';
            
            if (def) {
                result.push('\t<dd>' + items[x].substr(1) + '</dd>' + wmubase.eol);
            } else {
                result.push('\t<dt>' + items[x] + '</dt>' + wmubase.eol);
            }
        }
        
        result.push('</dl>' + wmubase.eol + wmubase.eol);
    }

    return result.join('');
}
  
module.exports = {
  parse
};
  