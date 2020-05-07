import * as wmubase from "./../wmu-base";

export function parse(allVar: wmubase.IBlockDefinition, body: string) {

    const parts = body.match(/@(.+?)({[\s\S]+})$/);
    const props = JSON.parse(parts[2]);

    if (parts[1] === 'book') {
        return bibjsonBookHtml(props);
    }

    return body; // no transformation if not recogized
}

function bibjsonBookHtml(vars: any): string {

    return `<p id="${vars.id}" class="bibref">
<span class="creator">${vars.author}</span>
<span class="date"> (<span class="year">${vars.year}</span>) </span>
<span class="title">${vars.title}</span>
</p>

`;

}
