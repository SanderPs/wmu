var wmu = require('./wmu-main');

let wmu_string = "|h|1|'Hoofdstuk 1'\r\nDit is een test\r\n\r\n" +
"Meer **bold** en //italics// en __underscore__ en ~~striketrough~~ enz\r\n" + 
"Een extra lege regel: \r\n" + 
"|.\r\n" + 
"Meerdere lege regels: \r\n\r\n\r\n\r\n"+
".\r\n" +
"|table\r\n|a|b|c|d|\r\n|:---|---:|:---:|---|\r\n|1|2|3|4|";

let html = wmu.transform(wmu_string);

console.log(html);
