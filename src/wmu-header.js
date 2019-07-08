
const regex_LineEscape = '\\|';
var wmubase = require('./wmu-base');


const regex_Header = new RegExp('^' + regex_LineEscape + 'h\\|(\\d{1,6})\\|\'(.*?)\'\\r?\\n','gm');
  
  const eol = "\r\n";
  
   transformheader = (match, level, title, offset, string) => {

    level = parseInt(level, 10);
    // initialize
 
    let id = makeid(8); //title.replace(/[^a-zA-Z0-9_]/, '');
  
    // store data

    let toc = wmubase.getToc();

    let parentEntry = toc.lastadded;
    while (level <= parentEntry.level) {
      parentEntry = parentEntry.parent;
    }

    parentEntry.children.push({ 
        name: title,
        level: level,
        parent: parentEntry,
        index: parentEntry.children.length + 1,
        children: []
      });
      toc.lastadded = parentEntry.children[parentEntry.children.length-1];
    


    // toc.list.push(
    //     {
    //         level: level,
    //         title: title,
    //         id: id,
    //     }
    // )
 
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
  