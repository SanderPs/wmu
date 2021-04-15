import * as WmuLib from "../WmuLib";

class ListNode {

    public title: string;
    public level: number; // number of pipe characters at beginning of line
    public type: string; // one of 'aAiI1', or else unordered; possibly followed by ':<value>'
    public index: string | null;
    public parent: ListNode | null;
    public children: ListNode[];

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

export interface IListOptions {
  'start'?: number;
  'type'?: string;
  'block-align'?: string;
  'width'?: number;
  'format'?: string[];
}

export class ListTree {

    private root: ListNode;
    private lastAdded: ListNode;
    private options: IListOptions;

    constructor(body: string, opt: object) {

        this.options = opt || {};

        let items = body?.split(WmuLib.eolIn);
        if (items) {
        var rootNode = new ListNode('root', -1, 'id_root', null);
        this.root = rootNode;
        this.lastAdded = rootNode;
      
        for (let x=0; x < items.length;  x++) {
          if (items[x].length > 0) {
            let row = items[x].match(/^((?:\|(?:[\t ]*))*)(?:(.+?)(?:\)?[\t ]+))(.*)$/);
            if (row) {
              // row[1] = the number of pipe characters at the beginning of the line
              // row[2] = the list-item marker (-1IaA etc)
              // row[3] = the text
              this.addSequential(row?.[3], (row?.[1].replace(/[\t ]/g,'')).length + 1, row?.[2].trim()); // todo: Non-Null Assertion Operator?
            }
          }
          // todo: else = empty line, ignore?
        }
      } else {
        // ?
      }
    }

    public addSequential(title: string, level: number, type: string) {

      if (isNaN(level)) return;
      if (!this.lastAdded) return;

        let currentNode = this.lastAdded;

        while (level <= currentNode.level) {
            currentNode = currentNode.parent!;
        }

        let newChild = new ListNode(title, level, type, currentNode);
        currentNode.children.push(newChild);
        this.lastAdded = newChild;

        return this.lastAdded;
    }

    public toHtml(): string {

        if (!this.hasContent())  return '';

        return this.recursiveHtml( this.root, 0 ) + WmuLib.eol;
    }

    private hasContent(): boolean {
        return this.lastAdded?.level > 0;
    }

    private recursiveHtml(element: ListNode, cnt: number) {

        if (element.children.length === 0) {
            return (element.level > 0) ?
            '\t'.repeat(cnt-1) + '<li' +
            (element.index ? ' value="' + element.index + '"' : '') +
            '><span>' + element.title + '</span></li>' + WmuLib.eol : 
            '';
        }
        else {
            let result = '';
            if (element.level > -1 && cnt > 0) {
                result+= '\t'.repeat(cnt-1) + '<li><span>' + element.title + '</span>' + WmuLib.eol;
            }

            let listType = this.options.type || element.children[0].type || null;
            let isListTypeOrdered = 'aAiI1'.indexOf(listType) > -1;
// todo type should be class

            result += '\t'.repeat(cnt) + 
              '<' + (isListTypeOrdered ? 'ol' : 'ul') +

              (this.options.start ? ' start="' + this.options.start + '"' : '') +

              WmuLib.attrString(' style', 
                (this.options.width ? 'width: ' + this.options.width + '%;' : '')
                ) +

              WmuLib.classAttr(
                'list-style-' + listStyleClass(listType),
                WmuLib.alignmentClass(this.options['block-align'] ?? '', true) ?? '',
                (this.options.format?.indexOf('inside') > -1) ? 'list-style-inside' : '' // 'list-style-outside'
              ) +

              '>' + WmuLib.eol;
              
            for (let i = 0; i < element.children.length; i++) {
                result += this.recursiveHtml(element.children[i], cnt + 2);
            }
            result = result + '\t'.repeat(cnt) + '</' + (isListTypeOrdered ? 'ol' : 'ul') + '>' + WmuLib.eol;
            if (element.level > -1 && cnt > 0) {
                result = result + '\t'.repeat(cnt-1) + '</li>' + WmuLib.eol;
            }
            return result;
        }
    }
}

function listStyleClass(str: string) : string {
  let result='none';

  switch (str) {
    case 'a':
      result= 'lower-alpha';
      break;
    case 'A':
      result= 'upper-alpha';
      break;
    case 'i':
      result= 'lower-roman';
      break;
    case 'I':
      result= 'upper-roman';
      break;
    case 'o':
      result= 'circle';
      break;
    case '*':
      result= 'disc';
      break;
    case '#':
      result= 'square';
      break;
    case '-':
      result= 'dash';
      break;
  }

  if (/\d+/.test(str)) {
    result= 'decimal';
  }

  return result;
}