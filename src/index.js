var wmu = require('./wmu-main');

const eol = "\r\n";

let wmu_string = "|h|1|'Hoofdstuk 1'" + eol +
    "Dit is een test" + eol + eol +
    "Meer **bold** en //italics// en __underscore__ en ~~striketrough~~ enz" + eol +
    "Een extra lege regel: " + eol +
    "|." + eol +
    "|table|:-:" + eol +
    "|format|dash" + eol +
    "|caption|Fig 1." + eol +
    "|a|b|c|d|e|" + eol +
    "|:---|---:|:---:|-:-|---|" + eol +
    "|1|2|3|4|5|" + eol +
    eol +
    "|quote|-:" + eol +
    "|source|Albert Einstein" + eol +
    "|--|--|" + eol +
    "|Lover brings much hapiness," + eol +
    "|much more so than pining for" + eol +
    "|someone brings pain." + eol; 

//let html = wmu.transformString(wmu_string);

    let html = wmu.processConfigFile("./config.wmu", true);

    console.log(`result:\n${html}`); 

