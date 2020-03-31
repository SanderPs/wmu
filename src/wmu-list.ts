import * as wmubase from "./wmu-base";

class ListNode {

    title: string;
    level: number; // number of pipe characters at beginning of line
    type: string; // one of 'aAiI1', or else unordered; possibly followed by ':<value>'
    index: string | null;
    parent: ListNode | null;
    children: ListNode[];

    constructor(title: string, level: number, type: string, parent: ListNode | null) {
        let tv = level > -1 ? 
        type.match(/^(.*?)(?:(?=:|$)):?(.*?)$/) : 
        ['',''];
        this.title = title;
        this.level = level;
        this.type = tv![1] ?? '';
        this.index = tv![2] ?? null;
        this.parent = parent;
        this.children = [];
    }
}

export class ListTree {

    root: ListNode;
    lastAdded: ListNode;

    constructor(body: string) {

        let items = body.split(wmubase.eolIn);

        var rootNode = new ListNode('root', -1, 'id_root', null);
        this.root = rootNode;
        this.lastAdded = rootNode;
      
        for (let x=0; x < items.length;  x++) {
          let row = items[x].match(/^(\|*)(.*?(?: +))(.*)$/);

          // row[1] = the number of pipe characters at the beginning of the line
          // row[2] = the list-item marker (-1IaA etc)
          // row[3] = the text
          this.addSequential(row![3], row![1].length + 1, row![2].trim()); // todo: Non-Null Assertion Operator?
        }
    }

    addSequential(title: string, level: number, type: string) {
        let currentNode = this.lastAdded;
        while (level <= currentNode.level) {
            currentNode = currentNode.parent!; // todo: Non-Null Assertion Operator?
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
            ) + wmubase.eol;
    }

    hasContent() {
        return this.lastAdded.level > 0; // todo: type of level?
    }

    recursiveHtml(element: ListNode, cnt: number) {
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
