import axios, { AxiosInstance } from "axios";
import { IMessage } from "./types";

export let GLOBAL_BASE_URL: string
const axiosRequest: AxiosInstance = axios.create();

axiosRequest.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            chrome.runtime.sendMessage({ action: 'refresh' }, (res: IMessage) => {
                if (res.status) {
                    updateRequestDetails(res.baseUrl, res.token);
                    return axios.request(error.config);
                }
            });
        } else {
            return Promise.reject(error);
        }
    }
);

export const updateRequestDetails = (BASE_URL: string, TOKEN: string) => {
    GLOBAL_BASE_URL = BASE_URL;
    axiosRequest.defaults.baseURL = `${BASE_URL}/api`;
    (axiosRequest.defaults.headers as any).common['Authorization'] = `Bearer ${TOKEN}`;
}

export const getProjects = async () => {
    return await axiosRequest.post(`/graphql`, {
        query: `{
            projects(membership: true, first: 50) {
                nodes {
                    id
                    name
                    webUrl
                    lastActivityAt
                    group {
                        id
                        name
                        avatarUrl
                        webUrl
                    }
                }
            }
        }`
    }).then((response: any) => response.data.data.projects.nodes)
}

export const getPipeLines = async (projectIds: any) => {
    const parseProjectIds = projectIds.map((item: string) => `"${item}"`).join(',');
    return await axiosRequest.post(`/graphql`, {
        query: `{
            projects(membership: true, ids: [${parseProjectIds}]) {
                nodes {
                    id
                    name
                    avatarUrl
                    webUrl
                    lastActivityAt
                    group {
                        id
                        name
                        avatarUrl
                        webUrl
                    }
                    pipelines(first: 2) {
                        nodes {
                            id
                            createdAt
                            updatedAt
                            status
                            complete
                            path
                            detailedStatus {
                                label
                                icon
                            }
                            user {
                                id
                                name
                                avatarUrl
                            }
                            stages {
                                nodes {
                                    id
                                    name
                                    status
                                    jobs(first: 1) {
                                        nodes {
                                            id
                                            detailedStatus {
                                                detailsPath
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                  }
            }
        }`
    }).then((response: any) => {
        return response.data.data.projects.nodes.map((project: any) => {
            project.pipelines = project.pipelines.nodes.map((pipeline: any) => {
                pipeline.stages = pipeline.stages.nodes.map((stage: any) => {
                    stage.job = stage.jobs.nodes.length ? stage.jobs.nodes[0] : null;
                    return stage;
                });
                return pipeline
            })
            return project;
        })
    })
}

export const setLocalStorageData = async (key: string, data: any) => {
    let payload: any = {};
    payload[key] = data;
    return await chrome.storage.local.set(payload);
}

export const getLocalStorageData = (keys: any) => {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get(keys, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            resolve(items);
        });
    })
}