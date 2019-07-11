
const eol = "\r\n";

class TocNode {
    constructor(title, level, id, parent) {
        this.title = title;
        this.level = level;
        this.id = id;
        this.index = parent ? parent.children.length + 1 : null;
        this.parent = parent;
        this.children = [];
    }
}

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
    }

    toHtml() {
        return this.recursiveHtml(
            this.root.children.length == 1 ? // == 1: there are no parts
                this.root.children[0] : 
                this.root
            , 0
            );
    }

    hasContent() {
        return this.lastAdded.level > 0;
    }

    recursiveHtml(element, cnt) {
        if (element.children.length === 0) {
            return (element.level > 0) ? // > 0: exclude node titled 'parts'
                "\t".repeat(cnt) + "<li>" + element.title + " (" + element.id + ")</li>" + eol : 
                "";
        }
        else {
            let result = "";
            if (element.level > -1 && cnt > 0) {
                result+= "\t".repeat(cnt) + "<li>" + element.title + " (" + element.id + ")</li>" + eol;
            }
            result += "\t".repeat(cnt) + "<ul>" + eol;
            for (let i = 0; i < element.children.length; i++) {
                result += this.recursiveHtml(element.children[i], cnt + 1);
            }
            return result + "\t".repeat(cnt) + "</ul>" + eol;
        }
    }
}

var tocTree = new TocTree();
exports.tocTree = tocTree;

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