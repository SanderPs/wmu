import { IBlockDefinition } from "./../types";
import * as wmulist from "./../features/wmu-list";

export function parse(allVar: IBlockDefinition, body: string) {

	return new wmulist.ListTree( body ).toHtml();
}
