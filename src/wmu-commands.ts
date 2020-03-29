import * as wmubase from "./wmu-base";

export interface IWMUCommands {
    description: string; 
    type: string; 
    regex: RegExp;
    to: string;
    level?: string;
}

export const wmu_commands: IWMUCommands[] = [
    // { onnodig?
    //     description: 'ampersand',
    // type: 'inline',
    //     regex: /(?: *)&(?: *)/g,
    //     to: '&#x26;'
    // },

    {
        description: 'escaped-pipe', // when: 1. pipe is needed as first character of a line; 2. inside a table
        type: 'inline',
        regex: /\\\|/g,
        to: '&#x7c;'
    },
  
    // inline:
    {
        description: 'bold', 
        type: 'inline',
        regex: /(?:\*\*)(.+)(?:\*\*)/g, 
        to: '<b>$1</b>' 
    },
    {
        description: 'underscore', 
        type: 'inline',
        regex: /(?:\_\_)(.+)(?:\_\_)/g, 
        to: '<u>$1</u>' 
    },
    {
        description: 'strike-trough', 
        type: 'inline',
        regex: /(?:~~)(.+)(?:~~)/g, 
        to: '<del>$1</del>' 
    },
    {
        description: 'inline-quote', 
        type: 'inline',
        regex: /(?:"")(.+)(?:"")/g, 
        to: '<q>$1</q>' 
    },
    {
        description: 'inline-code',
        type: 'inline',
        regex: /(?:`)(.+)(?:`)/g,
        to: '<code>$1</code>'
    },
    {
        description: 'italic',
        type: 'inline',
        regex: /(?:\/\/)(.+)(?:\/\/)/g,
        to: '<i>$1</i>'
    },
    {
        description: 'superscript', 
        type: 'inline',
        regex: /(?:\^\^)(.+)(?:\^\^)/g, 
        to: '<sup>$1</sup>' 
    },
    {
        description: 'subscript', 
        type: 'inline',
        regex: /(?:\^_)(.+)(?:_\^)/g, // spiegelen! = de regel
        to: '<sub>$1</sub>' 
    },
    {
        description: 'class', 
        type: 'inline',
        regex: /(?:\[(.+)\])##(.+)(?:##)/g, 
        to: '<span class="$2">$1</span>' 
    },
    {
        description: 'hyperlink', 
        type: 'inline',
        regex: /(?:\[(.+)\])\(\((.+)(?:\)\))/g, 
        to: '<a href="$2">$1</a>' 
    },

    {
        description: 'markdown-header-1', 
        type: 'markdown',
        regex: /^(.+?)\r?\n={3,}/gm, 
        to: '|h1|$1' + wmubase.eol + wmubase.eol 
    },
    {
        description: 'markdown-header-2', 
        type: 'markdown',
        regex: /^(.+?)\r?\n-{3,}/gm, 
        to: '|h2|$1' + wmubase.eol + wmubase.eol 
    }
];