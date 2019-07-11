
const regex_LineEscape = '\\|';
var wmutoc = require('./wmu-toc');


const regex_Header = new RegExp('^' + regex_LineEscape + 'h\\|(\\d{1,6})\\|\'(.*?)\'\\r?\\n','gm');
  
  const eol = "\r\n";
  
   transformheader = (match, level, title, offset, string) => {

    level = parseInt(level, 10);


    // initialize
 
    let id = makeid(8); //title.replace(/[^a-zA-Z0-9_]/, '');
  

    // store data

    let toc = wmutoc.tocTree;

    //console.log('- ' + level + ': ' + title);

    toc.addSequential(title, level, id);


    // create output
  
    let result = [];

    result.push("<h" + level + " id='" + id + "'>" +
        title + 
        "</h" + level + ">" + eol);

    return result.join("");
  }
  
  function revisedRandId() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

  module.exports = {
    transformheader,
    regex_Header
  };
  