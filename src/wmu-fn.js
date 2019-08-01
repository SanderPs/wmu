var wmubase = require('./wmu-base');

// todo: naar een class en ook .reset();
var allnotes = {};
var finalnotes = {};

exports.reset = function () {
    allnotes = {}; // todo: naar this.
    finalnotes = {};
};

exports.parseNotes = function (resultHtml) {

    // parse all numbers ([[1]]) and h1's:
    let result = resultHtml.replace(/(<h1 .+?>|\[\[.+?\]\])/g, this.parseNote);

    // insert all footnotes:
    for (let key in finalnotes) {
        if (finalnotes.hasOwnProperty(key)) {
            if (result.indexOf('<!-- footnotes ' + key + ' -->') > -1) {
                result = result.replace('<!-- footnotes ' + key + ' -->', finalnotes[key]);
            } else {
                result = result + finalnotes[key]; // is altijd unasigned?
            }
        }
    }

    return result;
}

exports.parseNote = function (found) {
    if (found.charAt(0) === '[') {
        // found a footnote id inline:
        let x = found.match(/\[\[(.+?)\]\]/)[1];

        return '<sup id="fnref:' + x + '">' +
            '<a href="#fn:' + x + '" rel="footnote">' + x + '</a>' +
            '</sup>';
    }
    // else:  found a chapter (h1) header:
    let currentChapterId = found.match(/ id="(.+?)"/)[1];
    if (allnotes[currentChapterId]) {
        // if it has notes, combine them and save them to finalnotes:
        let result = [];

        result.push(
            '<div class="footnotes">' + wmubase.eol +
            '\t<ol>' + wmubase.eol
        );

        for (let x = 0; x < allnotes[currentChapterId].length; x++) {
            result.push(
                '\t\t<li id="fn:' + allnotes[currentChapterId][x].footnoteIndex + '">' + wmubase.eol +
                '\t\t\t<p>' + allnotes[currentChapterId][x].footnoteText + wmubase.eol +
                '&nbsp;<a href="#fnref:' + allnotes[currentChapterId][x].footnoteIndex + '" class="reversefootnote">&#8593;</a></p>' + wmubase.eol +
                '\t\t</li>' + wmubase.eol
            );
        }

        result.push(
            '\t</ol>' + wmubase.eol +
            '</div>' + wmubase.eol + wmubase.eol
        );

        finalnotes[currentChapterId] = result.join('');
    }
    return found;
}

exports.storeFootnote = function (id, body, chapterId, newFnid) {

    if (chapterId === null) {
        chapterId = 'unasigned'
    }

    if (!allnotes[chapterId]) {
        allnotes[chapterId] = [];
    }

    allnotes[chapterId].push({
        footnoteUserId: id, // wordt niet gebruikt
        footnoteId: newFnid, // wordt niet gebruikt
        footnoteText: body,
        footnoteIndex: allnotes[chapterId].length + 1
    });
}