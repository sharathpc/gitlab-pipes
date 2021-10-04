export interface IMessage {
    status: boolean;
    baseUrl: string;
    token: string;
}

export interface IProject {
    id: string,
    name: string,
    webUrl: string,
    lastActivityAt: string,
    bookmarkInd: boolean,
    group: IProjectGroup
}

export interface IProjectGroup {
    id: string,
    name: string,
    avatarUrl?: string,
    webUrl: string
}