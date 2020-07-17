export interface IConfig {
    toBook?: boolean;
    createToc?: boolean;
    tocTitle?: string;
    doctype?: string; // 'book', 'ebook', 'web'
    autoNumbering?: boolean;
    format?: string;
    keepComments?: boolean;
}

export interface IWmuProject {
    files?: string;
    css?: string;
    outputPath?: string; // current folder = './'
}

export interface IParsedBlock {
    part1: string;
    part2: string | undefined;
    part3: string | undefined;
}

export interface IBlockDefinition {
    'block-type'?: string;
    'level'?: number;
    'number'?: number;
    'block-align'?: string;
    'title'?: string;
    'language'?: string;
    'format'?: string;
    'src'?: string;
    'start'?: string;
    'id'?: string;
    [key: string]: any; // todo: why type any and not type string?
}

export interface IHtmlPositions {
    lang: string;
    toc: string;
    body: string;
    head: string;
    index: string;
}