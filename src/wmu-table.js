

const regex_Table = /^\|table\r?\n *\|(.+)\r?\n *\|?( *[-:]+[-| :]*)(?:\r?\n((?: *[^>\r?\n ].*(?:\r?\n|$))*)\r?\n*|$)/gm;

const eol = "\r\n";

    function transformtable(match, p1, p2, p3, offset, string) {

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
    transformtable,
    regex_Table
}
