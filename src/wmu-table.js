const regex_Tablexxx = /^\|table\|?(.*)\r?\n((:?|format|).+)\r?\n *\|(.+)\r?\n *\|?( *[-:]+[-| :]*)(?:\r?\n((?: *[^>\r?\n ].*(?:\r?\n|$))*)\r?\n*|$)/gm;
const regex_Table = new RegExp(
  "^\\|table\\|?(.*)\\r?\\n" +
  "((?:\\|(?:caption|format)\\|.*\\r?\\n)*)" +
  " *\\|(.+)\\r?\\n" +
  " *\\|?( *[-:]+[-| :]*)" +
  "(?:\\r?\\n((?: *[^>\\r?\\n ].*(?:\\r?\\n|$))*)\\r?\\n*|$)",
  "gm"
);

const eol = "\r\n";

function transformtable(match, p0, p1, p2, p3, p4, offset, string) {

  // initialize

  let item = {
    aligntable: tableAlignment(p0),
    options: p1.replace(/\r?\n$/, "").split(/[\r\n]+/),
    header: p2.replace(/^ *| *\| *$/g, "").split(/ *\| */),
    alignrow: p3.replace(/^ *|\| *$/g, "").split(/ *\| */),
    cells: p4 ? p4.replace(/\n$/, "").split("\n") : []
  };

  let tableCaption = null;
  let tableFormat = null;
  for (i = 0; i < item.options.length; i++) {
    let option = item.options[i].match(/\|(.+)\|(.+)/);
    switch (option[1]) {
      case "caption":
        tableCaption = option[2];
        break;
      case "format":
        tableFormat = option[2];
        break;
    }
  }

  // create output

  let result = [];
  result.push(
    "<table" +
    (item.aligntable || tableFormat
      ? " class='" +
      (item.aligntable ? "table-" + item.aligntable + " " : "") +
      (tableFormat ? tableFormat + " " : "")
      : "") +
    "'>" +
    eol
  );

  if (tableCaption) {
    result.push("<caption>" + tableCaption + "</caption>" + eol);
  }
  if (item.header.length === item.alignrow.length) {
    for (i = 0; i < item.alignrow.length; i++) {
      item.alignrow[i] = tableAlignment(item.alignrow[i]);
    }

    result.push("<tr>" + eol);
    for (i = 0; i < item.header.length; i++) {
      result.push(
        "\t<th" +
        (item.alignrow[i] ? " align='" + item.alignrow[i] + "'" : "") +
        ">" +
        item.header[i] +
        "</th>" +
        eol
      );
    }
    result.push("</tr>" + eol);
  }

  for (i = 0; i < item.cells.length; i++) {
    result.push(
      item.cells[i]
        .replace(
          /^\|(.+)\|$/gm,
          "<tr>" + eol + "\t<td>$1</td>" + eol + "</tr>" + eol
        )
        .replace(/\|/g, "</td>" + eol + "\t<td>")
    );
  }
  result.push("</table>" + eol);

  return result.join("");
}

function tableAlignment(str) {
  if (/^-+:$/.test(str)) {
    return "right"; // -:  right
  } else if (/^-+:-+$/.test(str)) {
    return "center"; // -:- center
  } else if (/^:-+$/.test(str)) {
    return "left"; // :-  left
  } else if (/^:-+:$/.test(str)) {
    return "fill"; // :-: fill = table: 100%, cell: justify
  }
  return null;
}

module.exports = {
  transformtable,
  regex_Table
};
