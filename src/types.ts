export interface IConfig {
    toBook?: boolean;
    createToc?: boolean;
    tocTitle?: string;
    doctype?: string; // 'book', 'ebook', 'web'
    autoNumbering?: boolean;
    format?: string;
    keepComments?: boolean;
}

export interface IParsedBlock {
    part1: string;
    part2: string | undefined;
    part3: string | undefined;
}
