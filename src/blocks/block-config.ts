import * as WmuLib from "../WmuLib";
import { IConfig, IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, config: IConfig) {

    let result = [];

    result.push('<!-- config: ' + WmuLib.eol);

    if (allVar['toc'] && (!allVar['toc']===false) || (allVar['toctitle'] && allVar['toctitle'].length)) {

        config.createToc = true;
        result.push('createToc = true; ' + WmuLib.eol)

        if (allVar['toctitle'] && allVar['toctitle'].length) {
            config.tocTitle = allVar['toctitle']
            result.push('tocTitle = ' + allVar['toctitle'] + '; ' + WmuLib.eol)
        }
    }
    if (allVar['keepComments'] == 'yes') {
      config.keepComments = true;
      result.push('keepComments = true; ' + WmuLib.eol)
    }

    result.push(' -->' + WmuLib.eol + WmuLib.eol);

    return result.join('');
}
