import * as wmubase from "./../wmu-base";
import { IConfig, IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, config: IConfig) {

    let result = [];

    result.push('<!-- config: ' + wmubase.eol);

    if (allVar['toc'] && (!allVar['toc']===false) || (allVar['toctitle'] && allVar['toctitle'].length)) {

        config.createToc = true;
        result.push('createToc = true; ' + wmubase.eol)

        if (allVar['toctitle'] && allVar['toctitle'].length) {
            config.tocTitle = allVar['toctitle']
            result.push('tocTitle = ' + allVar['toctitle'] + '; ' + wmubase.eol)
        }
    }

    result.push(' -->' + wmubase.eol + wmubase.eol);

    return result.join('');
}
