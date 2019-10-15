var wmubase = require('./wmu-base');

class ListNode {
    constructor(title, level, type, parent) {
        let tv = level > -1 ? type.match(/^(.*?)(?:(?=:|$)):*(.*?)$/) : [];
        this.title = title;
        this.level = level;
        this.type = tv[1];
        this.index = tv[2] ? tv[2] : null;
        this.parent = parent;
        this.children = [];
    }
}

class ListTree {
    constructor(body) {

        let items = body.split(wmubase.eolIn);

        var rootNode = new ListNode('root', -1, 'id_root', null);
        this.root = rootNode;
        this.lastAdded = rootNode;
      
        for (let x=0; x < items.length;  x++) {
          let row = items[x].match(/^(\|*)(.*?(?: +))(.*)$/);

          this.addSequential(row[3], row[1].length + 1, row[2].trim());
        }
        
    }

    addSequential(title, level, type) {
        let currentNode = this.lastAdded;
        while (level <= currentNode.level) {
            currentNode = currentNode.parent;
        }
        let newChild = new ListNode(title, level, type, currentNode);
        currentNode.children.push(newChild);
        this.lastAdded = newChild;

        return this.lastAdded;
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

    recursiveHtml(element, cnt) {
        if (element.children.length === 0) {
            return (element.level > 0) ? // > 0: exclude node titled 'parts'
            '\t'.repeat(cnt-1) + '<li' +
            (element.index ? ' value="' + element.index + '"' : '') +
            '>' + element.title + '</li>' + wmubase.eol : 
            '';
        }
        else {
            let result = '';
            if (element.level > -1 && cnt > 0) {
                result+= '\t'.repeat(cnt-1) + '<li>' + element.title + wmubase.eol;
            }
            let listTypeOrdered = 'aAiI1'.indexOf(element.children[0].type) > -1;
            result += '\t'.repeat(cnt) + 
            '<' + (listTypeOrdered ? 'ol' : 'ul') +
            (listTypeOrdered ? ' type="' + element.children[0].type + '"' : '') +
            '>' + wmubase.eol;
            for (let i = 0; i < element.children.length; i++) {
                result += this.recursiveHtml(element.children[i], cnt + 2);
            }
            result = result + '\t'.repeat(cnt) + '</' + (listTypeOrdered ? 'ol' : 'ul') + '>' + wmubase.eol;
            if (element.level > -1 && cnt > 0) {
                result = result + '\t'.repeat(cnt-1) + '</li>' + wmubase.eol;
            }
            return result;
        }
    }
}

exports.newListTree = function(x) {
    return new ListTree(x);
};
