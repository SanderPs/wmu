import * as WmuLib from "../WmuLib";

export type propType = ((substring: string, ...args: any[]) => string);
//(all: string, g1: string, g2: string, g3: string) => string;

export interface IWMUCommands {
    _description?: string; 
    type: string; 
    _example?: string;
    regex: RegExp;
    to: propType | string;
    level?: string;
}


// todo: net als launch.json:     "version": "0.2.0",
export const wmu_commands: IWMUCommands[] = [

    // inline:
    {
        _description: 'bold',
        type: 'inline',
        regex: /(?:\*\*)(.+?)(?:\*\*)/g,
        to: '<b>$1</b>'
    },
    {
        _description: 'underscore',
        type: 'inline',
        regex: /(?:!!)(.+?)(?:!!)/g,
        to: '<u>$1</u>'
    },
    {
        _description: 'strike-trough',
        type: 'inline',
        regex: /(?:~~)(.+?)(?:~~)/g,
        to: '<del>$1</del>'
    },
    {
        _description: 'inline-quote', 
        type: 'inline',
        regex: /(?:"")(.+?)(?:"")/g, 
        to: '<q>$1</q>' 
    },
    {
        _description: 'inline-code',
        type: 'inline',
        regex: /(?:``)(.+?)(?:``)/g,
        to: '<code>$1</code>'
    },
    {
        _description: 'italic',
        type: 'inline',
        regex: /([^:])(?:\/\/)(.+?)([^:])(?:\/\/)/g,
        to: '$1<i>$2</i>$3'
    },
    {
        _description: 'superscript', 
        type: 'inline',
        regex: /(?:\^\^)(.+?)(?:\^\^)/g, 
        to: '<sup>$1</sup>' 
    },
    {
        _description: 'subscript', 
        type: 'inline',
        regex: /(?:__)(.+?)(?:__)/g,
        to: '<sub>$1</sub>' 
    },
    {
        _description: 'class', 
        type: 'inline',
        _example: '[[$text]]##$class##',
        regex: /(?:\[\[(.+?)\]\])##(.+?)(?:##)/g, 
        to: '<span class="$2">$1</span>' 
    },
    {
        _description: 'hyperlink (with text)', 
        type: 'inline',
        _example: '[[$text]]@@$link@@(_blank@@)',
        regex: /(?:\[\[(.+?)\]\])@@(.+?)(?:@@)(_blank@@)?/g, 
        to: (all, g1, g2, g3) => {
            return '<a href="' + g2 + '"' + (g3 ? ' target="_blank"' : '') + '>' + g1 + '</a>'
        } 
    },
    {
      _description: 'hyperlink (without text)', 
      type: 'inline',
      _example: '@@http(s)://somesite.com/some%20link@@',
      regex: /(?:@@)(.+?)(?:@@)/g, 
      to: '<a href="$1">$1</a>' 
    },

    {
        _description: 'diff ins, del, note', 
        type: 'inline',
        _example: '[[$text]]::ins|del|note::',
        regex: /(?:\[\[(.+?)\]\])::(ins|del|note)::/g, 
        to: '<span class="code-$2">$1</span>' 
    },
    {
        _description: 'diff del', 
        type: 'inline',
        _example: '[[$text]]::$link::',
        regex: /(?:\[\[(.+?)\]\])::del::/g, 
        to: '<span class="code-del">$1</span>' 
    },

    {
        _description: 'markdown-header-1', 
        type: 'markdown',
        _example: `$1\n===$`,
        regex: /^(.+?)\r?\n={3,}$/gm, 
        to: '|h1|$1' + WmuLib.eol + WmuLib.eol 
    },
    {
        _description: 'markdown-header-2', 
        type: 'markdown',
        _example: `$1\n---$`,
        regex: /^(.+?)\r?\n-{3,}$/gm, 
        to: '|h2|$1' + WmuLib.eol + WmuLib.eol 
    }
];
