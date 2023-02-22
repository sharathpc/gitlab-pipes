export interface IMessage {
    status: boolean;
    baseURL: string;
    token: string;
    message: any;
}

export interface IProject {
    id: string,
    name: string,
    avatarUrl: string,
    webUrl: string,
    lastActivityAt: string,
    bookmarkInd: boolean,
    isExpanded: boolean,
    group: IGroup,
    pipelines: IPipeline[]
}

export interface IGroup {
    id: string,
    name: string,
    avatarUrl: string,
    webUrl: string
}

export interface IPipeline {
    id: string,
    createdAt: string,
    updatedAt: string,
    status: string,
    complete: boolean,
    path: string,
    duration: number,
    detailedStatus: {
        label: string,
        icon: string
    }
    user: IPipeUser,
    stages: IPipeStage[]
}
export interface IPipeUser {
    id: string,
    name: string,
    avatarUrl: string,
    webUrl: string
}
export interface IPipeStage {
    id: string,
    name: string,
    status: string,
    job: IStageJob
}
export interface IStageJob {
    id: string,
    detailedStatus: {
        detailsPath: string
    }
}