import React, { useCallback, useEffect } from 'react';
import TimeAgo from 'timeago-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import debounce from "lodash.debounce";
import '../../assets/styles/tailwind.css';
import './Projects.scss';

import { IProject } from '../../types';
import { getProjects, setLocalStorageData, getLocalStorageData } from '../../services';
import Preloader from '../Preloader';

interface IProps extends RouteComponentProps<any> { }

const ProjectsComponent: React.FC<IProps> = ({ history }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [projects, setProjects] = React.useState<IProject[]>([]);
  const [projectSearch, setProjectSearch] = React.useState<string>('');

  const getGitLabProjects = (projectSearch: string) => {
    setIsLoading(true);
    getLocalStorageData(['bookmarkProjectIds'])
      .then((data: any) => {
        getProjects(projectSearch)
          .then((response: IProject[]) => {
            const projectsList = response.map(project => {
              const projectExist = data.bookmarkProjectIds?.find((projectId: string) => projectId === project.id);
              project.bookmarkInd = !!projectExist;
              return project;
            })
            setProjects(projectsList)
          })
          .finally(() => setIsLoading(false));
      });
  }

  const toggleBookmarkProject = async (projectId: string, bookmarkInd: boolean) => {
    getLocalStorageData(['bookmarkProjectIds'])
      .then((data: any) => {
        let bookmarkProjectIds: string[] = data.bookmarkProjectIds || [];
        const updatedProjects = projects.map((project: IProject) => {
          if (project.id === projectId) {
            const projectIndex = bookmarkProjectIds.indexOf(projectId);
            project.bookmarkInd = bookmarkInd;
            if (project.bookmarkInd) {
              bookmarkProjectIds.push(project.id);
            } else if (projectIndex > -1) {
              bookmarkProjectIds.splice(projectIndex, 1);
            }
          }
          return project;
        })
        setProjects(updatedProjects);
        setLocalStorageData('bookmarkProjectIds', bookmarkProjectIds);
      });
  }

  const debounceFn = useCallback(debounce(getGitLabProjects, 500), []);

  useEffect(() => debounceFn(projectSearch), [projectSearch]);

  const ProjectItem: React.FC<{ project: IProject }> = ({ project }) => {
    return (
      <li className="flex justify-between items-center py-2 px-3 mb-1 rounded-md hover:bg-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 p-1 mr-2 text-center text-base rounded-md bg-blue-300 text-white">{project.name.substring(0, 1).toUpperCase()}</div>
          <div>
            <a href={project.webUrl} target="_blank" className="text-gray-200 font-bold">{project.name}</a>
            <div className="flex items-center">
              <img src={project.group.avatarUrl} alt={project.group.name} className="w-4 h-4 rounded-full" />
              <span className="ml-1">{project.group.name}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center w-44">
          <TimeAgo datetime={project.lastActivityAt} />
          <i className={`cursor-pointer ${project.bookmarkInd ? 'icon-bookmark' : 'icon-bookmark-o'}`} title={project.bookmarkInd ? 'Remove' : 'Add'} onClick={() => toggleBookmarkProject(project.id, !project.bookmarkInd)}></i>
        </div>
      </li>
    )
  }

  return (
    <div className="h-full projects-section">
      <div className="mb-2">
        <div className="flex items-center mb-1">
          <i className="icon-arrow-circle-left text-base cursor-pointer leading-none px-3" title="Back to Dashboard" onClick={() => history.goBack()}></i>
          <div className="text-lg font-semibold">Projects List</div>
        </div>
        <div className="mx-2">
          <input
            type="text"
            className="border rounded w-full py-1.5 px-3 text-white focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
            placeholder="Search..."
            value={projectSearch}
            onChange={($event) => setProjectSearch($event.target.value)}
          />
        </div>
      </div>
      {
        isLoading ?
          <div className="flex justify-center items-center h-full content-footer-height">
            <Preloader />
          </div> : (
            projects.length ?
              <ul className="content-footer-height overflow-y-scroll">
                {projects.map((project: IProject) => <ProjectItem key={project.id} project={project} />)}
              </ul> :
              <div className="flex flex-col justify-center items-center h-full content-footer-height">
                <div className="mb-3">No Projects available</div>
              </div>
          )
      }
    </div>
  );
};



export default withRouter(ProjectsComponent);
