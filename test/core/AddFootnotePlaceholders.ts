import { AddFootnotePlaceholders } from '../../src/WmuDocument';
import { IConfig, IParsedBlock } from '../../src/types';

import { expect } from 'chai';
import 'mocha';

describe('WmuDocument - footnotes', () => {

  it('should add footnotes at the end of a chapter/header1', () => {

    let config: IConfig = { createToc: true };
    let blocks: IParsedBlock[] = [
        { 
            header: '|h1|=test hst 1', 
            body: [''], 
            tocNode: {
                title: '',
                level: 1,
                id: '634780635',
                index: 1,
                parent: null,
                numbering: '1',
                children: [],
            }
        },
        { 
            header: '|h2|=par 1.1', 
            body: [''], 
        },
        { 
            header: '|h1|=test hst 2', 
            body: [''], 
            tocNode: {
                title: '',
                level: 1,
                id: '634780604',
                index: 2,
                parent: null,
                numbering: '1',
                children: [],
            }
        },
        { 
            header: '|h2|=par 2.1', 
            body: [''], 
        },
    ];
    let result: string[] = [
        '<h1 id="id_634780635">1 test hst 1</h1>', 
        '<h2 id="id_1109554461">1.1 par 1.1</h2>', 
        '<h1 id="id_634780604">2 test hst 2</h1>', 
        '<h2 id="id_1109584252">2.1 par 2.1</h2>',
    ];


    AddFootnotePlaceholders( config, blocks, result );

    expect(result).to.eql(
        [
            '<h1 id="id_634780635">1 test hst 1</h1>', 
            '<h2 id="id_1109554461">1.1 par 1.1</h2>',
            '<!-- footnotes 634780635 -->\r\n\r\n' +
            '<h1 id="id_634780604">2 test hst 2</h1>', 
            '<h2 id="id_1109584252">2.1 par 2.1</h2>' +
            '<!-- footnotes 634780604 -->\r\n\r\n'
        ]);
  });

});