import * as WmuLib from "../WmuLib";

interface IWmuNonTagBlocks {
    _description: string; 
    blockType: string; 
    regex: RegExp;
}

const wmu_nontagblocks: IWmuNonTagBlocks[] = [
  {
    _description: 'a list', 
    blockType: 'list',
    regex: /^(?:\S+)(?::\d+)?\)\ /, 
  },
  {
    _description: 'a html comment', 
    blockType: 'htmlComment',
    regex: /^<!--\ /
  },
];

export function determineBlockType(str: string) {

	for (let item of wmu_nontagblocks) {
		if (item.regex.test(str)) {
			return item.blockType;
		}
	};

	return 'par';
}

