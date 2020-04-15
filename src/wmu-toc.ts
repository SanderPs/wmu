import * as wmubase from "./wmu-base";

interface IChapterIndex {
    [key: string]: {
        tocChapter: TocNode;
        partTitle?: string;
    }
}


class TocNode {
    title: string;
    level: number;
    id: string;
    index: number | null;
    parent: TocNode | null;
    children: TocNode[];

    constructor(title: string, level: number, id: string, parent: TocNode | null) {
        this.title = title;
        this.level = level;
        this.id = id;
        this.index = parent ? parent.children.length + 1 : null;
        this.parent = parent;
        this.children = [];
    }
}

class TocIndex {
    index: { [key: string]: TocNode };

    constructor() {
        this.index = {};
    }
    add(id: string, node: TocNode) {
        this.index[id] = node;
    }
    get(id: string) {
        return this.index[id];
    }
}

class TocTree {
    root: TocNode | null;
    lastAdded: TocNode | null;
    treeIndex: TocIndex | null;

    constructor() {
        var rootNode = new TocNode('root', -1, 'id_root', null);
        this.root = rootNode;
        this.lastAdded = rootNode;
        this.treeIndex = new TocIndex();
        this.treeIndex.add('id_root', rootNode);
        this.addSequential('parts', 0);
    }

    addSequential(title: string, level: number) {
        let id = wmubase.newElementId(title! + level);
      
        let currentNode = this.lastAdded;
        while (level <= currentNode!.level) { // todo: Non-Null Assertion Operator?
            currentNode = currentNode!.parent;
        }
        let newChild = new TocNode(title, level, id, currentNode);
        currentNode!.children.push(newChild); // todo: Non-Null Assertion Operator?
        this.lastAdded = newChild;
        this.treeIndex!.add(id, newChild);

        return id;
    }

    getCurrentChapterId() {
        // go back up the tree towards the h1:
        let currentNode = this.lastAdded;

        while (currentNode!.level > 1) { // todo: Non-Null Assertion Operator?
            currentNode = currentNode!.parent; // todo: Non-Null Assertion Operator?
        }
        return currentNode!.level === 1 ? currentNode!.id : null;
    }

    toHtml(tocTitle: string) {
        if (!this.hasContent())  return '';

        let tocHtml = [];

        if (tocTitle) {
            tocHtml.push('<h1>' + tocTitle + '</h1>' + wmubase.eol + wmubase.eol);
        }

        tocHtml.push(
            '<div id=\'tableofcontents\'>' + wmubase.eol +
            this.recursiveHtml(
                this.root!.children.length === 1 ?
                    this.root!.children[0] // no Parts found, so start at H1 level
                    :
                    this.root! // start at the Parts level
                , 0) +
            '</div>' + wmubase.eol + wmubase.eol);

        return tocHtml.join('');
    }

    hasContent() {
        return this.lastAdded!.level > 0;
    }

    getTocIndex() {
        let chapterIndex : IChapterIndex = {};
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

    recursiveHtml(element: TocNode, cnt: number) {
        if (element.children.length === 0) {
            return (element.level > 0) ? // > 0: exclude node titled 'parts'
                "\t".repeat(cnt) + "<li>" + element.title + " (" + element.id + ")</li>" + wmubase.eol : 
                "";
        }
        else {
            let result = "";
            if (element.level > -1 && cnt > 0) {
                result+= "\t".repeat(cnt) + "<li>" + element.title + " (" + element.id + ")</li>" + wmubase.eol;
            }
            result += "\t".repeat(cnt) + "<ul>" + wmubase.eol;
            for (let i = 0; i < element.children.length; i++) {
                result += this.recursiveHtml(element.children[i], cnt + 1);
            }
            return result + "\t".repeat(cnt) + "</ul>" + wmubase.eol;
        }
    }
}

export function newTocTree() {
    tocTree = new TocTree();
};

export let tocTree = new TocTree();
