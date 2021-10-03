import axios, { AxiosInstance } from "axios";
import { message } from "./types";

const axiosRequest: AxiosInstance = axios.create();

axiosRequest.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            chrome.runtime.sendMessage({ action: 'refresh' }, (res: message) => {
                if (res.status) {
                    updateRequestDetails(res.apiUrl, res.token);
                    return axios.request(error.config);
                }
            });
        } else {
            return Promise.reject(error);
        }
    }
);

export const updateRequestDetails = (API_URL: string, TOKEN: string) => {
    axiosRequest.defaults.baseURL = API_URL;
    (axiosRequest.defaults.headers as any).common['Authorization'] = `Bearer ${TOKEN}`;
}

export const getProjects = async () => {
    return await axiosRequest.get(`/projects?simple=true&min_access_level=30&per_page=30`)
}

export const getPipeLines = async (projectId: number) => {
    return await axiosRequest.get(`/projects/${projectId}/pipelines?per_page=2`)
}