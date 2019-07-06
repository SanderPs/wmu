
const regex_LineEscape = '\\|';
var wmubase = require('./wmu-base');


const regex_Header = new RegExp('^' + regex_LineEscape + 'h\\|(\\d{1,6})\\|\'(.*?)\'\\r?\\n','gm');
  
  const eol = "\r\n";
  
   transformheader = (match, level, title, offset, string) => {
  
    // initialize
 
  
    // store data

    wmubase.getToc().push(
        {
            level: level,
            title: title,
        }
    )
 
    // create output
  
    let result = [];

    result.push("<h" + level + ">" +
        title + 
        "</h" + level + ">" + eol);

    return result.join("");
  }
  
  module.exports = {
    transformheader,
    regex_Header
  };
  