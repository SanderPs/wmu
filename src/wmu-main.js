var wmutable = require('./wmu-table');

const regex_LineEscape = '\\|';
const regex_Paragraphs = new RegExp( '^(?!' + regex_LineEscape + ')(.+?)(?=$|\\r?\\n\\r?\\n)', 'gm');
const regex_EmptyLines = new RegExp('(^' + regex_LineEscape + '\\.\\r?\\n)','gm');
const regex_Headers = new RegExp('^' + regex_LineEscape + 'h\\|(\\d{1,6})\\|\'(.*?)\'\\r?\\n','gm');
const regex_Bold = /(?:\*\*)(.+)(?:\*\*)/;
const regex_Italic = /(?:\/\/)(.+)(?:\/\/)/;
const regex_Underscore = /(?:\_\_)(.+)(?:\_\_)/;
const regex_Striketrough = /(?:~~)(.+)(?:~~)/;
const regex_Tablex = /^\|table.*\r?\n(^\|.+\r?\n?)+/gm


const eol = "\r\n";

const options = {
    eol : eol
};

function transform(x){
    x=x.replace(regex_Paragraphs, '<p>$&</p>');
    x=x.replace(regex_EmptyLines, '<br>\r\n');
    x=x.replace(regex_Headers, '<h$1>$2</h$1>\r\n');
    x=x.replace(regex_Bold, '<b>$1</b>');
    x=x.replace(regex_Italic, '<i>$1</i>');
    x=x.replace(regex_Underscore, '<u>$1</u>');
    x=x.replace(regex_Striketrough, '<del>$1</del>');
    x=x.replace(wmutable.regex_Table, wmutable.transformtable)
    return x;
}

function converttablexx(match, p1, p2, p3, offset, string) {

    let item = {
        type: 'table',
        header: p1.replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: p2.replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: p3 ? p3.replace(/\n$/, '').split('\n') : []
      };

      let result = []
      result.push("<table>" + eol);

      if (item.header.length === item.align.length) {

        for (i = 0; i < item.align.length; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        result.push("<tr>" + eol);
        for (i=0; i<item.header.length; i++) {
            result.push("\t<th" + (item.align[i] ? " align='" + item.align[i] + "'" : "") + ">" + item.header[i] + "</th>" + eol);
        }
        result.push("</tr>" + eol);
      }
    
      for (i = 0; i < item.cells.length; i++) {
        result.push( 
            (
                item.cells[i].replace(/^\|(.+)\|$/gm, '<tr>' + eol + '\t<td>$1</td>' + eol + '</tr>' + eol)
            ).replace(/\|/g, '</td>' + eol + '\t<td>')
        );
      }
      result.push('</table>' + eol);
    return result.join('');
}

module.exports = {
    transform
}
