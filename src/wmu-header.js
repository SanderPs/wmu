
const regex_LineEscape = '\\|';
var wmutoc = require('./wmu-toc');


const regex_Header = new RegExp('^' + regex_LineEscape + 'h\\|(\\d{1,6})\\|\'(.*?)\'\\r?\\n','gm');
  
  const eol = "\r\n";
  
   transformheader = (match, level, title, offset, string) => {

    level = parseInt(level, 10);


    // initialize
 
    let id = "id_" + hashCode(title + level);
  

    // store data

    let toc = wmutoc.tocTree;
    toc.addSequential(title, level, id);


    // create output

    return "<h" + level + " id='" + id + "'>" +
            title + 
            "</h" + level + ">" + eol;
  }
  
// based on: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
function hashCode(str,max){
  var hash = 0;
  if (!str.length) return hash;
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(max?hash%max:hash);
};


  module.exports = {
    transformheader,
    regex_Header
  };
  