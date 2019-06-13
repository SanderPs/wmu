
const regex_Quote = new RegExp(
  "^\\|quote\\|?(.*)\\r?\\n" +
  "((?:\\|(?:source|format)\\|.*\\r?\\n)*)" +
  " *\\|?( *[-:]+[-| :]*)" +
  "(?:\\r?\\n?)" +
  "((?:^\\|.*\\r?\\n)*)",
  "gm"
);

const eol = "\r\n";

function transformquote(match, algnblck, opt, algn, bdy, offset, string) {

  // initialize

  let item = {
    aligntable: tableAlignment(algnblck),
    options: opt.replace(/\r?\n$/, "").split(/[\r\n]+/),
    alignrow: algn.replace(/^ *|\| *$/g, "").split(/ *\| */),
    body: bdy.replace(/ *\| */g, "\t")
  };

  let tableSource = null;
  let tableFormat = null;
  for (i = 0; i < item.options.length; i++) {
    let option = item.options[i].match(/\|(.+)\|(.+)/);
    switch (option[1]) {
      case "source":
        tableSource = option[2];
        break;
      case "format":
        tableFormat = option[2];
        break;
      }
  }

  // create output

  let result = [];
  result.push(
    "<blockquote" +
    (item.aligntable || tableFormat
      ? " class='" +
      (item.aligntable ? "table-" + item.aligntable + " " : "") +
      (tableFormat ? tableFormat + " " : "")
      : "") +
    "'>" +
    eol
  );

  result.push("<p>" + eol + item.body + "</p>" + eol);

  if (tableSource) {
    result.push("<footer>" + tableSource + "</footer>" + eol);
  }

  result.push("</blockquote>" + eol);

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
  transformquote,
  regex_Quote
};
