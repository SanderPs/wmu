import { TocNode } from "./features/wmu-toc";

export interface IConfig {
    toBook?: boolean;
    createToc?: boolean;
    tocTitle?: string;
    doctype?: string; // 'book', 'ebook', 'web'
    autoNumbering?: boolean;
    format?: string;
    keepComments?: boolean;
    codeOutputFormat?: string;
}

export interface IWmuProject {
    files?: string;
    css?: string;
    outputPath?: string; // current folder = './'
}

export interface IParsedBlock {
    header: string;
    body: string[] | undefined;
    tocNode?: TocNode;
}

export interface IBlockDefinition {
    'block-type'?: string;
    'level'?: number;
    'number'?: number;
    'block-align'?: string;
    'title'?: string;
    'language'?: string;
    'format'?: string[];
    'src'?: string;
    'multiline'?: string;
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