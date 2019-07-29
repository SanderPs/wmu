var wmubase = require('./wmu-base');
  
function wmuconfigblock(allVar, config) {

    if (allVar['toc'] && (!allVar['toc']===false) || (allVar['toctitle'] && allVar['toctitle'].length)) {
        config.createToc = true;
        if (allVar['toctitle'] && allVar['toctitle'].length) {
            config.tocTitle = allVar['toctitle']
        }
    }
}
  
module.exports = {
    wmuconfigblock
};
  