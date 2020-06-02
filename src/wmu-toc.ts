import * as wmubase from "./wmu-base";

interface IChapterIndex {
    [key: string]: {
        tocChapter: TocNode;
        partTitle?: string;
    }
}

interface headerTocInfo {
    id: string;
    numbering: string;
}


class TocNode {
    public title: string;
    public level: number;
    public id: string;
    public index: number | null;
    public parent: TocNode | null;
    public numbering: string;
    public children: TocNode[];

    constructor(title: string, level: number, id: string, parent: TocNode | null) {
        this.title = title;
        this.level = level;
        this.id = id;
        this.index = parent ? parent.children.length + 1 : null;
        this.parent = parent;
        this.children = [];
        let numbering: string;
        if (level === 0) {
            // parts
            numbering = (this.index - 1).toString(); // exclude first part node
        } else if (level === 1) {
            // chapters
            numbering = this.index.toString();
        } else if (level > 1) {
            // paragraphs
            numbering = parent.numbering + "." + this.index;
        } else {
            numbering = '';
        }
        this.numbering = numbering;
    }
}

class TocIndex {

    private index: { [key: string]: TocNode };

    constructor() {
        this.index = {};
    }

    public add(id: string, node: TocNode): void {
        this.index[id] = node;
    }

    public get(id: string): TocNode {
        return this.index[id];
    }
}

class TocTree {

    private root: TocNode | null;
    private lastAdded: TocNode | null;
    private treeIndex: TocIndex | null;

    constructor() {
        var rootNode = new TocNode('root', -1, 'id_root', null);
        this.root = rootNode;
        this.lastAdded = rootNode;
        this.treeIndex = new TocIndex();
        this.treeIndex.add('id_root', rootNode);
        this.addSequential('parts', 0);
    }

    public addSequential(title: string, level: number): headerTocInfo {
        let id = wmubase.newElementId(title! + level);
      
        let currentNode = this.lastAdded;
        while (level <= currentNode!.level) { // todo: Non-Null Assertion Operator?
            currentNode = currentNode!.parent;
        }
        let newChild = new TocNode(title, level, id, currentNode);
        currentNode!.children.push(newChild); // todo: Non-Null Assertion Operator?
        this.lastAdded = newChild;
        this.treeIndex!.add(id, newChild);

        return <headerTocInfo>{
            id: id,
            numbering: newChild.numbering
        };
    }

    public getCurrentChapterId(): string | null {
        // go back up the tree towards the h1:
        let currentNode = this.lastAdded;

        while (currentNode!.level > 1) { // todo: Non-Null Assertion Operator?
            currentNode = currentNode!.parent; // todo: Non-Null Assertion Operator?
        }
        return currentNode!.level === 1 ? currentNode!.id : null;
    }

    private hasContent(): boolean {
        return (this.root!.children.length > 1) || (this.root!.children[0].children.length > 0);
    }

    public getTocIndex(): IChapterIndex {

        let chapterIndex: IChapterIndex = {};
        let parts = this.root!.children;

        for (let x = 0; x < parts.length; x++) {
            let chapters = parts[x].children;
            for (let y = 0; y < chapters.length; y++) {
                chapterIndex[chapters[y].id] = {
                    tocChapter: chapters[y]
                };
            }
            if (parts.length > 1) {
                chapterIndex[chapters[0].id].partTitle = parts[x].title;
            }
        }

        return chapterIndex;
    }

    public toHtml(tocTitle: string, config: wmubase.IConfig): string {

        if (!this.hasContent())  return '';

        let tocHtml = [];

        if (tocTitle) {
            tocHtml.push('<h1>' + tocTitle + '</h1>' + wmubase.eol + wmubase.eol);
        }

        let hasParts = this.root!.children.length > 1;
        tocHtml.push(
            '<div id="tableofcontents">' + wmubase.eol +
            this.recursiveHtml(
                hasParts ?
                    this.root! : // start at the Parts level
                    this.root!.children[0] // no Parts found, so start at H1 level
                , 
                0, 
                "",
                hasParts,
                config
            ) +
            '</div>' + wmubase.eol + wmubase.eol);

        return tocHtml.join('');
    }

    private recursiveHtml(curNode: TocNode, cnt: number, numbering: string, 
        hasParts: boolean, config: wmubase.IConfig): string {

        // h6 should not be part of table of contents:
        if (curNode.level > 5) { 
            return "";
        }
         
        let nodeIsPart = (curNode.level === 0);

        let nodeNumbering: string;
        if (curNode.level < 1) {
            nodeNumbering='';
        }
        else {
            nodeNumbering=numbering + (numbering.length ? "." : "") + curNode.index;
        }

        let currentEl = (nodeIsPart && !hasParts) ? 
            "" : 
            "\t".repeat(cnt) + "<li><span class='numbering'>" + 
            (config.autoNumbering ? curNode.numbering : nodeNumbering) + // todo: numbering is done double
            "</span> " + curNode.title + "</li>" + wmubase.eol;

        if (curNode.children.length === 0) {

            // the first 'part'-node only exists as parent of h1 nodes in text with no parts:
            if (nodeIsPart && curNode.index === 1) {
                return "";
            }
                    
            // endpoint
            return currentEl;
        }
        else {
            // node with children
            let result = "";
            if (curNode.level > -1) { // add this node before adding children, except when this is rootNode, or h6
                result+= currentEl;
            }
            result += "\t".repeat(cnt) + "<ul class='indexlevel-" + (curNode.level + 1) + "'>" + wmubase.eol;
            for (let i = 0; i < curNode.children.length; i++) {
                result += this.recursiveHtml(curNode.children[i], cnt + 1, nodeNumbering, hasParts, config);
            }
            return result + "\t".repeat(cnt) + "</ul>" + wmubase.eol;
        }
    }
}

export function newTocTree() {
    tocTree = new TocTree();
};

export let tocTree = new TocTree();
