import * as WmuLib from "../WmuLib";
import { IBlockDefinition } from "./../types";

export function parse(allVar: IBlockDefinition, body: string) {

	return '<p' + 
		WmuLib.classAttr(
			allVar!['format'] ?? ''
		) + '>' + WmuLib.eol +
		WmuLib.NewlineToBr(body) + WmuLib.eol +
		'</p>' + WmuLib.eol + WmuLib.eol
	;
}
