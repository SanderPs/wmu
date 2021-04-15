import { IBlockDefinition } from "./../types";
import * as wmulist from "./../features/wmu-list";

export function parse(allVar: IBlockDefinition, body: string[]) {

	return new wmulist.ListTree( body[0], allVar
    // { 
    //   'start': allVar['start'],
    //   'type': allVar['type'],
    //   'block-align': allVar['block-align'],
    //   'width': allVar['width'],
    //   'format': allVar['format']
    // }
    ).toHtml();
}
