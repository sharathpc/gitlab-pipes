export interface message {
    status: boolean;
    apiUrl: string;
    token: string;
}

export interface IProject {
    id: number,
    web_url: string,
    name: string,
    last_activity_at: string
    avatar_url?: string,
    namespace: IProjectNamespace
}

export interface IProjectNamespace {
    id: number,
    name: string,
    kind: string,
    avatar_url?: string,
    web_url: string
}