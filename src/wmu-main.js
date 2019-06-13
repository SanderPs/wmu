var wmutable = require('./wmu-table');
var wmuquote = require('./wmu-quote');

const regex_LineEscape = '\\|';
const regex_Paragraphs = new RegExp( '^(?!' + regex_LineEscape + ')(.+?)(?=$|\\r?\\n\\r?\\n)', 'gm');
const regex_EmptyLines = new RegExp('(^' + regex_LineEscape + '\\.\\r?\\n)','gm');
const regex_Headers = new RegExp('^' + regex_LineEscape + 'h\\|(\\d{1,6})\\|\'(.*?)\'\\r?\\n','gm');
const regex_Bold = /(?:\*\*)(.+)(?:\*\*)/;
const regex_Italic = /(?:\/\/)(.+)(?:\/\/)/;
const regex_Underscore = /(?:\_\_)(.+)(?:\_\_)/;
const regex_Striketrough = /(?:~~)(.+)(?:~~)/;
const regex_InlineQuote = /(?:"")(.+)(?:"")/;

function transform(x){
    x=x.replace(regex_Paragraphs, '<p>$&</p>');
    x=x.replace(regex_EmptyLines, '<br>\r\n');
    x=x.replace(regex_Headers, '<h$1>$2</h$1>\r\n');
    x=x.replace(regex_Bold, '<b>$1</b>');
    x=x.replace(regex_Italic, '<i>$1</i>');
    x=x.replace(regex_Underscore, '<u>$1</u>');
    x=x.replace(regex_Striketrough, '<del>$1</del>');
    x=x.replace(regex_InlineQuote, '<q>$1</q>');
    x=x.replace(wmutable.regex_Table, wmutable.transformtable);
    x=x.replace(wmuquote.regex_Quote, wmuquote.transformquote);
    return x;
}

module.exports = {
    transform
}
