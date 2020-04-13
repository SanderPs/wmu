
// alternatieve regex opdelen blokken mbv |=\n


    // regex_block = new RegExp( 
    //     '(?:' +
    //         '[\r\n]*([\s\S]+?)' + // part 1
    //         '(?:(?:\|=\r?\n)([\s\S]+?))?' + // part 2
    //         '(?:(?:\|=\r?\n)([\s\S]+?))?' + // part 3
    //     ')' +
    //     '(?:\r?\n[\r\n]+)' // block divider
    //     , 'gm'
    // );

    regex_block = new RegExp(
        '[\\r\\n]*([\\s\\S]+?)(?:\\r?\\n)' +
        '(?:(?:\\|=\\r?\\n)([\\s\\S]*)(?:\\|=\\r?\\n))?' +
        '(?:(?:\\|=\\r?\\n)([\\s\\S]*)(?:\\|=))?'
        , 'gm'
    );

