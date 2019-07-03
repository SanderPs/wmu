
const regex_Code = new RegExp(
    "^\\|code\\|?(.*)\\r?\\n" +
    "((?:\\|(?:language)\\|.*\\r?\\n)*)" +
    " *\\|?( *[-:]+[-| :]*)" +
    "(?:\\r?\\n?)" +
    "((?:^\\|.*\\r?\\n?)*)",
    "gm"
  );
  
  const eol = "\r\n";
  
  function transformcode(match, algnblck, opt, algn, bdy, offset, string) {
  
    // initialize
  
    let item = {
      aligntable: tableAlignment(algnblck),
      options: opt.replace(/\r?\n$/, "").split(/[\r\n]+/),
      alignrow: algn.replace(/^ *|\| *$/g, "").split(/ *\| */),
      body: bdy.replace(/^\| */gm, "\t")
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
      "<pre" +
      (item.aligntable || tableFormat
        ? ` class='${item.aligntable} ${tableFormat}'`
        : "") +
      "><code>" );
  
    result.push(item.body);
  
    result.push("</code></pre>" + eol);
  
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
    transformcode,
    regex_Code
  };
  