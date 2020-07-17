import { IConfig, IWmuProject } from "./types";
import { WmuDocument } from "./WmuDocument";

export function transformFragment(wmustring: string, config: IConfig): string {

    return new WmuDocument(
        wmustring, 
        Object.assign({}, config, <IConfig>{format : 'fragment'}),
        {} as IWmuProject
    ).toHtml();
}

export function transformPage(wmustring: string, config: IConfig, projectData: IWmuProject): string {

    return new WmuDocument(
        wmustring, 
        Object.assign({}, config, <IConfig>{format : 'page'}),
        projectData
    ).toHtml();
}
