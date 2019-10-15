var wmubase = require('./wmu-base');

class TocNode {
    constructor(title, level, id, parent) {
        this.title = title;
        this.level = level;
        this.id = id;
        this.index = parent ? parent.children.length + 1 : null;
        this.parent = parent;
        this.children = [];
        tocIndex[id] = this;
    }
}

// wordt deze nog gebruikt?
var tocIndex = {};

class TocTree {
    constructor() {
        var rootNode = new TocNode('root', -1, 'id_root', null);
        this.root = rootNode;
        this.lastAdded = rootNode;
        this.addSequential('parts', 0, 'id_parts');
    }

    addSequential(title, level, id) {
        let currentNode = this.lastAdded;
        while (level <= currentNode.level) {
            currentNode = currentNode.parent;
        }
        let newChild = new TocNode(title, level, id, currentNode);
        currentNode.children.push(newChild);
        this.lastAdded = newChild;

        return this.lastAdded;
    }

    getCurrentChapterId() {
        // go back up the tree towards the h1:
        let currentNode = this.lastAdded;

        while (currentNode.level > 1) {
            currentNode = currentNode.parent;
        }
        return currentNode.level == 1 ? currentNode.id : null; // level is een string!
    }

    toHtml() {
        return this.recursiveHtml(
            this.root.children.length == 1 ?
                this.root.children[0] : // no Parts found, so start at H1 level
                this.root // start at the Parts level
            , 0
            );
    }

    hasContent() {
        return this.lastAdded.level > 0; // todo: type of level?
    }

    getIndex() {
        let chapterIndex = {};
        let parts = this.root.children;
        for (let x=0; x < parts.length; x++) {
            let chapters = parts[x].children;
            for (let y=0; y < chapters.length; y++) {
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

    getChapter(id) {
        return tocIndex[id];
    }

    recursiveHtml(element, cnt) {
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

// todo: nog een keer checken
var tocTree;
exports.tocTree = tocTree;
exports.newTocTree = function() {
    this.tocTree = new TocTree();
    tocIndex = {};
};

//todo: ???
if (false) {
    var tree = new TocTree();

    tree.addSequential('Part 1', 0);
    tree.addSequential('Hst1', 1);
    tree.addSequential('1.1', 2);
    tree.addSequential('Part2', 0);
    tree.addSequential('Hst2', 1);
    tree.addSequential('2.1', 2);
    tree.addSequential('4.0', 4);

    console.log(tree.toHtml())
}